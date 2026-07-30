import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, FolderTree, FileCode2, ChevronDown } from "lucide-react";
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

const SUGGESTIONS = [
  "Pridaj pricing sekciu Free / Pro / Enterprise",
  "Postav dashboard s metrikami",
  "Vytvor todo board vo warm brutalism štýle",
];

export function AgentPanel() {
  const [input, setInput] = useState("");
  const [filesOpen, setFilesOpen] = useState(false);
  const chat = useStudioStore((s) => s.chat);
  const files = useStudioStore((s) => s.files);
  const activeFile = useStudioStore((s) => s.activeFile);
  const setActiveFile = useStudioStore((s) => s.setActiveFile);
  const isPipelineRunning = useStudioStore((s) => s.isPipelineRunning);
  const planTier = useStudioStore((s) => s.planTier);
  const promptsUsed = useStudioStore((s) => s.promptsUsed);
  const promptLimit = useStudioStore((s) => s.promptLimit);
  const lastError = useStudioStore((s) => s.lastPipelineError);
  const scrollRef = useRef<HTMLDivElement>(null);
  const consumedLanding = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chat, lastError, isPipelineRunning]);

  useEffect(() => {
    if (consumedLanding.current) return;
    try {
      const q = sessionStorage.getItem("cozy-landing-prompt");
      if (q) {
        consumedLanding.current = true;
        sessionStorage.removeItem("cozy-landing-prompt");
        setInput(q);
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

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-glass)]">
      {/* Scrollable middle: pipeline + errors + chat */}
      <div
        ref={scrollRef}
        className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden cosy-scroll"
      >
        <div className="space-y-2.5 p-2.5 sm:p-3 min-w-0">
          <AgentPipeline compact={isPipelineRunning} />
          <RetryProgressBanner />
          <PipelineErrorPanel />

          {/* Chat header */}
          <div className="flex items-center justify-between gap-2 min-w-0 pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="h-4 w-4 text-success shrink-0" />
              <span className="font-serif text-sm font-semibold truncate">Chat</span>
            </div>
            <span className="text-xs text-muted-foreground tabular-nums shrink-0">
              {planTier} · {promptsUsed}/
              {planTier === "FREE" ? promptLimit : "∞"}
            </span>
          </div>

          {chat.length === 0 && (
            <div className="space-y-3 min-w-0">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Napíš, čo chceš postaviť. Agenti G0 → G1 → G2 to prejdú s tebou v
                slučke.
              </p>
              <div className="flex flex-col gap-1.5 min-w-0">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={isPipelineRunning}
                    onClick={() => void run(s)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-left text-xs leading-snug hover:border-choco/40 hover:text-foreground transition-colors disabled:opacity-50 break-words"
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!isPipelineRunning && (
                <ErrorHandlingExamples
                  onRun={(p) => void run(p)}
                  disabled={isPipelineRunning}
                />
              )}
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

      {/* Files — collapsible, hidden bulk while agents run by default */}
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

      {/* Sticky prompt — always visible, never crushed */}
      <div className="shrink-0 border-t border-border bg-card p-2.5 sm:p-3 min-w-0">
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
                ? "Agenti pracujú… počkaj alebo Stop"
                : "Opíš zámer… napr. pricing sekcia"
            }
            className="min-h-[2.75rem] max-h-28 min-w-0 flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm leading-snug outline-none focus:border-choco focus:ring-1 focus:ring-choco/30 disabled:opacity-60 break-words"
            aria-label="Prompt"
          />
          <Button
            size="icon"
            className="h-11 w-11 shrink-0"
            disabled={isPipelineRunning || !input.trim()}
            onClick={() => void run(input.trim())}
            aria-label="Odoslať prompt"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
