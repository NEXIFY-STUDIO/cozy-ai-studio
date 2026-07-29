import { useEffect } from "react";
import { Check, X, Code2, FileCode2 } from "lucide-react";
import { useStudioStore } from "@/stores/studio-store";
import { Button } from "@/components/ui/button";

export function HitLApprovalCard() {
  const pending = useStudioStore((s) => s.pendingApproval);
  const approvePending = useStudioStore((s) => s.approvePending);
  const rejectPending = useStudioStore((s) => s.rejectPending);
  const isRunning = useStudioStore((s) => s.isPipelineRunning);

  useEffect(() => {
    if (!pending || isRunning) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable)
        return;
      if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        approvePending();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        rejectPending();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pending, isRunning, approvePending, rejectPending]);

  if (!pending || isRunning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hitl-title"
        className="w-full max-w-lg rounded-2xl border border-white/20 bg-cream/90 dark:bg-slate-card/90 p-6 shadow-2xl backdrop-blur-xl border-l-8 border-l-terracotta"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-terracotta/10 p-2.5 text-terracotta">
            <Code2 className="h-6 w-6" />
          </div>
          <div>
            <h3 id="hitl-title" className="font-serif text-xl font-bold text-charcoal dark:text-zinc-100">
              {pending.title}
            </h3>
            <p className="text-xs text-charcoal/60 dark:text-zinc-400">
              Human-in-the-Loop Review
            </p>
          </div>
        </div>

        <p className="text-sm text-charcoal/80 dark:text-zinc-300 mb-4 leading-relaxed">
          {pending.description}
        </p>

        <div className="mb-6 rounded-xl bg-charcoal/5 dark:bg-black/40 p-3 border border-charcoal/10 dark:border-white/5">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/70 dark:text-zinc-400 block mb-2">
            Modified files
          </span>
          <div className="space-y-1.5">
            {pending.affectedFiles.map((file) => (
              <div
                key={file}
                className="flex items-center gap-2 text-xs font-mono text-terracotta"
              >
                <FileCode2 className="h-3.5 w-3.5 shrink-0" />
                <span>{file}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="danger" onClick={rejectPending} className="min-h-11">
            <X className="h-4 w-4" />
            Reject (Esc)
          </Button>
          <Button onClick={approvePending} className="min-h-11">
            <Check className="h-4 w-4" />
            Approve (Enter)
          </Button>
        </div>
      </div>
    </div>
  );
}
