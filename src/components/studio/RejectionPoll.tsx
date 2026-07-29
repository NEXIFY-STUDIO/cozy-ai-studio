import { X, Paintbrush, Bug, MessageSquareOff } from "lucide-react";
import { useStudioStore, type RejectionReason } from "@/stores/studio-store";
import { Button } from "@/components/ui/button";

const options: {
  reason: NonNullable<RejectionReason>;
  label: string;
  icon: typeof Bug;
}[] = [
  { reason: "SYNTAX_ERROR", label: "Broken / non-functional code", icon: Bug },
  { reason: "BAD_STYLING", label: "Bad UI styling", icon: Paintbrush },
  { reason: "WRONG_LOGIC", label: "Didn't follow the prompt", icon: MessageSquareOff },
];

export function RejectionPoll() {
  const show = useStudioStore((s) => s.showRejectionPoll);
  const submitRejection = useStudioStore((s) => s.submitRejection);
  const dismissRejectionPoll = useStudioStore((s) => s.dismissRejectionPoll);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-charcoal/25 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-elevated)]">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-serif text-lg font-bold">Quick feedback</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Optional — helps fine-tune agent prompts
            </p>
          </div>
          <button
            type="button"
            onClick={dismissRejectionPoll}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          {options.map(({ reason, label, icon: Icon }) => (
            <button
              key={reason}
              type="button"
              onClick={() => submitRejection(reason)}
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-muted/40 px-3 py-3 text-left text-sm hover:border-terracotta/40 hover:bg-terracotta/5 transition-colors min-h-11"
            >
              <Icon className="h-4 w-4 text-terracotta shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="mt-3 w-full"
          onClick={() => submitRejection("OTHER")}
        >
          Skip / other
        </Button>
      </div>
    </div>
  );
}
