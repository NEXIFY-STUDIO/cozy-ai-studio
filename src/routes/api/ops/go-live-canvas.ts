import { createFileRoute } from "@tanstack/react-router";

/**
 * One-shot GO-LIVE ops: bind canvas.h4ck3d.me → Production project
 * that already has Mistral + Supabase env (cozy-ai-studio.vercel.app).
 *
 * DELETE after successful go-live. Gated by X-Ops-Key header.
 */

const DOMAIN = "canvas.h4ck3d.me";
const OPS_KEY = "fU9h2lvQkrXR5alQQR0QZFjTPJy-1lLdfa38Sbe_UH8";
const SITE = `https://${DOMAIN}`;

type VercelJson = Record<string, unknown>;

async function vercel(
  path: string,
  opts: {
    method?: string;
    token: string;
    teamId?: string;
    body?: unknown;
  },
): Promise<{ status: number; json: VercelJson; text: string }> {
  const url = new URL(`https://api.vercel.com${path}`);
  if (opts.teamId) url.searchParams.set("teamId", opts.teamId);
  const res = await fetch(url.toString(), {
    method: opts.method ?? "GET",
    headers: {
      Authorization: `Bearer ${opts.token}`,
      "Content-Type": "application/json",
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text();
  let json: VercelJson = {};
  try {
    json = JSON.parse(text) as VercelJson;
  } catch {
    /* plain text */
  }
  return { status: res.status, json, text };
}

function envVal(k: string) {
  return process.env[k]?.trim() || "";
}

export const Route = createFileRoute("/api/ops/go-live-canvas")({
  server: {
    handlers: {
      GET: async () =>
        Response.json({
          ok: true,
          endpoint: "POST /api/ops/go-live-canvas",
          purpose: "Bind canvas.h4ck3d.me to Production + sync SITE_URL",
          requires: "X-Ops-Key header",
        }),
      POST: async ({ request }) => {
        const key = request.headers.get("x-ops-key")?.trim() || "";
        if (key !== OPS_KEY) {
          return Response.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
        }

        const token = envVal("VERCEL_TOKEN");
        const projectId =
          envVal("VERCEL_PROJECT_ID") || envVal("VERCEL_PROJECT_NAME");
        const teamId = envVal("VERCEL_TEAM_ID") || undefined;

        if (!token || !projectId) {
          return Response.json(
            {
              ok: false,
              error: "MISSING_VERCEL_CREDS",
              hasToken: Boolean(token),
              hasProject: Boolean(projectId),
            },
            { status: 503 },
          );
        }

        const steps: { step: string; status: number; detail: unknown }[] = [];

        // 1) Project info
        const proj = await vercel(`/v9/projects/${encodeURIComponent(projectId)}`, {
          token,
          teamId,
        });
        steps.push({
          step: "project",
          status: proj.status,
          detail: {
            id: (proj.json as { id?: string }).id,
            name: (proj.json as { name?: string }).name,
            framework: (proj.json as { framework?: string }).framework,
          },
        });

        // 2) List current domains on this project
        const domains = await vercel(
          `/v9/projects/${encodeURIComponent(projectId)}/domains`,
          { token, teamId },
        );
        const domainList = (
          (domains.json as { domains?: { name: string; verified: boolean }[] })
            .domains ?? []
        ).map((d) => d.name);
        steps.push({
          step: "list-domains",
          status: domains.status,
          detail: domainList,
        });

        // 3) Ensure canvas domain is on this project
        let domainOk = domainList.includes(DOMAIN);
        if (!domainOk) {
          const add = await vercel(
            `/v10/projects/${encodeURIComponent(projectId)}/domains`,
            {
              method: "POST",
              token,
              teamId,
              body: { name: DOMAIN },
            },
          );
          steps.push({
            step: "add-domain",
            status: add.status,
            detail: add.json.error || add.json,
          });
          domainOk = add.status === 200 || add.status === 201;
          // 409 = already exists elsewhere or conflict — try force via project domains patch
          if (!domainOk && add.status === 409) {
            // Domain may belong to another project in same team — fetch domain info
            const info = await vercel(`/v5/domains/${DOMAIN}`, {
              token,
              teamId,
            });
            steps.push({
              step: "domain-info",
              status: info.status,
              detail: {
                name: (info.json as { name?: string }).name,
                projectId: (info.json as { projectId?: string }).projectId,
                serviceType: (info.json as { serviceType?: string }).serviceType,
              },
            });
            // Remove from other project if we can identify it
            const otherPid = (info.json as { projectId?: string }).projectId;
            if (otherPid && otherPid !== projectId) {
              const rem = await vercel(
                `/v9/projects/${encodeURIComponent(otherPid)}/domains/${DOMAIN}`,
                { method: "DELETE", token, teamId },
              );
              steps.push({
                step: "remove-from-other-project",
                status: rem.status,
                detail: rem.json.error || { removedFrom: otherPid },
              });
              const add2 = await vercel(
                `/v10/projects/${encodeURIComponent(projectId)}/domains`,
                {
                  method: "POST",
                  token,
                  teamId,
                  body: { name: DOMAIN },
                },
              );
              steps.push({
                step: "re-add-domain",
                status: add2.status,
                detail: add2.json.error || add2.json,
              });
              domainOk = add2.status === 200 || add2.status === 201;
            }
          }
        } else {
          steps.push({
            step: "add-domain",
            status: 200,
            detail: "already on project",
          });
        }

        // 4) Upsert critical Production env (SITE_URL + auth open-demo flags)
        // Do NOT touch Stripe. Do NOT enable DEMO_PIPELINE.
        const upserts: { key: string; value: string; target: string[] }[] = [
          { key: "SITE_URL", value: SITE, target: ["production"] },
          { key: "AUTH_PROVIDER", value: "none", target: ["production"] },
          { key: "VITE_AUTH_PROVIDER", value: "none", target: ["production"] },
          { key: "VITE_AUTH_ENABLED", value: "false", target: ["production"] },
          { key: "DEMO_PIPELINE", value: "false", target: ["production"] },
        ];

        // Copy live secrets already on this deployment into explicit production
        // (no-op if already set; ensures Production target after domain move)
        const copyKeys = [
          "MISTRAL_API_KEY",
          "DATABASE_URL",
          "DATABASE_URL_MIGRATE",
          "SUPABASE_URL",
          "SUPABASE_ANON_KEY",
          "SUPABASE_SERVICE_ROLE_KEY",
          "VITE_SUPABASE_URL",
          "VITE_SUPABASE_ANON_KEY",
        ] as const;
        for (const k of copyKeys) {
          const v = envVal(k);
          if (v) upserts.push({ key: k, value: v, target: ["production"] });
        }

        // Remove VITE_DEMO_PIPELINE if present (must be unset/false)
        const envList = await vercel(
          `/v9/projects/${encodeURIComponent(projectId)}/env`,
          { token, teamId },
        );
        const envs = (
          (envList.json as {
            envs?: { id: string; key: string; target?: string[] }[];
          }).envs ?? []
        );
        steps.push({
          step: "list-env",
          status: envList.status,
          detail: envs.map((e) => e.key),
        });

        for (const bad of envs.filter(
          (e) =>
            e.key === "VITE_DEMO_PIPELINE" ||
            (e.key === "DEMO_PIPELINE" && false),
        )) {
          // only remove VITE_DEMO_PIPELINE
          if (bad.key !== "VITE_DEMO_PIPELINE") continue;
          const del = await vercel(
            `/v9/projects/${encodeURIComponent(projectId)}/env/${bad.id}`,
            { method: "DELETE", token, teamId },
          );
          steps.push({
            step: `delete-env-${bad.key}`,
            status: del.status,
            detail: del.json.error || "deleted",
          });
        }

        for (const u of upserts) {
          const existing = envs.find(
            (e) => e.key === u.key && (e.target ?? []).includes("production"),
          );
          if (existing) {
            const patch = await vercel(
              `/v9/projects/${encodeURIComponent(projectId)}/env/${existing.id}`,
              {
                method: "PATCH",
                token,
                teamId,
                body: {
                  value: u.value,
                  target: ["production"],
                  type: "encrypted",
                },
              },
            );
            steps.push({
              step: `env-patch-${u.key}`,
              status: patch.status,
              detail: patch.status < 300 ? "updated" : patch.json.error || patch.text.slice(0, 120),
            });
          } else {
            const create = await vercel(
              `/v10/projects/${encodeURIComponent(projectId)}/env`,
              {
                method: "POST",
                token,
                teamId,
                body: {
                  key: u.key,
                  value: u.value,
                  type: "encrypted",
                  target: ["production"],
                },
              },
            );
            steps.push({
              step: `env-create-${u.key}`,
              status: create.status,
              detail:
                create.status < 300
                  ? "created"
                  : create.json.error || create.text.slice(0, 120),
            });
          }
        }

        // 5) Trigger production redeploy from GitHub main
        const gitOrg = envVal("VERCEL_GIT_ORG") || "NEXIFY-STUDIO";
        const gitRepo = envVal("VERCEL_GIT_REPO") || "cozy-ai-studio";
        const gitRef = envVal("VERCEL_GIT_REF") || "main";
        const deploy = await vercel(`/v13/deployments`, {
          method: "POST",
          token,
          teamId,
          body: {
            name: envVal("VERCEL_PROJECT_NAME") || "cozy-ai-studio",
            project: projectId,
            target: "production",
            gitSource: {
              type: "github",
              org: gitOrg,
              repo: gitRepo,
              ref: gitRef,
            },
            meta: { goLiveCanvas: "1" },
          },
        });
        steps.push({
          step: "redeploy",
          status: deploy.status,
          detail: {
            id: (deploy.json as { id?: string }).id,
            url: (deploy.json as { url?: string }).url,
            error: (deploy.json as { error?: unknown }).error,
          },
        });

        // 6) Self-check of THIS host (good project)
        const selfMvp = {
          mvpReady: envVal("MISTRAL_API_KEY") && envVal("DATABASE_URL") ? true : false,
          auth: envVal("AUTH_PROVIDER") || "unset",
          demo: envVal("DEMO_PIPELINE") || "false",
          site: envVal("SITE_URL") || "unset",
        };

        return Response.json({
          ok: domainOk && deploy.status < 300,
          domain: DOMAIN,
          site: SITE,
          domainOk,
          projectId,
          teamId: teamId ?? null,
          selfMvp,
          redeployId: (deploy.json as { id?: string }).id ?? null,
          steps,
          next: [
            "Wait ~60–120s for Production deploy",
            `curl -s https://${DOMAIN}/api/mvp-status`,
            "Expect mvpReady=true optionBReady=true sellReady=false",
            "Then delete /api/ops/go-live-canvas",
          ],
        });
      },
    },
  },
});
