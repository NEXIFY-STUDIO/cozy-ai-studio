/** Fire-and-forget activation events from the browser. */
export type ClientActivationEvent =
  | "brief_sent"
  | "pipeline_done"
  | "accept"
  | "share_created"
  | "remix_opened";

export async function trackActivation(
  event: ClientActivationEvent,
  meta?: Record<string, unknown>,
): Promise<void> {
  try {
    await fetch("/api/activation-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, meta }),
      keepalive: true,
    });
  } catch {
    /* ignore */
  }
}
