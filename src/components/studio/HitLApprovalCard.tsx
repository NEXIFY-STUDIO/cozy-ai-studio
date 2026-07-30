import { useCallback, useEffect } from "react";
import { Check, X, Code2, FileCode2 } from "lucide-react";
import { toast } from "sonner";
import { useStudioStore } from "@/stores/studio-store";
import { Button } from "@/components/ui/button";
import { pushAcceptedFilesToWebContainer } from "@/hooks/useWebContainerPreview";
import {
  getActiveProjectId,
  persistTelemetry,
  resolveServerApproval,
} from "@/hooks/useProjectSync";
import { saveMyProjectFiles } from "@/lib/db/functions";

export function HitLApprovalCard() {
  const pending = useStudioStore((s) => s.pendingApproval);
  const preflight = useStudioStore((s) => s.preflightReport);
  const approvePending = useStudioStore((s) => s.approvePending);
  const rejectPending = useStudioStore((s) => s.rejectPending);
  const isRunning = useStudioStore((s) => s.isPipelineRunning);
  const lastPrompt = useStudioStore((s) => s.lastPrompt);
  const pipelineLatencyMs = useStudioStore((s) => s.pipelineLatencyMs);

  const blocked = preflight ? !preflight.canAccept : false;

  const onApprove = useCallback(() => {
    if (blocked) {
      toast.error("Preflight blocked Accept", {
        description: "Patch contract failed — retry the pipeline.",
      });
      return;
    }
    approvePending();
    // P0: writeFile + reload Live Runtime Kernel
    void pushAcceptedFilesToWebContainer().then(() => {
      toast.success("Live Runtime updated", {
        description: "WebContainer writeFile + reload",
      });
    });
    void (async () => {
      await resolveServerApproval("approved");
      const projectId = getActiveProjectId();
      const state = useStudioStore.getState();
      if (projectId) {
        try {
          await saveMyProjectFiles({
            data: {
              projectId,
              files: Object.values(state.files).map((f) => ({
                path: f.path,
                language: f.language,
                content: f.content,
              })),
              activeFile: state.activeFile,
            },
          });
        } catch {
          /* ignore */
        }
      }
      await persistTelemetry({
        prompt: lastPrompt,
        status: "APPROVED",
        agentType: "G0-G1-G2",
        latencyMs: pipelineLatencyMs,
        projectId,
      });
    })();
  }, [approvePending, blocked, lastPrompt, pipelineLatencyMs]);

  const onReject = useCallback(() => {
    rejectPending();
    void resolveServerApproval("rejected");
  }, [rejectPending]);

  useEffect(() => {
    if (!pending || isRunning) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target as HTMLElement)?.isContentEditable
      )
        return;
      if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onApprove();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onReject();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pending, isRunning, onApprove, onReject]);

  if (!pending || isRunning) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-glass)] space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-choco/15 text-choco">
          <Code2 className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Human-in-the-Loop
          </p>
          <h3 className="font-serif text-base font-semibold truncate">
            {pending.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {pending.description}
          </p>
        </div>
      </div>

      {pending.affectedFiles?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {pending.affectedFiles.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              <FileCode2 className="h-3 w-3" />
              {f}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          className="flex-1 h-10 rounded-xl"
          disabled={blocked}
          onClick={onApprove}
        >
          <Check className="h-4 w-4" />
          Accept
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-10 rounded-xl"
          onClick={onReject}
        >
          <X className="h-4 w-4" />
          Reject
        </Button>
      </div>
      <p className="text-[10px] text-center text-muted-foreground">
        Enter = Accept · Esc = Reject · Accept → Live Runtime writeFile
      </p>
    </div>
  );
}
