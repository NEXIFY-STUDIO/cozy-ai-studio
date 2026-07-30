/**
 * Production multi-agent pipeline (server-only).
 * G0 Planner → G1 Coder (stream) → G2 Auditor (+ heuristics + auto-heal)
 * Emits SSE payloads via async generator — no setTimeout fake streams.
 */

import {
  mistralChat,
  mistralChatStream,
  MistralHttpError,
  getMistralApiKey,
} from "./mistral.server";
import { auditCode, autoHealCode, type AuditReport } from "./auditor";
import { PipelineError } from "./errors";
import type { TaskNode, PipelinePhase } from "./types";
import type { AgentId } from "@/stores/studio-store";
import type { SseDonePayload, SseEventType, SsePayloadMap } from "./sse-protocol";

export type PipelineEvent =
  | { type: "phase"; data: SsePayloadMap["phase"] }
  | { type: "token"; data: SsePayloadMap["token"] }
  | { type: "file"; data: SsePayloadMap["file"] }
  | { type: "task"; data: SsePayloadMap["task"] }
  | { type: "chat"; data: SsePayloadMap["chat"] }
  | { type: "agent"; data: SsePayloadMap["agent"] }
  | { type: "progress"; data: SsePayloadMap["progress"] }
  | { type: "error"; data: SsePayloadMap["error"] }
  | { type: "done"; data: SseDonePayload };

export type ProductionRunInput = {
  prompt: string;
  originalCode: string;
  activeFile?: string;
  files?: Record<string, { path: string; language: string; content: string }>;
  signal?: AbortSignal;
};

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException("Pipeline aborted", "AbortError");
  }
}

function extractJsonObject(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object in model response");
  }
  return JSON.parse(raw.slice(start, end + 1));
}

function buildPreviewHtml(title: string, code: string): string {
  const safeTitle = title.replace(/[<>&]/g, "");
  const escaped = code
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${safeTitle}</title>
<style>
  :root { color-scheme: light dark; }
  body { margin:0; font-family: Inter, system-ui, sans-serif; background:#141414; color:#f2f3f5; }
  header { padding:14px 18px; border-bottom:1px solid rgba(255,255,255,.08); background:#1a1a1a; }
  header strong { color:#c48a5a; letter-spacing:.12em; font-size:12px; }
  h1 { margin:6px 0 0; font-size:18px; font-weight:600; }
  pre { margin:0; padding:18px; overflow:auto; font:12.5px/1.55 ui-monospace, SFMono-Regular, Menlo, monospace; white-space:pre-wrap; word-break:break-word; }
  .hint { padding:10px 18px; font-size:12px; color:#b8bcc4; border-bottom:1px solid rgba(255,255,255,.06); }
</style>
</head>
<body>
  <header>
    <strong>CAI PREVIEW</strong>
    <h1>${safeTitle}</h1>
  </header>
  <p class="hint">Generated component source (WebContainer runtime ships in a later sprint).</p>
  <pre>${escaped}</pre>
</body>
</html>`;
}

function mapMistralError(err: MistralHttpError): PipelineError {
  if (err.status === 429) {
    return new PipelineError({
      code: "RATE_LIMIT",
      agent: "ORCHESTRATOR",
      message: err.message,
      userMessage: "Mistral rate limit reached.",
      detail: err.body?.slice(0, 400),
      retryable: true,
      recoverable: true,
      exampleFix: "Wait a moment and retry, or check your Mistral plan quota.",
    });
  }
  if (err.status === 401 || err.status === 403) {
    return new PipelineError({
      code: "UNKNOWN",
      agent: "ORCHESTRATOR",
      message: err.message,
      userMessage: "Mistral API key rejected.",
      detail: err.message,
      retryable: false,
      recoverable: true,
      exampleFix: "Set a valid MISTRAL_API_KEY on the server.",
    });
  }
  if (err.status >= 500 || err.status === 503) {
    return new PipelineError({
      code: "NETWORK",
      agent: "ORCHESTRATOR",
      message: err.message,
      userMessage: "Mistral service error.",
      detail: err.message,
      retryable: true,
      recoverable: true,
    });
  }
  return new PipelineError({
    code: "UNKNOWN",
    agent: "ORCHESTRATOR",
    message: err.message,
    userMessage: "Mistral request failed.",
    detail: err.message,
    retryable: true,
    recoverable: true,
  });
}

type PlanJson = {
  title?: string;
  description?: string;
  plan?: string;
  tasks?: {
    id?: string;
    title?: string;
    agent?: string;
    dependsOn?: string[];
    detail?: string;
  }[];
};

type CodeJson = {
  title?: string;
  description?: string;
  files?: { path?: string; language?: string; content?: string }[];
  primaryPath?: string;
  language?: string;
  code?: string;
};

function normalizeAgent(a?: string): TaskNode["agent"] {
  const u = (a ?? "").toUpperCase();
  if (u.includes("G1") || u.includes("CODER")) return "G1_CODER";
  if (u.includes("G2") || u.includes("AUDIT")) return "G2_AUDITOR";
  return "G0_PLANNER";
}

/**
 * Async generator of pipeline events for SSE serialization.
 */
export async function* runProductionPipeline(
  input: ProductionRunInput,
): AsyncGenerator<PipelineEvent> {
  const signal = input.signal;
  const prompt = input.prompt.trim();
  if (!prompt) {
    yield {
      type: "error",
      data: {
        code: "EMPTY_PROMPT",
        agent: "ORCHESTRATOR",
        userMessage: "Prompt cannot be empty.",
        retryable: false,
        recoverable: true,
        exampleFix: "Describe a UI change, e.g. “Add a pricing section”.",
      },
    };
    return;
  }

  if (!getMistralApiKey()) {
    yield {
      type: "error",
      data: {
        code: "UNKNOWN",
        agent: "ORCHESTRATOR",
        userMessage: "MISTRAL_API_KEY is not configured on the server.",
        detail: "Set MISTRAL_API_KEY or enable DEMO_PIPELINE=true for offline mock.",
        retryable: false,
        recoverable: true,
        exampleFix: "Export MISTRAL_API_KEY before starting the server.",
      },
    };
    return;
  }

  const phases: SseDonePayload["phases"] = [];
  const activeFile = input.activeFile ?? "src/App.tsx";
  const original = input.originalCode || "// empty";

  try {
    // ─── G0 Planner ───────────────────────────────────────────────────
    const g0Start = Date.now();
    yield { type: "phase", data: { phase: "planning" } };
    yield {
      type: "progress",
      data: { pct: 5, label: "G0 Planner · contacting Mistral…" },
    };
    yield {
      type: "agent",
      data: {
        id: "g0",
        status: "in_progress",
        payload: "Decomposing prompt into task graph…",
        startedAt: g0Start,
      },
    };
    yield {
      type: "chat",
      data: {
        content: "G0 Planner: building architecture task graph via Mistral…",
        agent: "G0_PLANNER",
      },
    };

    throwIfAborted(signal);

    let planRaw: string;
    try {
      planRaw = await mistralChat({
        signal,
        json: true,
        model: process.env.MISTRAL_MODEL_PLAN ?? "mistral-small-latest",
        temperature: 0.2,
        maxTokens: 2048,
        messages: [
          {
            role: "system",
            content: `You are G0 Planner for Cozy AI Studio (CAI), a multi-agent visual IDE.
Return ONLY a JSON object:
{
  "title": string,
  "description": string,
  "plan": string (markdown bullet plan),
  "tasks": [
    { "id": string, "title": string, "agent": "G0_PLANNER"|"G1_CODER"|"G2_AUDITOR", "dependsOn": string[], "detail": string }
  ]
}
Create 3–7 concrete implementation tasks. Prefer React + TypeScript + Tailwind.`,
          },
          {
            role: "user",
            content: `User prompt:\n${prompt}\n\nActive file: ${activeFile}\n\nCurrent code (excerpt):\n${original.slice(0, 6000)}`,
          },
        ],
      });
    } catch (e) {
      if (e instanceof MistralHttpError) throw mapMistralError(e);
      throw e;
    }

    throwIfAborted(signal);

    let planJson: PlanJson;
    try {
      planJson = extractJsonObject(planRaw) as PlanJson;
    } catch {
      throw new PipelineError({
        code: "G0_PLAN_FAILED",
        agent: "G0_PLANNER",
        message: "Invalid planner JSON",
        userMessage: "G0 Planner returned invalid JSON.",
        detail: planRaw.slice(0, 500),
        retryable: true,
        recoverable: true,
        exampleFix: "Retry — the model should return a strict JSON plan.",
      });
    }

    const title = planJson.title?.trim() || "Generated UI update";
    const description =
      planJson.description?.trim() || planJson.plan?.slice(0, 200) || title;
    const planText = planJson.plan?.trim() || description;

    let graph: TaskNode[] = (planJson.tasks ?? []).map((t, i) => ({
      id: t.id || `t${i + 1}`,
      title: t.title || `Task ${i + 1}`,
      agent: normalizeAgent(t.agent),
      dependsOn: Array.isArray(t.dependsOn) ? t.dependsOn : [],
      status: "pending" as const,
      detail: t.detail,
    }));

    if (graph.length === 0) {
      graph = [
        {
          id: "plan",
          title: "Plan architecture",
          agent: "G0_PLANNER",
          dependsOn: [],
          status: "completed",
        },
        {
          id: "code",
          title: "Implement changes",
          agent: "G1_CODER",
          dependsOn: ["plan"],
          status: "pending",
        },
        {
          id: "audit",
          title: "Security & style audit",
          agent: "G2_AUDITOR",
          dependsOn: ["code"],
          status: "pending",
        },
      ];
    } else {
      graph = graph.map((n) =>
        n.agent === "G0_PLANNER" ? { ...n, status: "completed" as const } : n,
      );
    }

    yield { type: "task", data: { graph } };
    yield {
      type: "chat",
      data: { content: planText.slice(0, 2000), agent: "G0_PLANNER" },
    };
    yield {
      type: "agent",
      data: {
        id: "g0",
        status: "completed",
        payload: planText.slice(0, 800),
        finishedAt: Date.now(),
      },
    };
    phases.push({ agent: "G0_PLANNER", durationMs: Date.now() - g0Start });
    yield { type: "progress", data: { pct: 28, label: "G0 complete · G1 coding…" } };

    // ─── G1 Coder (stream) ────────────────────────────────────────────
    const g1Start = Date.now();
    yield { type: "phase", data: { phase: "coding" } };
    yield {
      type: "agent",
      data: {
        id: "g1",
        status: "in_progress",
        payload: "Streaming code from Codestral / Mistral…",
        startedAt: g1Start,
      },
    };
    yield {
      type: "chat",
      data: {
        content: "G1 Coder: generating file patches…",
        agent: "G1_CODER",
      },
    };
    graph = graph.map((n) =>
      n.agent === "G1_CODER" ? { ...n, status: "in_progress" as const } : n,
    );
    yield { type: "task", data: { graph } };

    throwIfAborted(signal);

    let codeAccum = "";
    try {
      for await (const delta of mistralChatStream({
        signal,
        temperature: 0.2,
        maxTokens: 8192,
        model: process.env.MISTRAL_MODEL_CODE ?? "codestral-latest",
        messages: [
          {
            role: "system",
            content: `You are G1 Coder for Cozy AI Studio.
Generate production-quality React + TypeScript (TSX) with Tailwind.
Output a single JSON object (you may stream it) with shape:
{
  "title": string,
  "description": string,
  "primaryPath": "src/App.tsx",
  "language": "tsx",
  "files": [
    { "path": "src/App.tsx", "language": "tsx", "content": "full file source" }
  ]
}
Rules:
- files[].content must be FULL file sources, not diffs
- Prefer one primary component file unless multi-file is clearly needed
- No markdown outside JSON; if you must wrap, use a single \`\`\`json fence
- Warm brutalism / chocolate accent is OK; avoid purple defaults
- Keep code self-contained and export default a React component`,
          },
          {
            role: "user",
            content: `Prompt: ${prompt}

Plan:
${planText}

Active file (${activeFile}):
\`\`\`
${original.slice(0, 8000)}
\`\`\``,
          },
        ],
      })) {
        codeAccum += delta;
        yield {
          type: "token",
          data: {
            agent: "G1_CODER",
            text: delta,
            accumulated: codeAccum,
          },
        };
      }
    } catch (e) {
      if (e instanceof MistralHttpError) throw mapMistralError(e);
      throw e;
    }

    throwIfAborted(signal);

    let codeJson: CodeJson;
    try {
      codeJson = extractJsonObject(codeAccum) as CodeJson;
    } catch {
      // Fallback: treat stream as raw TSX
      codeJson = {
        title,
        description,
        primaryPath: activeFile,
        language: "tsx",
        files: [{ path: activeFile, language: "tsx", content: codeAccum }],
        code: codeAccum,
      };
    }

    const files = (codeJson.files ?? [])
      .filter((f) => f?.path && typeof f.content === "string")
      .map((f) => ({
        path: f.path as string,
        language: f.language || "tsx",
        content: f.content as string,
      }));

    let primaryPath =
      codeJson.primaryPath ||
      files[0]?.path ||
      activeFile;
    let language = codeJson.language || files[0]?.language || "tsx";
    let code =
      files.find((f) => f.path === primaryPath)?.content ||
      codeJson.code ||
      files[0]?.content ||
      "";

    if (!code.trim()) {
      throw new PipelineError({
        code: "G1_CODE_FAILED",
        agent: "G1_CODER",
        message: "Empty code",
        userMessage: "G1 Coder returned empty code.",
        detail: codeAccum.slice(0, 400),
        retryable: true,
        recoverable: true,
      });
    }

    // Stream clean primary code into diff panel (final)
    yield {
      type: "token",
      data: { agent: "G1_CODER", text: "", accumulated: code },
    };

    for (const f of files) {
      yield {
        type: "file",
        data: { path: f.path, content: f.content, language: f.language },
      };
    }
    if (files.length === 0) {
      yield {
        type: "file",
        data: { path: primaryPath, content: code, language },
      };
    }

    const affectedFiles =
      files.length > 0 ? files.map((f) => f.path) : [primaryPath];

    yield {
      type: "agent",
      data: {
        id: "g1",
        status: "completed",
        payload: `Wrote ${affectedFiles.length} file(s): ${affectedFiles.join(", ")}`,
        finishedAt: Date.now(),
      },
    };
    graph = graph.map((n) =>
      n.agent === "G1_CODER" ? { ...n, status: "completed" as const } : n,
    );
    yield { type: "task", data: { graph } };
    phases.push({ agent: "G1_CODER", durationMs: Date.now() - g1Start });
    yield {
      type: "progress",
      data: { pct: 72, label: "G1 complete · G2 auditing…" },
    };

    // ─── G2 Auditor ───────────────────────────────────────────────────
    const g2Start = Date.now();
    yield { type: "phase", data: { phase: "auditing" } };
    yield {
      type: "agent",
      data: {
        id: "g2",
        status: "in_progress",
        payload: "Static heuristics + Mistral review…",
        startedAt: g2Start,
      },
    };
    yield {
      type: "chat",
      data: {
        content: "G2 Auditor: running security & style review…",
        agent: "G2_AUDITOR",
      },
    };
    graph = graph.map((n) =>
      n.agent === "G2_AUDITOR" ? { ...n, status: "in_progress" as const } : n,
    );
    yield { type: "task", data: { graph } };

    throwIfAborted(signal);

    // Heuristic pass first
    let audit: AuditReport = auditCode(code, language);
    let healed = false;

    if (!audit.passed) {
      const fixable = audit.issues.filter((i) => i.autoFixable);
      if (fixable.length) {
        yield { type: "phase", data: { phase: "healing" } };
        yield {
          type: "progress",
          data: { pct: 80, label: "G2 auto-heal…" },
        };
        const healedResult = autoHealCode(code, audit.issues);
        if (healedResult.fixed.length) {
          code = healedResult.code;
          healed = true;
          audit = auditCode(code, language);
          audit.healed = true;
          yield {
            type: "token",
            data: { agent: "G2_AUDITOR", text: "", accumulated: code },
          };
          yield {
            type: "file",
            data: { path: primaryPath, content: code, language },
          };
          yield {
            type: "chat",
            data: {
              content: `Auto-healed: ${healedResult.fixed.join("; ")}`,
              agent: "G2_AUDITOR",
            },
          };
        }
      }
    }

    // Optional LLM review notes (non-blocking if fails)
    let llmNotes: string[] = [];
    try {
      const reviewRaw = await mistralChat({
        signal,
        json: true,
        temperature: 0.1,
        maxTokens: 1024,
        model: process.env.MISTRAL_MODEL_PLAN ?? "mistral-small-latest",
        messages: [
          {
            role: "system",
            content: `You are G2 Auditor. Return JSON:
{ "passed": boolean, "notes": string[], "blockingIssues": string[] }
Focus on security (XSS, eval), a11y, and React correctness. Be concise.`,
          },
          {
            role: "user",
            content: `Language: ${language}\nPath: ${primaryPath}\n\n\`\`\`\n${code.slice(0, 10000)}\n\`\`\``,
          },
        ],
      });
      const review = extractJsonObject(reviewRaw) as {
        passed?: boolean;
        notes?: string[];
        blockingIssues?: string[];
      };
      llmNotes = [
        ...(review.notes ?? []),
        ...(review.blockingIssues ?? []).map((b) => `BLOCKING: ${b}`),
      ];
      if (review.blockingIssues?.length && audit.passed) {
        audit = {
          ...audit,
          passed: false,
          notes: [...audit.notes, ...llmNotes],
        };
      } else {
        audit = { ...audit, notes: [...audit.notes, ...llmNotes] };
      }
    } catch {
      // heuristics-only is fine
      llmNotes = ["LLM review skipped (non-fatal)."];
      audit = { ...audit, notes: [...audit.notes, ...llmNotes] };
    }

    if (!audit.passed && audit.issues.some((i) => i.severity === "error" && !i.autoFixable)) {
      // Still return result for HitL review, but mark notes
      yield {
        type: "chat",
        data: {
          content: `Audit found issues: ${audit.issues
            .filter((i) => i.severity === "error")
            .map((i) => i.message)
            .join("; ")}`,
          agent: "G2_AUDITOR",
        },
      };
    }

    audit.healed = healed || audit.healed;
    const auditNotes = [
      ...audit.notes,
      ...audit.issues.map((i) => `[${i.severity}] ${i.rule}: ${i.message}`),
    ];

    yield {
      type: "agent",
      data: {
        id: "g2",
        status: "completed",
        payload: audit.passed
          ? "Audit passed"
          : `Audit notes: ${audit.issues.length} issue(s)`,
        finishedAt: Date.now(),
      },
    };
    graph = graph.map((n) =>
      n.agent === "G2_AUDITOR" ? { ...n, status: "completed" as const } : n,
    );
    yield { type: "task", data: { graph } };
    phases.push({ agent: "G2_AUDITOR", durationMs: Date.now() - g2Start });

    const finalTitle = codeJson.title?.trim() || title;
    const finalDescription = codeJson.description?.trim() || description;
    const previewHtml = buildPreviewHtml(finalTitle, code);

    yield { type: "phase", data: { phase: "completed" } };
    yield { type: "progress", data: { pct: 100, label: "Pipeline complete" } };

    const done: SseDonePayload = {
      plan: planText,
      code,
      language,
      filePath: primaryPath,
      previewHtml,
      auditNotes,
      title: finalTitle,
      description: finalDescription,
      affectedFiles,
      taskGraph: graph,
      audit,
      phases,
      provider: "mistral",
      model:
        process.env.MISTRAL_MODEL_CODE ??
        process.env.MISTRAL_MODEL ??
        "codestral-latest",
    };
    yield { type: "done", data: done };
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      yield {
        type: "error",
        data: {
          code: "ABORTED",
          agent: "ORCHESTRATOR",
          userMessage: "Pipeline was cancelled.",
          retryable: true,
          recoverable: true,
        },
      };
      yield { type: "phase", data: { phase: "cancelled" as PipelinePhase } };
      return;
    }
    const err =
      e instanceof PipelineError
        ? e
        : e instanceof MistralHttpError
          ? mapMistralError(e)
          : PipelineError.fromUnknown(e);
    yield {
      type: "error",
      data: {
        code: err.code,
        agent: err.agent,
        userMessage: err.userMessage,
        detail: err.detail,
        exampleFix: err.exampleFix,
        retryable: err.retryable,
        recoverable: err.recoverable,
      },
    };
    yield { type: "phase", data: { phase: "failed" } };
  }
}

// re-export type for encode
export type { SseEventType };
