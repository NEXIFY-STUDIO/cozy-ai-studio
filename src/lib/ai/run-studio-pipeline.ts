import { toast } from "sonner";
import { useStudioStore } from "@/stores/studio-store";
import { runMultiAgentPipeline } from "./orchestrator";
import { PipelineError } from "./errors";
import {
  computeBackoffMs,
  getRetryPolicy,
  isAutoRetryable,
  waitWithAbort,
  type RetryPolicy,
} from "./retry-policy";

export type RunPipelineOptions = {
  /** Enable automatic retries for transient errors (default true) */
  autoRetry?: boolean;
};

/**
 * Run G0→G1→G2 with exponential-backoff auto-retry for transient failures.
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
    toast.error("Free tier: 100 prompts/month used. Upgrade to Pro.");
    store.setPipelineError({
      code: "RATE_LIMIT",
      agent: "ORCHESTRATOR",
      userMessage: "Monthly prompt quota reached on Free tier.",
      detail: `${store.promptsUsed}/${store.promptLimit} prompts used`,
      exampleFix: "Upgrade to Pro for unlimited fair-use prompts.",
      retryable: false,
      recoverable: true,
    });
    return false;
  }

  const started = Date.now();
  store.clearPipelineError();
  store.resetRetryState();
  store.resetAgents();
  const signal = store.beginPipeline();
  store.incrementPrompts();
  store.addChat({ role: "user", content: trimmed });
  useStudioStore.setState({ lastPrompt: trimmed });

  const original = store.files[store.activeFile]?.content ?? store.originalCode;
  let attempt = 0;
  let lastError: PipelineError | null = null;
  let policy: RetryPolicy | null = null;

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
            description: lastError ? `Recovering from ${lastError.code}` : undefined,
          });
        }

        store.setRetryState({
          retryAttempt: attempt,
          isAutoRetrying: attempt > 0,
        });

        const result = await runMultiAgentPipeline(trimmed, original, {
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

        if (store.files[result.filePath]) {
          store.setActiveFile(result.filePath);
        }
        const base =
          useStudioStore.getState().files[result.filePath]?.content ?? original;
        store.setDiff(base, result.code, result.language);
        store.setPipelineLatency(Date.now() - started);
        store.setPendingApproval({
          title: result.title,
          description: [
            result.audit.healed ? "Auto-healed by G2 loop." : null,
            attempt > 0 ? `Succeeded after ${attempt} retry(ies).` : null,
            result.description,
          ]
            .filter(Boolean)
            .join(" "),
          affectedFiles: result.affectedFiles,
          originalCode: base,
          modifiedCode: result.code,
          language: result.language,
          previewHtml: result.previewHtml,
        });

        const timing = result.phases
          .map((p) => `${p.agent.replace("_", " ")} ${p.durationMs}ms`)
          .join(" · ");
        toast.success(
          attempt > 0
            ? `Pipeline recovered after ${attempt} retry(ies)`
            : result.audit.healed
              ? "Pipeline complete after auto-heal"
              : "Pipeline complete — review the diff",
          { description: timing },
        );
        store.resetRetryState();
        store.clearPipelineError();
        return true;
      } catch (e) {
        const err = PipelineError.fromUnknown(e);
        lastError = err;

        if (err.code === "ABORTED") {
          store.setPipelinePhase("cancelled");
          store.resetRetryState();
          store.setPipelineError({
            code: err.code,
            agent: err.agent,
            userMessage: err.userMessage,
            detail: err.detail,
            exampleFix: err.exampleFix,
            retryable: true,
            recoverable: true,
          });
          toast.message("Pipeline cancelled");
          return false;
        }

        markFailedAgent(err);

        if (!policy) {
          policy = getRetryPolicy(err.code);
        }

        const canAuto =
          autoRetry &&
          isAutoRetryable(err) &&
          policy !== null &&
          attempt < policy.maxRetries;

        store.addChat({
          role: "system",
          content: [
            `Error [${err.code}] via ${err.agent} (attempt ${attempt + 1})`,
            err.userMessage,
            err.detail ? `Detail: ${err.detail}` : null,
            canAuto && policy
              ? `Auto-retry in backoff (${attempt + 1}/${policy.maxRetries} retries used after this wait).`
              : err.exampleFix
                ? `Recovery: ${err.exampleFix}`
                : null,
          ]
            .filter(Boolean)
            .join("\n"),
        });

        if (canAuto && policy) {
          const delay = computeBackoffMs(policy, attempt);
          const maxAttempts = 1 + policy.maxRetries;
          store.setRetryState({
            retryAttempt: attempt + 1,
            retryMaxAttempts: maxAttempts,
            retryCountdownMs: delay,
            isAutoRetrying: true,
          });
          store.setPipelinePhase("planning");
          store.setPipelineProgress(
            0,
            `Retry ${attempt + 2}/${maxAttempts} in ${(delay / 1000).toFixed(1)}s…`,
          );
          toast.message(`Retrying in ${(delay / 1000).toFixed(1)}s`, {
            description: `${err.code} · attempt ${attempt + 2}/${maxAttempts}`,
          });

          try {
            await waitWithAbort(delay, signal, (remaining) => {
              store.setRetryState({ retryCountdownMs: remaining });
              store.setPipelineProgress(
                0,
                `Retry ${attempt + 2}/${maxAttempts} in ${(remaining / 1000).toFixed(1)}s…`,
              );
            });
          } catch {
            store.setPipelinePhase("cancelled");
            store.resetRetryState();
            store.setPipelineError({
              code: "ABORTED",
              agent: "ORCHESTRATOR",
              userMessage: "Pipeline was cancelled during retry backoff.",
              retryable: true,
              recoverable: true,
            });
            toast.message("Pipeline cancelled");
            return false;
          }

          attempt += 1;
          continue;
        }

        // Give up — surface error for manual retry
        store.setPipelinePhase("failed");
        store.setPipelineLatency(Date.now() - started);
        store.setPipelineError({
          code: err.code,
          agent: err.agent,
          userMessage: err.userMessage,
          detail: [
            err.detail,
            attempt > 0 ? `Failed after ${attempt + 1} attempt(s).` : null,
          ]
            .filter(Boolean)
            .join("\n") || undefined,
          exampleFix: err.exampleFix,
          retryable: err.retryable,
          recoverable: err.recoverable,
        });
        store.setRetryState({
          retryAttempt: attempt,
          retryMaxAttempts: policy ? 1 + policy.maxRetries : attempt + 1,
          retryCountdownMs: 0,
          isAutoRetrying: false,
        });
        toast.error(err.userMessage, {
          description:
            err.code +
            (err.retryable ? " · manual retry available" : "") +
            (attempt > 0 ? ` · ${attempt + 1} attempts` : ""),
        });
        return false;
      }
    }
  } finally {
    store.setPipelineRunning(false);
    useStudioStore.setState({ _abort: null });
    store.setRetryState({ isAutoRetrying: false, retryCountdownMs: 0 });
  }
}

function markFailedAgent(err: PipelineError) {
  const store = useStudioStore.getState();
  const agentId =
    err.agent === "G0_PLANNER"
      ? "g0"
      : err.agent === "G1_CODER"
        ? "g1"
        : err.agent === "G2_AUDITOR"
          ? "g2"
          : null;
  if (!agentId) return;
  const current = store.agents.find((a) => a.id === agentId);
  if (current?.status !== "failed") {
    store.updateAgent(agentId, {
      status: "failed",
      payload: err.userMessage,
    });
  }
}
