import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import {
  fetchActivationStats,
  type ActivationCounts,
} from "@/lib/activation/client";
import { cn } from "@/lib/utils";

const STEPS: { key: keyof ActivationCounts; label: string }[] = [
  { key: "brief_sent", label: "Brief" },
  { key: "pipeline_done", label: "Done" },
  { key: "accept", label: "Accept" },
  { key: "share_created", label: "Share" },
  { key: "share_viewed", label: "View" },
  { key: "remix_opened", label: "Remix" },
];

/**
 * Open-demo funnel snapshot (last 24h). Truthful counts only — no vanity.
 */
export function ActivationFunnelCard({ className }: { className?: string }) {
  const [counts, setCounts] = useState<ActivationCounts | null>(null);
  const [totals, setTotals] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void fetchActivationStats(24).then((s) => {
      if (cancelled || !s?.ok) return;
      setCounts(s.counts);
      setTotals(s.totals);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!counts) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground",
          className,
        )}
      >
        Loading funnel…
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card/80 px-3 py-2.5 space-y-2",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Activity className="h-3 w-3 text-choco" />
          Funnel 24h
        </p>
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {totals} events
        </span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
        {STEPS.map((s) => (
          <div
            key={s.key}
            className="rounded-lg border border-border bg-background/70 px-1.5 py-1.5 text-center"
          >
            <p className="text-sm font-semibold tabular-nums leading-none">
              {counts[s.key] ?? 0}
            </p>
            <p className="text-[9px] text-muted-foreground mt-1 truncate">
              {s.label}
            </p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground leading-snug">
        Free tier truth: Share = public <span className="font-mono">/a/…</span>{" "}
        link (not paid deploy).
      </p>
    </div>
  );
}
