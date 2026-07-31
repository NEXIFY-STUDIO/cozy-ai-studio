import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, RefreshCw, ShieldCheck, ShieldAlert } from "lucide-react";
import {
  fetchActivationStats,
  type ActivationCounts,
  type ActivationStatsResponse,
} from "@/lib/activation/client";
import { cn } from "@/lib/utils";

const STEPS: { key: keyof ActivationCounts; label: string; hint: string }[] = [
  { key: "brief_sent", label: "Brief", hint: "Prompt odoslaný" },
  { key: "pipeline_done", label: "Done", hint: "Pipeline OK" },
  { key: "accept", label: "Accept", hint: "HitL accept" },
  { key: "share_created", label: "Share", hint: "Public /a/…" },
  { key: "share_viewed", label: "View", hint: "Niekto otvoril link" },
  { key: "remix_opened", label: "Remix", hint: "Remix do Studio" },
];

function pct(from: number, to: number): string | null {
  if (from <= 0) return null;
  return `${Math.min(100, Math.round((to / from) * 100))}%`;
}

/**
 * Open-demo funnel: total + real vs smoke + Stripe gate (truthful).
 */
export function ActivationFunnelCard({ className }: { className?: string }) {
  const [data, setData] = useState<ActivationStatsResponse | null>(null);
  const [hours, setHours] = useState(24);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hitl, setHitl] = useState<{
    approved: number;
    rejected: number;
    rejectRate: number | null;
  } | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    void Promise.all([
      fetchActivationStats(hours),
      fetch(`/api/telemetry-stats?hours=${hours}`)
        .then((r) => r.json())
        .catch(() => null),
    ]).then(([s, tel]) => {
      if (!s?.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      setData(s);
      if (tel && tel.ok) {
        setHitl({
          approved: Number(tel.approved) || 0,
          rejected: Number(tel.rejected) || 0,
          rejectRate: tel.rejectRate == null ? null : Number(tel.rejectRate),
        });
      }
      setLoading(false);
    });
  }, [hours]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = data?.real?.counts ?? data?.counts ?? null;
  const totals = data?.real?.totals ?? data?.totals ?? 0;
  const smokeTotals = data?.smoke?.totals ?? 0;

  const bottleneck = useMemo(() => {
    if (!counts) return null;
    const vals = STEPS.map((s) => counts[s.key] ?? 0);
    for (let i = 0; i < vals.length - 1; i++) {
      if (vals[i] >= 2 && vals[i + 1] / vals[i] < 0.5) {
        return {
          from: STEPS[i].label,
          to: STEPS[i + 1].label,
          rate: pct(vals[i], vals[i + 1]),
        };
      }
    }
    return null;
  }, [counts]);

  if (loading && !counts) {
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

  if (error && !counts) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground flex items-center justify-between gap-2",
          className,
        )}
      >
        <span>Funnel unavailable</span>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 hover:bg-background"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      </div>
    );
  }

  if (!counts) return null;

  const empty = totals === 0 && smokeTotals === 0;
  const gate = data?.stripeGate;

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
          Funnel (real)
        </p>
        <div className="flex items-center gap-1.5">
          {[24, 168].map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHours(h)}
              className={cn(
                "rounded-md px-1.5 py-0.5 text-[10px] font-medium border",
                hours === h
                  ? "border-choco/40 bg-choco/10 text-foreground"
                  : "border-transparent text-muted-foreground hover:bg-muted",
              )}
            >
              {h === 24 ? "24h" : "7d"}
            </button>
          ))}
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {totals} real
            {smokeTotals > 0 ? ` · ${smokeTotals} smoke` : ""}
          </span>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            title="Refresh"
            className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {gate && (
        <div
          className={cn(
            "flex items-start gap-2 rounded-lg border px-2.5 py-2 text-[11px] leading-snug",
            gate.ready
              ? "border-success/35 bg-success/10 text-foreground"
              : "border-border bg-muted/50 text-muted-foreground",
          )}
        >
          {gate.ready ? (
            <ShieldCheck className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="h-3.5 w-3.5 text-choco shrink-0 mt-0.5" />
          )}
          <div className="min-w-0">
            <p className="font-medium text-foreground">
              Stripe gate: {gate.ready ? "ready" : "hold"}
            </p>
            <p className="mt-0.5">{gate.reason}</p>
          </div>
        </div>
      )}

      {empty ? (
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Zatiaľ prázdne. Spusti brief → Accept + Share → otvor{" "}
          <span className="font-mono">/a/…</span> — tu uvidíš reálnu konverziu
          (smoke sa odpočítava).
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {STEPS.map((s, i) => {
              const n = counts[s.key] ?? 0;
              const prev = i > 0 ? (counts[STEPS[i - 1].key] ?? 0) : null;
              const conv = prev != null ? pct(prev, n) : null;
              const weak = prev != null && prev >= 2 && n / prev < 0.5;
              return (
                <div
                  key={s.key}
                  title={s.hint + (conv ? ` · ${conv} z predch.` : "")}
                  className={cn(
                    "rounded-lg border bg-background/70 px-1.5 py-1.5 text-center",
                    weak
                      ? "border-terracotta/40"
                      : n > 0
                        ? "border-success/25"
                        : "border-border",
                  )}
                >
                  <p className="text-sm font-semibold tabular-nums leading-none">
                    {n}
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-1 truncate">
                    {s.label}
                  </p>
                  {conv && (
                    <p
                      className={cn(
                        "text-[8px] tabular-nums mt-0.5",
                        weak ? "text-terracotta" : "text-muted-foreground/80",
                      )}
                    >
                      {conv}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          {bottleneck && (
            <p className="text-[10px] text-terracotta leading-snug">
              Drop: {bottleneck.from} → {bottleneck.to}
              {bottleneck.rate ? ` (${bottleneck.rate})` : ""}.
            </p>
          )}
          {(hitl && hitl.approved + hitl.rejected > 0) ||
          (data?.counts?.reject ?? 0) > 0 ? (
            <p className="text-[10px] text-muted-foreground leading-snug">
              {hitl && hitl.approved + hitl.rejected > 0
                ? `HitL DB: ${hitl.approved} approved · ${hitl.rejected} rejected${
                    hitl.rejectRate != null
                      ? ` · ${hitl.rejectRate}% reject`
                      : ""
                  }`
                : null}
            </p>
          ) : null}
        </>
      )}

      <p className="text-[10px] text-muted-foreground leading-snug">
        Free publish = public <span className="font-mono">/a/…</span>. Stripe
        až keď gate = ready (reálni useri, nie smoke).
      </p>
    </div>
  );
}
