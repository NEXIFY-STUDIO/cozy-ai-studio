import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  FolderTree,
  FileCode2,
  ChevronDown,
  Coffee,
  LayoutDashboard,
  ShoppingBag,
  Square,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { useStudioStore } from "@/stores/studio-store";
import { runStudioPipeline } from "@/lib/ai/run-studio-pipeline";
import { AgentPipeline } from "./AgentPipeline";
import {
  PipelineErrorPanel,
  ErrorHandlingExamples,
  RetryProgressBanner,
} from "./PipelineErrorPanel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobilePairPanel } from "./MobilePairPanel";

const TEMPLATES: {
  icon: typeof Coffee;
  title: string;
  prompt: string;
  blurb: string;
}[] = [
  {
    icon: Coffee,
    title: "Kaviareň landing",
    prompt:
      "Landing page for a specialty coffee shop in Košice: hero, menu highlights, hours, contact form. Warm brutalism, chocolate accent, mobile-first.",
    blurb: "Hero + menu + CTA",
  },
  {
    icon: LayoutDashboard,
    title: "SaaS dashboard",
    prompt:
      "Build a clean SaaS metrics dashboard with KPI cards, a simple chart placeholder, recent activity list, and dark-friendly warm palette.",
    blurb: "KPIs + activity",
  },
  {
    icon: ShoppingBag,
    title: "Pricing page",
    prompt:
      "Create a pricing page with Free / Pro / Team cards, feature checklist, and a honest note that Free has a daily AI cap. No fake enterprise claims.",
    blurb: "3 tiers + CTA",
  },
];

export function AgentPanel() {
  const [input, setInput] = useState("");
  const [filesOpen, setFilesOpen] = useState(false);
  const [showErrorDemos, setShowErrorDemos] = useState(false);
  const chat = useStudioStore((s) => s.chat);
  const files = useStudioStore((s) => s.files);
  const activeFile = useStudioStore((s) => s.activeFile);
  const setActiveFile = useStudioStore((s) => s.setActiveFile);
  const isPipelineRunning = useStudioStore((s) => s.isPipelineRunning);
  const cancelPipeline = useStudioStore((s) => s.cancelPipeline);
  const pendingApproval = useStudioStore((s) => s.pendingApproval);
  const setMobilePanel = useStudioStore((s) => s.setMobilePanel);
  const planTier = useStudioStore((s) => s.planTier);
  const promptsUsed = useStudioStore((s) => s.promptsUsed);
  const promptLimit = useStudioStore((s) => s.promptLimit);
  const dailyUsed = useStudioStore((s) => s.dailyUsed);
  const dailyLimit = useStudioStore((s) => s.dailyLimit);
  const lastError = useStudioStore((s) => s.lastPipelineError);
  const scrollRef = useRef<HTMLDivElement>(null);
  const consumedLanding = useRef(false);

  const dailyLeft =
    dailyLimit != null ? Math.max(0, dailyLimit - dailyUsed) : null;
  const monthlyLeft = Math.max(0, promptLimit - promptsUsed);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chat, lastError, isPipelineRunning, pendingApproval]);

  useEffect(() => {
    if (consumedLanding.current) return;
    try {
      const q = sessionStorage.getItem("cozy-landing-prompt");
      if (q) {
        consumedLanding.current = true;
        sessionStorage.removeItem("cozy-landing-prompt");
        // Auto-run landing brief for ≤60s TTFP path
        void runStudioPipeline(q.trim(), { autoRetry: true });
      }
    } catch {
      /* ignore */
    }
  }, []);

  const run = async (prompt: string) => {
    if (isPipelineRunning) return;
    setInput("");
    await runStudioPipeline(prompt, { autoRetry: true });
  };

  const userMessages = chat.filter((m) => m.role === "user");
  const showEmpty = userMessages.length === 0 && !isPipelineRunning && !pendingApproval;

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-glass)]">
      <div
        ref={scrollRef}
        className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden cosy-scroll"
      >
        <div className="space-y-2.5 p-2.5 sm:p-3 min-w-0">
          <AgentPipeline compact={isPipelineRunning} />
          <RetryProgressBanner />
          <PipelineErrorPanel />

          <div className="flex items-center justify-between gap-2 min-w-0 pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="h-4 w-4 text-success shrink-0" />
              <span className="font-serif text-sm font-semibold truncate">Chat</span>
            </div>
            <span
              className="text-[11px] text-muted-foreground tabular-nums shrink-0 font-mono"
              title="Server-enforced free caps"
            >
              {planTier}
              {dailyLeft != null ? ` · ${dailyLeft}d` : ""} · {monthlyLeft} left
            </span>
          </div>

          {showEmpty && (
            <div className="space-y-3 min-w-0">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vyber šablónu (≤60 s k preview) alebo napíš vlastný brief. Po
                dokončení: diff → Accept → Share v Live Preview.
              </p>
              <div className="grid gap-1.5 min-w-0">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.title}
                    type="button"
                    disabled={isPipelineRunning}
                    onClick={() => void run(t.prompt)}
                    className="flex w-full min-w-0 items-start gap-2.5 rounded-xl border border-border bg-background px-3 py-2.5 text-left hover:border-choco/40 transition-colors disabled:opacity-50"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-choco/10 text-choco">
                      <t.icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold text-foreground">
                        {t.title}
                      </span>
                      <span className="block text-[11px] text-muted-foreground mt-0.5">
                        {t.blurb}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowErrorDemos((v) => !v)}
                  className="text-[11px] text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                >
                  {showErrorDemos ? "Skryť error demos" : "Dev: error demos"}
                </button>
                {showErrorDemos && (
                  <div className="mt-2">
                    <ErrorHandlingExamples
                      onRun={(p) => void run(p)}
                      disabled={isPipelineRunning}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {pendingApproval && (
            <div className="rounded-xl border border-success/30 bg-success/10 px-3 py-2.5 text-xs leading-relaxed space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                Hotovo — ďalší krok
              </p>
              <ol className="list-decimal list-inside text-muted-foreground space-y-0.5">
                <li>Skontroluj Diff a Accept (HitL)</li>
                <li>Otvor Náhľad a stlač Share</li>
              </ol>
              <div className="flex flex-wrap gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setMobilePanel("studio")}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[11px] font-medium hover:border-choco/40"
                >
                  Diff
                </button>
                <button
                  type="button"
                  onClick={() => setMobilePanel("preview")}
                  className="inline-flex items-center gap-1 rounded-lg border border-success/40 bg-success/15 px-2.5 py-1.5 text-[11px] font-medium"
                >
                  <Share2 className="h-3 w-3" />
                  Náhľad + Share
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2 min-w-0">
            {chat.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-sm leading-relaxed break-words min-w-0",
                  m.role === "user"
                    ? "bg-choco/10 border border-choco/20"
                    : m.role === "system"
                      ? "bg-muted/60 border border-border text-muted-foreground text-xs"
                      : "bg-background border border-border",
                )}
              >
                {m.content}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-border min-w-0">
        <button
          type="button"
          onClick={() => setFilesOpen((v) => !v)}
          className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground min-w-0"
        >
          <FolderTree className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Súbory</span>
          <span className="font-mono font-normal tabular-nums">
            {Object.keys(files).length}
          </span>
          <ChevronDown
            className={cn(
              "ml-auto h-3.5 w-3.5 shrink-0 transition-transform",
              filesOpen && "rotate-180",
            )}
          />
        </button>
        {filesOpen && (
          <ul className="max-h-28 overflow-auto cosy-scroll px-2 pb-2 space-y-0.5 min-w-0">
            {Object.values(files).map((f) => (
              <li key={f.path} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setActiveFile(f.path)}
                  className={cn(
                    "flex w-full min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                    activeFile === f.path
                      ? "bg-choco/10 text-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <FileCode2 className="h-3.5 w-3.5 shrink-0 text-success" />
                  <span className="truncate font-mono">{f.path}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="shrink-0 px-2.5 sm:px-3 pb-2">
        <MobilePairPanel />
      </div>

      <div className="shrink-0 border-t border-border bg-card p-2.5 sm:p-3 min-w-0">
        {dailyLeft != null && dailyLeft <= 3 && dailyLeft > 0 && (
          <p className="mb-2 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
            Zostáva {dailyLeft} free prompt{dailyLeft === 1 ? "" : "ov"} dnes
          </p>
        )}
        <div className="flex items-end gap-2 min-w-0">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && input.trim()) {
                e.preventDefault();
                void run(input.trim());
              }
            }}
            disabled={isPipelineRunning}
            rows={2}
            placeholder={
              isPipelineRunning
                ? "Agenti pracujú… Stop vpravo"
                : "Brief… napr. landing pre kaviareň"
            }
            className="min-h-[2.75rem] max-h-28 min-w-0 flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm leading-snug outline-none focus:border-choco focus:ring-1 focus:ring-choco/30 disabled:opacity-60 break-words"
            aria-label="Prompt"
          />
          {isPipelineRunning ? (
            <Button
              size="icon"
              variant="secondary"
              className="h-11 w-11 shrink-0"
              onClick={() => cancelPipeline()}
              aria-label="Zastaviť pipeline"
              title="Stop"
            >
              <Square className="h-4 w-4 fill-current" />
            </Button>
          ) : (
            <Button
              size="icon"
              className="h-11 w-11 shrink-0"
              disabled={!input.trim()}
              onClick={() => void run(input.trim())}
              aria-label="Odoslať prompt"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
