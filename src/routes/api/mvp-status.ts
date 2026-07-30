import { createFileRoute } from "@tanstack/react-router";
import { getProductionEnvChecklist } from "@/lib/env/production";
import { secretFingerprint } from "@/lib/security/mask-secret";
import { resolveAuthProvider, supabaseConfiguredServer } from "@/lib/auth/mode";

/**
 * GET /api/mvp-status — sellable MVP vs full production.
 * Booleans + fingerprints only. No DB client import (PGLite unsafe on edge).
 */
export const Route = createFileRoute("/api/mvp-status")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const checklist = getProductionEnvChecklist();
          const mistral = Boolean(process.env.MISTRAL_API_KEY?.trim());
          const demo = checklist.demoPipeline;
          const auth = resolveAuthProvider("server");
          const supabaseOk =
            auth === "supabase" && supabaseConfiguredServer();
          const betterOk = auth === "better-auth";
          const authOk = supabaseOk || betterOk || auth === "none";
          const dbOk = Boolean(process.env.DATABASE_URL?.trim());
          const stripeOk =
            Boolean(process.env.STRIPE_SECRET_KEY?.trim()) &&
            Boolean(process.env.STRIPE_PRICE_PRO?.trim());

          const gates = {
            mistralLive: mistral && !demo,
            authConfigured: authOk && auth !== "none",
            authProvider: auth,
            databaseUrl: dbOk,
            dbBackend: dbOk ? "neon" : "pglite",
            supabaseServiceRole: Boolean(
              process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
            ),
            stripeCheckout: stripeOk,
            coopCoepHeaders: true,
            studioChrome: true,
            preflightHitL: true,
            liveRuntime: true,
          };

          const mvpReady =
            gates.mistralLive &&
            gates.authConfigured &&
            gates.studioChrome &&
            gates.preflightHitL &&
            gates.liveRuntime;

          const sellReady =
            mvpReady && gates.databaseUrl && gates.stripeCheckout;

          return Response.json({
            ok: mvpReady,
            mvpReady,
            sellReady,
            fullReady: checklist.ready,
            service: "cozy-ai-studio",
            productionUrl: "https://cozy-ai-studio.vercel.app",
            gates,
            prompts: {
              mvp: [
                "MVP-1 persist",
                "MVP-2 auth",
                "MVP-3 mistral",
                "MVP-4 WC",
                "MVP-5 stripe",
              ],
              postMvp: 7,
              docs: ["/docs/MVP_PROMPTS.md", "/docs/POST_MVP_PROMPTS.md"],
            },
            missingForMvp: [
              !gates.mistralLive && "MISTRAL_API_KEY + DEMO_PIPELINE=false",
              !gates.authConfigured &&
                "AUTH_PROVIDER + Supabase or Better Auth keys",
            ].filter(Boolean),
            missingForSell: [
              !gates.databaseUrl && "DATABASE_URL",
              !gates.supabaseServiceRole &&
                auth === "supabase" &&
                "SUPABASE_SERVICE_ROLE_KEY",
              !gates.stripeCheckout &&
                "STRIPE_SECRET_KEY + STRIPE_PRICE_PRO (+ webhook secret)",
            ].filter(Boolean),
            fingerprints: {
              mistral: mistral
                ? secretFingerprint(process.env.MISTRAL_API_KEY).fingerprint
                : null,
            },
            nextManual: [
              "Supabase → Database → URI → DATABASE_URL na Vercel",
              "Supabase → service_role → SUPABASE_SERVICE_ROLE_KEY",
              "Stripe → prices + webhook → /api/stripe/webhook",
              "Supabase Auth redirect: https://cozy-ai-studio.vercel.app/auth/callback",
            ],
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          return Response.json(
            { ok: false, error: "mvp-status-failed", detail: msg },
            { status: 500 },
          );
        }
      },
    },
  },
});
