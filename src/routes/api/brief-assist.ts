import { createFileRoute } from "@tanstack/react-router";
import {
  runBriefAssist,
  type BriefAssistMode,
} from "@/lib/ai/brief-assist.server";
import { MistralHttpError } from "@/lib/ai/mistral.server";

/**
 * POST /api/brief-assist
 * body: { mode: "inspire" | "improve", text?: string }
 * → { ok, mode, text, provider }
 */
export const Route = createFileRoute("/api/brief-assist")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { mode?: string; text?: string } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return Response.json(
            { error: "BAD_JSON", message: "Expected JSON body" },
            { status: 400 },
          );
        }

        const mode = (body.mode || "").trim() as BriefAssistMode;
        if (mode !== "inspire" && mode !== "improve") {
          return Response.json(
            {
              error: "BAD_MODE",
              message: 'mode must be "inspire" or "improve"',
            },
            { status: 400 },
          );
        }

        try {
          const result = await runBriefAssist({
            mode,
            text: body.text,
            signal: request.signal,
          });
          return Response.json(result);
        } catch (e) {
          if (e instanceof Error && e.message === "EMPTY_TEXT") {
            return Response.json(
              {
                error: "EMPTY_TEXT",
                message: "Napíš krátky brief — Improve ho potom vylepší.",
              },
              { status: 400 },
            );
          }
          if (e instanceof MistralHttpError && e.status === 429) {
            return Response.json(
              {
                error: "RATE_LIMIT",
                message: "Mistral rate limit — skús o chvíľu.",
              },
              { status: 429 },
            );
          }
          console.error("[brief-assist]", e);
          return Response.json(
            { error: "ASSIST_FAILED", message: "Brief assist failed" },
            { status: 500 },
          );
        }
      },
    },
  },
});
