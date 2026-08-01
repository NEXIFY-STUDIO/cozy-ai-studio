import { createFileRoute } from "@tanstack/react-router";
import {
  getMistralApiKey,
  isDemoPipelineEnv,
} from "@/lib/ai/mistral.server";
import { runProductionPipeline } from "@/lib/ai/production-run.server";
import { encodeSse } from "@/lib/ai/sse-protocol";
import {
  getUserIdFromRequest,
  requireUserIdFromRequest,
} from "@/lib/auth/request-user.server";
import { UnauthorizedError } from "@/lib/auth/verify.server";
import { authEnabledResolved } from "@/lib/auth/mode";
import {
  assertPromptQuota,
  ensureDefaultProject,
  recordUsageEvent,
} from "@/lib/projects/server";
import { recordActivationEvent } from "@/lib/activation/server";

export const Route = createFileRoute("/api/agents/run")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const key = Boolean(getMistralApiKey());
        const demo = isDemoPipelineEnv();
        const authOn = authEnabledResolved("server");
        let userId: string | null = null;
        try {
          userId = await getUserIdFromRequest(request);
        } catch {
          userId = null;
        }
        let quota: Awaited<ReturnType<typeof assertPromptQuota>> | null = null;
        if (userId) {
          try {
            quota = await assertPromptQuota(userId);
          } catch {
            quota = null;
          }
        }
        return Response.json({
          ok: true,
          provider: key && !demo ? "mistral" : "demo",
          mistralKeyPresent: key,
          demoPipeline: demo,
          buildMarker: "mistral-agent-g2-1",
          authRequired: authOn,
          authenticated: Boolean(userId),
          userId: userId ? `${userId.slice(0, 8)}…` : null,
          /** Product free caps (always 20/100) — even when super-admin is unlimited */
          freeProductCaps: { daily: 20, monthly: 100 },
          quota: quota
            ? {
                planTier: quota.planTier,
                promptsUsed: quota.promptsUsed,
                promptLimit: quota.promptLimit,
                dailyUsed: quota.dailyUsed,
                dailyLimit: quota.dailyLimit,
                withinQuota: quota.ok,
                superAdmin: Boolean(quota.superAdmin),
                // Display caps for FREE tier product (ship-gate / UI)
                freeDailyLimit: 20,
                freePromptLimit: 100,
              }
            : null,
        });
      },
      POST: async ({ request }) => {
        let userId: string;
        try {
          userId = await requireUserIdFromRequest(request);
        } catch (e) {
          if (
            e instanceof UnauthorizedError ||
            (e as Error)?.name === "UnauthorizedError"
          ) {
            return Response.json(
              {
                error: "UNAUTHORIZED",
                message: "Sign in required to run agents",
                login: "/login?redirect=/studio",
              },
              { status: 401 },
            );
          }
          throw e;
        }

        let body: {
          prompt?: string;
          originalCode?: string;
          activeFile?: string;
          projectId?: string;
          files?: Record<
            string,
            { path: string; language: string; content: string }
          >;
        };
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return Response.json(
            { error: "INVALID_JSON", message: "Request body must be JSON" },
            { status: 400 },
          );
        }

        const prompt = body.prompt?.trim() ?? "";
        if (!prompt) {
          return Response.json(
            { error: "EMPTY_PROMPT", message: "prompt is required" },
            { status: 400 },
          );
        }

        if (isDemoPipelineEnv()) {
          return Response.json(
            {
              error: "DEMO_PIPELINE",
              message:
                "Server is in DEMO_PIPELINE mode — use client mock orchestrator.",
            },
            { status: 409 },
          );
        }

        if (!getMistralApiKey()) {
          return Response.json(
            {
              error: "MISSING_API_KEY",
              message: "MISTRAL_API_KEY is not configured",
              hint: "Set MISTRAL_API_KEY or DEMO_PIPELINE=true for offline mock",
            },
            { status: 503 },
          );
        }

        // Hard quota BEFORE any model call (daily + monthly)
        let quota: Awaited<ReturnType<typeof assertPromptQuota>>;
        try {
          quota = await assertPromptQuota(userId);
        } catch (e) {
          console.error("[agents/run] quota check failed", e);
          // Fail closed on DB errors for free-tier cost control
          return Response.json(
            {
              error: "QUOTA_UNAVAILABLE",
              message: "Could not verify prompt quota. Try again shortly.",
            },
            { status: 503 },
          );
        }
        if (!quota.ok) {
          return Response.json(
            {
              error: quota.code,
              message: quota.message,
              planTier: quota.planTier,
              promptsUsed: quota.promptsUsed,
              promptLimit: quota.promptLimit,
              dailyUsed: quota.dailyUsed,
              dailyLimit: quota.dailyLimit,
            },
            { status: 429 },
          );
        }

        void recordActivationEvent({
          userId,
          event: "brief_sent",
          meta: { len: prompt.length },
        });

        let projectId = body.projectId ?? null;
        try {
          const project = await ensureDefaultProject(userId);
          projectId = projectId || project.id;
        } catch (e) {
          console.error("[agents/run] project ensure failed", e);
        }

        const abort = new AbortController();
        request.signal.addEventListener(
          "abort",
          () => {
            abort.abort();
          },
          { once: true },
        );

        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            const enc = new TextEncoder();
            const send = (chunk: string) => {
              controller.enqueue(enc.encode(chunk));
            };

            try {
              send(
                `: cai-agents-run user=${userId.slice(0, 8)} quota=${quota.promptsUsed}/${quota.promptLimit} daily=${quota.dailyUsed}/${quota.dailyLimit ?? "∞"}\n\n`,
              );

              let provider: string | undefined = "mistral";
              let model: string | undefined;
              let completed = false;

              for await (const ev of runProductionPipeline({
                prompt,
                originalCode: body.originalCode ?? "",
                activeFile: body.activeFile,
                files: body.files,
                signal: abort.signal,
              })) {
                if (abort.signal.aborted) break;
                if (ev.type === "done") {
                  completed = true;
                  provider = ev.data.provider;
                  model = ev.data.model;
                }
                send(encodeSse(ev.type, ev.data as never));
              }

              if (completed) {
                try {
                  await recordActivationEvent({
                    userId,
                    event: "pipeline_done",
                    meta: { provider: "mistral" },
                  });
                  await recordUsageEvent({
                    userId,
                    projectId,
                    kind: "prompt",
                    promptPreview: prompt,
                    provider,
                    model,
                    agent: "G0_G1_G2",
                    tokensIn: Math.ceil(prompt.length / 4),
                    tokensOut: 0,
                  });
                } catch (e) {
                  console.error("[agents/run] usage record failed", e);
                }
              }
            } catch (e) {
              const msg = e instanceof Error ? e.message : String(e);
              send(
                encodeSse("error", {
                  code: "UNKNOWN",
                  agent: "ORCHESTRATOR",
                  userMessage: "Pipeline stream failed.",
                  detail: msg,
                  retryable: true,
                  recoverable: true,
                }),
              );
            } finally {
              controller.close();
            }
          },
          cancel() {
            abort.abort();
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
            "X-CAI-Quota-Used": String(quota.promptsUsed),
            "X-CAI-Quota-Limit": String(quota.promptLimit),
          },
        });
      },
    },
  },
});
