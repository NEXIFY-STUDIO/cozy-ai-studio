import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TaskNode, PipelinePhase } from "@/lib/ai/types";
import type { PipelineErrorCode, PipelineErrorAgent } from "@/lib/ai/errors";

export type AgentId = "G0_PLANNER" | "G1_CODER" | "G2_AUDITOR";
export type AgentStatus = "idle" | "pending" | "in_progress" | "completed" | "failed";
export type PlanTier = "FREE" | "PRO" | "ENTERPRISE";
export type DeviceType = "mobile" | "tablet" | "desktop";
export type ThemeMode = "light" | "dark";
export type RejectionReason =
  | "BAD_STYLING"
  | "SYNTAX_ERROR"
  | "WRONG_LOGIC"
  | "OTHER"
  | null;

export interface AgentTask {
  id: string;
  agent: AgentId;
  label: string;
  status: AgentStatus;
  payload: string;
  startedAt?: number;
  finishedAt?: number;
}

export interface DiffChunk {
  id: string;
  startLine: number;
  endLine: number;
  type: "add" | "remove" | "modify";
  accepted: boolean | null;
}

export interface ProjectFile {
  path: string;
  language: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  agent?: AgentId;
}

export interface PendingApproval {
  title: string;
  description: string;
  affectedFiles: string[];
  originalCode: string;
  modifiedCode: string;
  language: string;
  previewHtml: string;
}

export interface TelemetryLog {
  id: string;
  prompt: string;
  status: "APPROVED" | "REJECTED";
  rejectionReason?: RejectionReason;
  agentType: string;
  latencyMs: number;
  createdAt: number;
}

export interface PipelineErrorState {
  code: PipelineErrorCode;
  agent: PipelineErrorAgent;
  userMessage: string;
  detail?: string;
  exampleFix?: string;
  retryable: boolean;
  recoverable: boolean;
}

export interface ShowcaseProject {
  id: string;
  name: string;
  description: string;
  author: string;
  remixes: number;
  url: string;
  tags: string[];
}

interface StudioState {
  theme: ThemeMode;
  planTier: PlanTier;
  promptsUsed: number;
  promptLimit: number;
  device: DeviceType;
  activeFile: string;
  files: Record<string, ProjectFile>;
  originalCode: string;
  modifiedCode: string;
  language: string;
  diffChunks: DiffChunk[];
  agents: AgentTask[];
  isPipelineRunning: boolean;
  pipelinePhase: PipelinePhase;
  pipelineProgress: number;
  pipelineProgressLabel: string;
  taskGraph: TaskNode[];
  chat: ChatMessage[];
  pendingApproval: PendingApproval | null;
  showRejectionPoll: boolean;
  lastPrompt: string;
  previewHtml: string;
  previewKey: number;
  commandOpen: boolean;
  mobilePanel: "studio" | "chat" | "preview";
  publishUrl: string | null;
  showcase: ShowcaseProject[];
  telemetry: TelemetryLog[];
  pipelineLatencyMs: number;
  _abort: AbortController | null;
  lastPipelineError: PipelineErrorState | null;
  retryAttempt: number;
  retryMaxAttempts: number;
  retryCountdownMs: number;
  isAutoRetrying: boolean;
  productionLaunchOpen: boolean;
  productionLaunchRunning: boolean;
  productionLive: boolean;
  productionRegion: string | null;
  productionPrepaidCredits: number;
  productionInvoiceId: string | null;

  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setDevice: (device: DeviceType) => void;
  setActiveFile: (path: string) => void;
  setCommandOpen: (open: boolean) => void;
  setMobilePanel: (panel: "studio" | "chat" | "preview") => void;
  setPlanTier: (tier: PlanTier) => void;
  setAgents: (agents: AgentTask[]) => void;
  updateAgent: (id: string, patch: Partial<AgentTask>) => void;
  addChat: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  setDiff: (original: string, modified: string, language?: string) => void;
  streamModifiedCode: (code: string) => void;
  acceptChunk: (chunkId: string) => void;
  rejectChunk: (chunkId: string) => void;
  acceptAllDiffs: () => void;
  rejectAllDiffs: () => void;
  setPendingApproval: (approval: PendingApproval | null) => void;
  approvePending: () => void;
  rejectPending: () => void;
  submitRejection: (reason: RejectionReason) => void;
  dismissRejectionPoll: () => void;
  setPreviewHtml: (html: string) => void;
  refreshPreview: () => void;
  setPipelineRunning: (running: boolean) => void;
  setPipelinePhase: (phase: PipelinePhase) => void;
  setPipelineProgress: (pct: number, label?: string) => void;
  setTaskGraph: (nodes: TaskNode[]) => void;
  beginPipeline: () => AbortSignal;
  cancelPipeline: () => void;
  incrementPrompts: () => void;
  setPublishUrl: (url: string | null) => void;
  addTelemetry: (log: Omit<TelemetryLog, "id" | "createdAt">) => void;
  updateFileContent: (path: string, content: string) => void;
  setPipelineLatency: (ms: number) => void;
  resetAgents: () => void;
  setPipelineError: (err: PipelineErrorState | null) => void;
  clearPipelineError: () => void;
  setRetryState: (patch: {
    retryAttempt?: number;
    retryMaxAttempts?: number;
    retryCountdownMs?: number;
    isAutoRetrying?: boolean;
  }) => void;
  resetRetryState: () => void;
  setProductionLaunchOpen: (open: boolean) => void;
  setProductionState: (patch: {
    productionLaunchOpen?: boolean;
    productionLaunchRunning?: boolean;
    productionLive?: boolean;
    productionRegion?: string | null;
    productionPrepaidCredits?: number;
    productionInvoiceId?: string | null;
  }) => void;
}




const STARTER_APP = `import React from "react";

export default function App() {
  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1C1D21] font-sans">
      <header className="border-b border-black/10 px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold tracking-tight">Aurora</h1>
        <nav className="flex gap-6 text-sm text-black/60">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <button className="rounded-lg bg-[#D96B43] px-4 py-2 text-white font-medium">
            Get started
          </button>
        </nav>
      </header>
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="mb-4 text-sm font-medium tracking-widest text-[#D96B43] uppercase">
          Warm Brutalism
        </p>
        <h2 className="font-serif text-5xl font-bold leading-tight mb-6">
          Design that feels handmade
        </h2>
        <p className="text-lg text-black/60 mb-10 max-w-xl mx-auto">
          A starter landing page generated inside Cozy AI Studio. Edit with AI agents and watch the preview update live.
        </p>
        <div className="flex justify-center gap-3">
          <button className="rounded-xl bg-[#D96B43] px-6 py-3 text-white font-medium shadow-[4px_4px_0_#1C1D21]">
            Start building
          </button>
          <button className="rounded-xl border-2 border-[#1C1D21] px-6 py-3 font-medium">
            View demo
          </button>
        </div>
      </section>
    </main>
  );
}
`;

const STARTER_STYLES = `/* Warm Brutalism tokens */
:root {
  --cream: #F4F1EA;
  --charcoal: #1C1D21;
  --terracotta: #D96B43;
}

body {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  background: var(--cream);
  color: var(--charcoal);
}
`;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;");
}

function buildPreviewHtml(brand: string, headline: string, sub: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Inter, system-ui, sans-serif; background: #F4F1EA; color: #1C1D21; min-height: 100vh; }
    header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; border-bottom: 1px solid rgba(28,29,33,0.1); }
    .logo { font-family: "Playfair Display", Georgia, serif; font-size: 1.35rem; font-weight: 700; }
    nav { display: flex; gap: 1.25rem; align-items: center; font-size: 0.875rem; color: rgba(28,29,33,0.55); }
    .btn { background: #D96B43; color: white; border: none; border-radius: 0.65rem; padding: 0.55rem 1rem; font-weight: 500; font-size: 0.875rem; cursor: pointer; box-shadow: 3px 3px 0 #1C1D21; }
    .btn-outline { background: transparent; color: #1C1D21; border: 2px solid #1C1D21; border-radius: 0.75rem; padding: 0.7rem 1.25rem; font-weight: 500; cursor: pointer; }
    .btn-primary { background: #D96B43; color: white; border: none; border-radius: 0.75rem; padding: 0.75rem 1.5rem; font-weight: 500; cursor: pointer; box-shadow: 4px 4px 0 #1C1D21; }
    main { max-width: 42rem; margin: 0 auto; padding: 4rem 1.5rem; text-align: center; }
    .eyebrow { font-size: 0.75rem; letter-spacing: 0.14em; text-transform: uppercase; color: #D96B43; font-weight: 600; margin-bottom: 1rem; }
    h1 { font-family: "Playfair Display", Georgia, serif; font-size: clamp(2rem, 6vw, 3rem); line-height: 1.15; margin-bottom: 1.25rem; }
    p { color: rgba(28,29,33,0.6); font-size: 1.05rem; line-height: 1.6; margin-bottom: 2rem; }
    .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
    .card-grid { display: grid; gap: 1rem; margin-top: 3rem; text-align: left; }
    @media (min-width: 640px) { .card-grid { grid-template-columns: 1fr 1fr; } }
    .card { background: white; border: 1px solid rgba(28,29,33,0.1); border-radius: 1rem; padding: 1.25rem; box-shadow: 0 8px 24px rgba(0,0,0,0.04); }
    .card h3 { font-family: "Playfair Display", Georgia, serif; margin-bottom: 0.4rem; }
    .card p { font-size: 0.9rem; margin: 0; }
    .badge { display: inline-block; background: rgba(217,107,67,0.12); color: #C85A32; font-size: 0.7rem; font-weight: 600; padding: 0.25rem 0.55rem; border-radius: 999px; margin-bottom: 0.5rem; }
  </style>
</head>
<body>
  <header>
    <div class="logo">${escapeHtml(brand)}</div>
    <nav>
      <span>Features</span>
      <span>Pricing</span>
      <button class="btn">Get started</button>
    </nav>
  </header>
  <main>
    <p class="eyebrow">Warm Brutalism</p>
    <h1>${escapeHtml(headline)}</h1>
    <p>${escapeHtml(sub)}</p>
    <div class="actions">
      <button class="btn-primary">Start building</button>
      <button class="btn-outline">View demo</button>
    </div>
    <div class="card-grid">
      <div class="card">
        <div class="badge">G0 Planner</div>
        <h3>Architecture first</h3>
        <p>Tasks broken into component graphs before a single line is written.</p>
      </div>
      <div class="card">
        <div class="badge">Live Preview</div>
        <h3>Instant feedback</h3>
        <p>Hot-reload frames for phone, tablet, and desktop side by side with your diff.</p>
      </div>
    </div>
  </main>
</body>
</html>`;
}

export { buildPreviewHtml };

const STARTER_PREVIEW = buildPreviewHtml(
  "Aurora",
  "Design that feels handmade",
  "A starter landing page generated inside Cozy AI Studio.",
);

const initialFiles: Record<string, ProjectFile> = {
  "src/App.tsx": {
    path: "src/App.tsx",
    language: "typescript",
    content: STARTER_APP,
  },
  "src/styles.css": {
    path: "src/styles.css",
    language: "css",
    content: STARTER_STYLES,
  },
  "package.json": {
    path: "package.json",
    language: "json",
    content: `{
  "name": "aurora-landing",
  "private": true,
  "version": "0.1.0",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
`,
  },
};

const initialAgents: AgentTask[] = [
  { id: "g0", agent: "G0_PLANNER", label: "Planner", status: "idle", payload: "Waiting for prompt" },
  { id: "g1", agent: "G1_CODER", label: "Coder", status: "idle", payload: "Waiting for plan" },
  { id: "g2", agent: "G2_AUDITOR", label: "Auditor", status: "idle", payload: "Waiting for code" },
];

function computeChunks(original: string, modified: string): DiffChunk[] {
  if (original === modified) return [];
  const oLines = original.split("\n");
  const mLines = modified.split("\n");
  const chunks: DiffChunk[] = [];
  let i = 0;
  let chunkStart = -1;
  const max = Math.max(oLines.length, mLines.length);
  for (let line = 0; line < max; line++) {
    const a = oLines[line] ?? "";
    const b = mLines[line] ?? "";
    if (a !== b) {
      if (chunkStart === -1) chunkStart = line;
    } else if (chunkStart !== -1) {
      chunks.push({
        id: `chunk-${i++}`,
        startLine: chunkStart + 1,
        endLine: line,
        type: "modify",
        accepted: null,
      });
      chunkStart = -1;
    }
  }
  if (chunkStart !== -1) {
    chunks.push({
      id: `chunk-${i++}`,
      startLine: chunkStart + 1,
      endLine: max,
      type: "modify",
      accepted: null,
    });
  }
  return chunks.length
    ? chunks
    : [{ id: "chunk-0", startLine: 1, endLine: mLines.length, type: "modify", accepted: null }];
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set, get) => ({
      theme: "light",
      planTier: "PRO",
      promptsUsed: 12,
      promptLimit: 9999,
      device: "mobile",
      activeFile: "src/App.tsx",
      files: initialFiles,
      originalCode: STARTER_APP,
      modifiedCode: STARTER_APP,
      language: "typescript",
      diffChunks: [],
      agents: initialAgents,
      isPipelineRunning: false,
      pipelinePhase: "idle",
      pipelineProgress: 0,
      pipelineProgressLabel: "",
      taskGraph: [],
      chat: [
        {
          id: "welcome",
          role: "system",
          content:
            "Cozy multi-agent pipeline ready. Describe a UI change — G0 plans, G1 codes, G2 audits.",
          timestamp: Date.now(),
        },
      ],
      pendingApproval: null,
      showRejectionPoll: false,
      lastPrompt: "",
      previewHtml: STARTER_PREVIEW,
      previewKey: 0,
      commandOpen: false,
      mobilePanel: "chat",
      publishUrl: null,
      showcase: [
        {
          id: "1",
          name: "Aurora Landing",
          description: "Warm brutalist product landing with glass cards",
          author: "erik",
          remixes: 128,
          url: "aurora.cozy-ai.studio",
          tags: ["landing", "brutalism"],
        },
        {
          id: "2",
          name: "Ledger Dashboard",
          description: "Finance overview with terracotta metrics",
          author: "maya",
          remixes: 84,
          url: "ledger.cozy-ai.studio",
          tags: ["dashboard", "fintech"],
        },
        {
          id: "3",
          name: "Nomad Portfolio",
          description: "Editorial portfolio for product designers",
          author: "jules",
          remixes: 56,
          url: "nomad.cozy-ai.studio",
          tags: ["portfolio", "serif"],
        },
      ],
      telemetry: [],
      pipelineLatencyMs: 0,
      _abort: null,
      lastPipelineError: null,
      retryAttempt: 0,
      retryMaxAttempts: 0,
      retryCountdownMs: 0,
      isAutoRetrying: false,
      productionLaunchOpen: false,
      productionLaunchRunning: false,
      productionLive: false,
      productionRegion: null,
      productionPrepaidCredits: 0,
      productionInvoiceId: null,

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
      },
      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        get().setTheme(next);
      },
      setDevice: (device) => set({ device }),
      setActiveFile: (path) => {
        const file = get().files[path];
        if (!file) return;
        set({
          activeFile: path,
          originalCode: file.content,
          modifiedCode: file.content,
          language: file.language,
          diffChunks: [],
        });
      },
      setCommandOpen: (open) => set({ commandOpen: open }),
      setMobilePanel: (panel) => set({ mobilePanel: panel }),
      setPlanTier: (tier) =>
        set({ planTier: tier, promptLimit: tier === "FREE" ? 100 : 9999 }),
      setAgents: (agents) => set({ agents }),
      updateAgent: (id, patch) =>
        set({
          agents: get().agents.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        }),
      addChat: (msg) =>
        set({
          chat: [
            ...get().chat,
            {
              ...msg,
              id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              timestamp: Date.now(),
            },
          ],
        }),
      setDiff: (original, modified, language) =>
        set({
          originalCode: original,
          modifiedCode: modified,
          language: language ?? get().language,
          diffChunks: computeChunks(original, modified),
        }),
      streamModifiedCode: (code) =>
        set({
          modifiedCode: code,
          diffChunks: computeChunks(get().originalCode, code),
        }),
      acceptChunk: (chunkId) =>
        set({
          diffChunks: get().diffChunks.map((c) =>
            c.id === chunkId ? { ...c, accepted: true } : c,
          ),
        }),
      rejectChunk: (chunkId) =>
        set({
          diffChunks: get().diffChunks.map((c) =>
            c.id === chunkId ? { ...c, accepted: false } : c,
          ),
        }),
      acceptAllDiffs: () => {
        const { modifiedCode, activeFile, files, language } = get();
        set({
          originalCode: modifiedCode,
          files: {
            ...files,
            [activeFile]: { path: activeFile, language, content: modifiedCode },
          },
          diffChunks: get().diffChunks.map((c) => ({ ...c, accepted: true })),
        });
      },
      rejectAllDiffs: () => {
        set({ modifiedCode: get().originalCode, diffChunks: [] });
      },
      setPendingApproval: (approval) => set({ pendingApproval: approval }),
      approvePending: () => {
        const pending = get().pendingApproval;
        if (!pending) return;
        get().acceptAllDiffs();
        get().setPreviewHtml(pending.previewHtml);
        get().addChat({
          role: "assistant",
          content: `Approved: ${pending.title}. Changes written to project.`,
          agent: "G2_AUDITOR",
        });
        get().addTelemetry({
          prompt: get().lastPrompt,
          status: "APPROVED",
          agentType: "G0-G1-G2",
          latencyMs: get().pipelineLatencyMs,
        });
        set({ pendingApproval: null });
      },
      rejectPending: () => {
        get().rejectAllDiffs();
        set({ pendingApproval: null, showRejectionPoll: true });
      },
      submitRejection: (reason) => {
        get().addTelemetry({
          prompt: get().lastPrompt,
          status: "REJECTED",
          rejectionReason: reason,
          agentType: "G0-G1-G2",
          latencyMs: get().pipelineLatencyMs,
        });
        get().addChat({
          role: "system",
          content: `Rejection recorded (${reason ?? "no reason"}). Feedback loop updated.`,
        });
        set({ showRejectionPoll: false });
      },
      dismissRejectionPoll: () => {
        get().addTelemetry({
          prompt: get().lastPrompt,
          status: "REJECTED",
          rejectionReason: null,
          agentType: "G0-G1-G2",
          latencyMs: get().pipelineLatencyMs,
        });
        set({ showRejectionPoll: false });
      },
      setPreviewHtml: (html) =>
        set({ previewHtml: html, previewKey: get().previewKey + 1 }),
      refreshPreview: () => set({ previewKey: get().previewKey + 1 }),
      setPipelineRunning: (running) => set({ isPipelineRunning: running }),
      setPipelinePhase: (phase) => set({ pipelinePhase: phase }),
      setPipelineProgress: (pct, label) =>
        set({
          pipelineProgress: pct,
          pipelineProgressLabel: label ?? get().pipelineProgressLabel,
        }),
      setTaskGraph: (nodes) => set({ taskGraph: nodes }),
      beginPipeline: () => {
        get()._abort?.abort();
        const ac = new AbortController();
        set({
          _abort: ac,
          isPipelineRunning: true,
          pipelinePhase: "planning",
          pipelineProgress: 0,
          pipelineProgressLabel: "Starting…",
          taskGraph: [],
        });
        return ac.signal;
      },
      cancelPipeline: () => {
        get()._abort?.abort();
        set({
          _abort: null,
          isPipelineRunning: false,
          pipelinePhase: "cancelled",
          pipelineProgressLabel: "Cancelled",
        });
        get().addChat({ role: "system", content: "Pipeline cancelled by user." });
      },
      incrementPrompts: () => set({ promptsUsed: get().promptsUsed + 1 }),
      setPublishUrl: (url) => set({ publishUrl: url }),
      addTelemetry: (log) =>
        set({
          telemetry: [
            { ...log, id: `tel-${Date.now()}`, createdAt: Date.now() },
            ...get().telemetry,
          ].slice(0, 50),
        }),
      updateFileContent: (path, content) => {
        const files = { ...get().files };
        const existing = files[path];
        files[path] = {
          path,
          language: existing?.language ?? "typescript",
          content,
        };
        set({ files });
      },
      setPipelineLatency: (ms) => set({ pipelineLatencyMs: ms }),
      resetAgents: () =>
        set({
          agents: initialAgents.map((a) => ({ ...a })),
          taskGraph: [],
          pipelineProgress: 0,
          pipelineProgressLabel: "",
          pipelinePhase: "idle",
        }),
      setPipelineError: (err) => set({ lastPipelineError: err }),
      clearPipelineError: () => set({ lastPipelineError: null }),
      setRetryState: (patch) => set(patch),
      resetRetryState: () =>
        set({
          retryAttempt: 0,
          retryMaxAttempts: 0,
          retryCountdownMs: 0,
          isAutoRetrying: false,
        }),
      setProductionLaunchOpen: (open) => set({ productionLaunchOpen: open }),
      setProductionState: (patch) => set(patch),
    }),
    {
      name: "cozy-ai-studio-v1",
      partialize: (s) => ({
        theme: s.theme,
        planTier: s.planTier,
        productionLive: s.productionLive,
        productionRegion: s.productionRegion,
        productionPrepaidCredits: s.productionPrepaidCredits,
        productionInvoiceId: s.productionInvoiceId,
        publishUrl: s.publishUrl,
        promptsUsed: s.promptsUsed,
        device: s.device,
        files: s.files,
        previewHtml: s.previewHtml,
        telemetry: s.telemetry,
        showcase: s.showcase,
      }),
    },
  ),
);
