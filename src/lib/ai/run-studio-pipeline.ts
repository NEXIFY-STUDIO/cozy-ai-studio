import { toast } from "sonner";
import { useStudioStore } from "@/stores/studio-store";
import {
  runMultiAgentPipeline,
  type PipelineCallbacks,
  type PipelineResult,
} from "./orchestrator";
import {
  isClientDemoPipeline,
  runRemoteMultiAgentPipeline,
} from "./run-remote-pipeline";
import { PipelineError } from "./errors";
import {
  recordMyPromptUsage,
  ensureMyProject,
} from "@/lib/projects/functions";
import { persistPendingApproval } from "@/hooks/useProjectSync";
import {
  computeBackoffMs,
  getRetryPolicy,
  isAutoRetryable,
  waitWithAbort,
  DEFAULT_RETRY_POLICY,
  type RetryPolicy,
} from "./retry-policy";
import { runPreflight } from "./preflight";
import type { FilePatch } from "./patch-contract";

export type RunPipelineOptions = {
  autoRetry?: boolean;
  forceDemo?: boolean;
};

function shouldUseDemo(forceDemo?: boolean): boolean {
  if (forceDemo) return true;
  return isClientDemoPipeline();
}

/**
 * G0→G1→G2 with auto-retry + preflight contract before HitL.
 */
export async function runStudioPipeline(
  prompt: string,
  options: RunPipelineOptions = {},
): Promise<boolean> {
  const autoRetry = options.autoRetry !== false;
  const trimmed = prompt.trim();
  const store = useStudioStore.getState();

  if (!trimmed) {
    toast.error("Prompt cannot be empty", {
      description: "Describe a UI change, or pick an error-handling example.",
    });
    store.setPipelineError({
      code: "EMPTY_PROMPT",
      agent: "ORCHESTRATOR",
      userMessage: "Prompt cannot be empty.",
      exampleFix: "Describe a UI change, e.g. “Add a pricing section”.",
      retryable: false,
      recoverable: true,
    });
    return false;
  }

  if (store.isPipelineRunning) {
    toast.message("Pipeline already running");
    return false;
  }

  if (store.planTier === "FREE" && store.promptsUsed >= store.promptLimit) {
    toast.error("Free monthly limit reached", {
      description: `${store.promptsUsed}/${store.promptLimit} prompts this month. Server also enforces a daily cap.`,
    });
    store.setPipelineError({
      code: "RATE_LIMIT",
      agent: "ORCHESTRATOR",
      userMessage: "Free monthly prompt limit reached.",
      detail: `${store.promptsUsed}/${store.promptLimit} prompts used`,
      exampleFix:
        "Wait for the next month, or enable Stripe billing when keys are configured.",
      retryable: false,
      recoverable: true,
    });
    return false;
  }

  const started = Date.now();
  store.clearPipelineError();
  store.resetRetryState();
  store.resetAgents();
  store.setPreflightReport(null);
  const signal = store.beginPipeline();
  store.incrementPrompts();
  store.addChat({ role: "user", content: trimmed });
  useStudioStore.setState({ lastPrompt: trimmed });

  const original = store.files[store.activeFile]?.content ?? store.originalCode;
  let attempt = 0;
  let lastError: PipelineError | null = null;
  let policy: RetryPolicy | null = null;
  let useDemo = shouldUseDemo(options.forceDemo);
  let fellBackToDemo = false;

  const buildCallbacks = (): PipelineCallbacks => ({
    signal,
    attempt,
    onAgentUpdate: (patch) => store.updateAgent(patch.id, patch),
    onStreamCode: (code) => store.streamModifiedCode(code),
    onChat: (content, agent) =>
      store.addChat({ role: "assistant", content, agent }),
    onPhase: (phase) => store.setPipelinePhase(phase),
    onTaskGraph: (nodes) => store.setTaskGraph(nodes),
    onProgress: (pct, label) =>
      store.setPipelineProgress(
        pct,
        attempt > 0 ? `Retry ${attempt + 1}: ${label}` : label,
      ),
  });

  const runOnce = async (): Promise<PipelineResult> => {
    const callbacks = buildCallbacks();
    if (useDemo) {
      return runMultiAgentPipeline(trimmed, original, callbacks);
    }
    try {
      return await runRemoteMultiAgentPipeline(
        {
          prompt: trimmed,
          originalCode: original,
          activeFile: store.activeFile,
          files: store.files,
        },
        callbacks,
      );
    } catch (e) {
      const err = PipelineError.fromUnknown(e);
      if (
        !fellBackToDemo &&
        (err.message === "MISSING_API_KEY" ||
          err.message === "DEMO_PIPELINE" ||
          err.detail?.includes("MISTRAL_API_KEY") ||
          err.userMessage.includes("no Mistral key"))
      ) {
        fellBackToDemo = true;
        useDemo = true;
        store.addChat({
          role: "system",
          content:
            "Production AI unavailable (no MISTRAL_API_KEY). Falling back to offline demo pipeline.",
        });
        toast.message("Demo pipeline", {
          description: "Mistral key missing — using offline mock agents.",
        });
        return runMultiAgentPipeline(trimmed, original, {
          ...callbacks,
          attempt,
        });
      }
      throw e;
    }
  };

  try {
    while (true) {
      try {
        if (attempt > 0) {
          store.resetAgents();
          store.setPipelineRunning(true);
          store.setPipelinePhase("planning");
          store.setPipelineProgress(0, `Retry ${attempt + 1}…`);
          store.setRetryState({
            retryAttempt: attempt,
            isAutoRetrying: true,
            retryCountdownMs: 0,
          });
          store.addChat({
            role: "system",
            content: `Auto-retry ${attempt}/${policy?.maxRetries ?? "?"} after ${lastError?.code ?? "error"}…`,
          });
          toast.message(`Retrying pipeline (attempt ${attempt + 1})`, {
            description: lastError
              ? `Recovering from ${lastError.code}`
              : undefined,
          });
        }

        store.setRetryState({
          retryAttempt: attempt,
          isAutoRetrying: attempt > 0,
        });

        const result = await runOnce();

        // ── P1: build + validate G1 patches ───────────────────────────
        const rawPatches: Partial<FilePatch>[] = result.filePatches?.length
          ? result.filePatches.map((p) => ({
              path: p.path,
              content: p.content,
              language: p.language,
              op: p.op ?? "write",
            }))
          : [
              {
                path: result.filePath,
                content: result.code,
                language: result.language,
                op: "write",
              },
            ];

        store.setPipelineProgress(92, "Preflight contract…");
        const preflight = runPreflight(rawPatches);
        store.setPreflightReport({
          ok: preflight.ok,
          canAccept: preflight.canAccept,
          checks: preflight.checks,
          issues: preflight.issues.map((i) => ({
            path: i.path,
            code: i.code,
            message: i.message,
            severity: i.severity,
          })),
          patchCount: preflight.patches.length,
          ranAt: preflight.ranAt,
        });

        if (!preflight.canAccept) {
          store.addChat({
            role: "system",
            content: `Preflight blocked HitL: ${preflight.issues
              .filter((i) => i.severity === "error")
              .map((i) => i.message)
              .join("; ")}`,
          });
          toast.error("Preflight failed — patches rejected", {
            description: "Fix agent output or retry with a clearer prompt.",
          });
          store.setPipelineError({
            code: "UNKNOWN",
            agent: "G1_CODER",
            userMessage: "G1 patch contract failed preflight.",
            detail: preflight.issues.map((i) => i.message).join(" · "),
            exampleFix: "Retry prompt; avoid binary paths and path traversal.",
            retryable: true,
            recoverable: true,
          });
          store.setPipelineRunning(false);
          store.setPipelinePhase("failed");
          return false;
        }

        if (store.files[result.filePath]) {
          store.setActiveFile(result.filePath);
        }

        // Stage multi-file content into tree as proposed (not accepted yet)
        // Only primary goes to diff view; siblings sit ready in pending.filePatches
        for (const p of preflight.patches) {
          if (p.path === result.filePath) continue;
          if (p.content) {
            // keep in pending only until Accept — optional soft stage
          }
        }

        const base =
          useStudioStore.getState().files[result.filePath]?.content ?? original;
        const primaryContent =
          preflight.patches.find((p) => p.path === result.filePath)?.content ??
          result.code;
        store.setDiff(base, primaryContent, result.language);
        store.setPipelineLatency(Date.now() - started);
        const approvalDesc = [
          result.audit.healed ? "Auto-healed by G2 loop." : null,
          attempt > 0 ? `Succeeded after ${attempt} retry(ies).` : null,
          fellBackToDemo ? "Ran via offline demo fallback." : null,
          !useDemo && !fellBackToDemo ? "Mistral production pipeline." : null,
          preflight.ok
            ? `Preflight OK · ${preflight.patches.length} file(s).`
            : `Preflight warnings · ${preflight.patches.length} file(s).`,
          result.description,
        ]
          .filter(Boolean)
          .join(" ");

        store.setPendingApproval({
          title: result.title,
          description: approvalDesc,
          affectedFiles:
            preflight.patches.map((p) => p.path).length > 0
              ? preflight.patches.map((p) => p.path)
              : result.affectedFiles,
          originalCode: base,
          modifiedCode: primaryContent,
          language: result.language,
          previewHtml: result.previewHtml,
          filePatches: preflight.patches.map((p) => ({
            path: p.path,
            content: p.content,
            language: p.language,
          })),
        });

        try {
          const project = await ensureMyProject();
          await persistPendingApproval({
            projectId: project.id,
            title: result.title,
            description: approvalDesc,
            affectedFiles: preflight.patches.map((p) => p.path),
            originalCode: base,
            modifiedCode: primaryContent,
            language: result.language,
            previewHtml: result.previewHtml,
          });
        } catch {
          /* unauthenticated / offline */
        }

        const timing = result.phases
          .map((p) => `${p.agent.replace("_", " ")} ${p.durationMs}ms`)
          .join(" · ");
        toast.success(
          attempt > 0
            ? `Pipeline recovered after ${attempt} retry(ies)`
            : result.audit.healed
              ? "Pipeline complete after auto-heal"
              : useDemo
                ? "Demo pipeline complete — review the diff"
                : "Pipeline complete — review the diff",
          { description: timing },
        );
        try {
          const project = await ensureMyProject();
          const usage = await recordMyPromptUsage({
            data: {
              projectId: project.id,
              promptPreview: trimmed,
              provider: useDemo || fellBackToDemo ? "demo" : "mistral",
              agent: "G0_G1_G2",
              tokensIn: Math.ceil(trimmed.length / 4),
            },
          });
          if (usage && typeof usage === "object" && "promptsUsed" in usage) {
            useStudioStore.setState({
              promptsUsed: (usage as { promptsUsed: number }).promptsUsed,
            });
          }
        } catch {
          /* ignore */
        }

        store.setPipelineRunning(false);
        store.setPipelinePhase("completed");
        store.setPipelineProgress(100, "Awaiting approval");
        store.resetRetryState();
        return true;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") {
          store.setPipelineRunning(false);
          store.setPipelinePhase("cancelled");
          return false;
        }
        lastError = PipelineError.fromUnknown(e);
        store.setPipelineError({
          code: lastError.code,
          agent: lastError.agent,
          userMessage: lastError.userMessage,
          detail: lastError.detail,
          exampleFix: lastError.exampleFix,
          retryable: lastError.retryable,
          recoverable: lastError.recoverable,
        });
        store.setPipelinePhase("failed");
        store.setPipelineRunning(false);

        if (!autoRetry || !isAutoRetryable(lastError)) {
          toast.error(lastError.userMessage, {
            description: lastError.exampleFix,
          });
          return false;
        }
        const activePolicy: RetryPolicy =
          policy ?? getRetryPolicy(lastError.code) ?? DEFAULT_RETRY_POLICY;
        policy = activePolicy;
        if (attempt >= activePolicy.maxRetries) {
          toast.error("Retries exhausted", {
            description: lastError.userMessage,
          });
          return false;
        }
        const delay = computeBackoffMs(activePolicy, attempt);
        store.setRetryState({
          retryAttempt: attempt,
          retryMaxAttempts: activePolicy.maxRetries,
          retryCountdownMs: delay,
          isAutoRetrying: true,
        });
        try {
          await waitWithAbort(delay, signal, (left) => {
            store.setRetryState({ retryCountdownMs: left });
          });
        } catch {
          return false;
        }
        attempt += 1;
      }
    }
  } catch (e) {
    const err = PipelineError.fromUnknown(e);
    store.setPipelineError({
      code: err.code,
      agent: err.agent,
      userMessage: err.userMessage,
      detail: err.detail,
      exampleFix: err.exampleFix,
      retryable: err.retryable,
      recoverable: err.recoverable,
    });
    store.setPipelineRunning(false);
    store.setPipelinePhase("failed");
    return false;
  }
}
