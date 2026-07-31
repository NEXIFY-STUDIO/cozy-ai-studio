/**
 * Server-side Option B funnel events (brief → share → remix).
 */

import { getSql } from "@/lib/db";

export type ActivationEventName =
  | "brief_sent"
  | "pipeline_done"
  | "accept"
  | "share_created"
  | "remix_opened";

const ALLOWED = new Set<ActivationEventName>([
  "brief_sent",
  "pipeline_done",
  "accept",
  "share_created",
  "remix_opened",
]);

function newId() {
  return `act_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function recordActivationEvent(opts: {
  userId?: string | null;
  event: ActivationEventName | string;
  meta?: Record<string, unknown> | null;
}): Promise<void> {
  if (!ALLOWED.has(opts.event as ActivationEventName)) return;
  try {
    const sql = await getSql();
    const meta = opts.meta ? JSON.stringify(opts.meta) : null;
    await sql`
      insert into activation_events (id, user_id, event, meta)
      values (
        ${newId()},
        ${opts.userId ?? null},
        ${opts.event},
        ${meta}::jsonb
      )
    `;
  } catch (e) {
    console.warn("[activation] record failed", e);
  }
}

export type ActivationStats = {
  windowHours: number;
  counts: Record<ActivationEventName, number>;
  totals: number;
};

export async function getActivationStats(
  windowHours = 24,
): Promise<ActivationStats> {
  const hours = Math.min(168, Math.max(1, windowHours));
  const empty: ActivationStats = {
    windowHours: hours,
    counts: {
      brief_sent: 0,
      pipeline_done: 0,
      accept: 0,
      share_created: 0,
      remix_opened: 0,
    },
    totals: 0,
  };
  try {
    const sql = await getSql();
    const rows = await sql<{ event: string; n: number }>`
      select event, count(*)::int as n
      from activation_events
      where created_at >= CURRENT_TIMESTAMP - (${hours} * interval '1 hour')
      group by event
    `;
    for (const r of rows) {
      if (ALLOWED.has(r.event as ActivationEventName)) {
        empty.counts[r.event as ActivationEventName] = Number(r.n) || 0;
      }
    }
    empty.totals = Object.values(empty.counts).reduce((a, b) => a + b, 0);
    return empty;
  } catch (e) {
    console.warn("[activation] stats failed", e);
    return empty;
  }
}
