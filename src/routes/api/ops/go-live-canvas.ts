import { createFileRoute } from "@tanstack/react-router";

/**
 * One-shot GO-LIVE ops: bind canvas.h4ck3d.me → Production project.
 * DELETE after successful go-live. Gated by X-Ops-Key.
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
    /* plain */
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
          purpose: "Bind canvas.h4ck3d.me to Production + force verify + redeploy",
          requires: "X-Ops-Key header",
          rev: 2,
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

        // 0) List team projects — find who owns canvas
        const projects = await vercel(`/v9/projects`, { token, teamId });
        const plist = (
          (projects.json as { projects?: { id: string; name: string }[] })
            .projects ?? []
        );
        steps.push({
          step: "list-projects",
          status: projects.status,
          detail: plist.map((p) => ({ id: p.id, name: p.name })),
        });

        for (const p of plist) {
          const d = await vercel(
            `/v9/projects/${encodeURIComponent(p.id)}/domains`,
            { token, teamId },
          );
          const names = (
            (d.json as { domains?: { name: string; verified?: boolean }[] })
              .domains ?? []
          ).map((x) => ({ name: x.name, verified: x.verified }));
          if (names.some((n) => n.name === DOMAIN || n.name.endsWith(DOMAIN))) {
            steps.push({
              step: `domain-on-${p.name}`,
              status: d.status,
              detail: { projectId: p.id, domains: names },
            });
            // If wrong project — detach
            if (p.id !== projectId) {
              const rem = await vercel(
                `/v9/projects/${encodeURIComponent(p.id)}/domains/${DOMAIN}`,
                { method: "DELETE", token, teamId },
              );
              steps.push({
                step: `detach-${p.name}`,
                status: rem.status,
                detail: rem.json.error || rem.json || rem.text.slice(0, 200),
              });
            }
          }
        }

        // 1) Domain config (account-level)
        const dinfo = await vercel(`/v5/domains/${DOMAIN}`, { token, teamId });
        steps.push({
          step: "domain-v5",
          status: dinfo.status,
          detail: {
            name: dinfo.json.name,
            projectId: dinfo.json.projectId,
            verified: dinfo.json.verified,
            serviceType: dinfo.json.serviceType,
            error: dinfo.json.error,
          },
        });

        // 2) Ensure on target project
        const domains = await vercel(
          `/v9/projects/${encodeURIComponent(projectId)}/domains`,
          { token, teamId },
        );
        const domainList = (
          (domains.json as { domains?: { name: string; verified: boolean }[] })
            .domains ?? []
        );
        steps.push({
          step: "list-domains-target",
          status: domains.status,
          detail: domainList,
        });

        let onTarget = domainList.some((d) => d.name === DOMAIN);
        if (!onTarget) {
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
          onTarget = add.status === 200 || add.status === 201;
        }

        // 3) Force verify
        const verify = await vercel(
          `/v9/projects/${encodeURIComponent(projectId)}/domains/${DOMAIN}/verify`,
          { method: "POST", token, teamId },
        );
        steps.push({
          step: "verify-domain",
          status: verify.status,
          detail: verify.json.error || {
            verified: verify.json.verified,
            name: verify.json.name,
            verification: verify.json.verification,
          },
        });

        // 4) Re-fetch domain state
        const after = await vercel(
          `/v9/projects/${encodeURIComponent(projectId)}/domains/${DOMAIN}`,
          { token, teamId },
        );
        steps.push({
          step: "domain-after",
          status: after.status,
          detail: {
            name: after.json.name,
            verified: after.json.verified,
            gitBranch: after.json.gitBranch,
            redirect: after.json.redirect,
            verification: after.json.verification,
          },
        });

        // 5) Update SITE_URL via delete+create (sensitive vars block PATCH type)
        const envList = await vercel(
          `/v9/projects/${encodeURIComponent(projectId)}/env`,
          { token, teamId },
        );
        const envs = (
          (envList.json as {
            envs?: {
              id: string;
              key: string;
              target?: string[];
              type?: string;
            }[];
          }).envs ?? []
        );

        const ensureEnv = async (key: string, value: string) => {
          const matches = envs.filter(
            (e) => e.key === key && (e.target ?? []).includes("production"),
          );
          for (const m of matches) {
            const del = await vercel(
              `/v9/projects/${encodeURIComponent(projectId)}/env/${m.id}`,
              { method: "DELETE", token, teamId },
            );
            steps.push({
              step: `env-del-${key}`,
              status: del.status,
              detail: del.status < 300 ? "deleted" : del.json.error || del.text.slice(0, 80),
            });
          }
          const create = await vercel(
            `/v10/projects/${encodeURIComponent(projectId)}/env`,
            {
              method: "POST",
              token,
              teamId,
              body: {
                key,
                value,
                type: "encrypted",
                target: ["production"],
              },
            },
          );
          steps.push({
            step: `env-set-${key}`,
            status: create.status,
            detail:
              create.status < 300
                ? "set"
                : create.json.error || create.text.slice(0, 120),
          });
        };

        // Only SITE_URL needs update for canvas primary; auth/demo already correct on this project
        await ensureEnv("SITE_URL", SITE);
        await ensureEnv("AUTH_PROVIDER", "none");
        await ensureEnv("VITE_AUTH_PROVIDER", "none");
        await ensureEnv("VITE_AUTH_ENABLED", "false");
        await ensureEnv("DEMO_PIPELINE", "false");

        // Remove VITE_DEMO_PIPELINE if present
        for (const bad of envs.filter((e) => e.key === "VITE_DEMO_PIPELINE")) {
          const del = await vercel(
            `/v9/projects/${encodeURIComponent(projectId)}/env/${bad.id}`,
            { method: "DELETE", token, teamId },
          );
          steps.push({
            step: "delete-VITE_DEMO_PIPELINE",
            status: del.status,
            detail: del.json.error || "deleted",
          });
        }

        // 6) Redeploy production
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
            meta: { goLiveCanvas: "2" },
          },
        });
        steps.push({
          step: "redeploy",
          status: deploy.status,
          detail: {
            id: deploy.json.id,
            url: deploy.json.url,
            error: deploy.json.error,
          },
        });

        const verified = Boolean(
          (after.json as { verified?: boolean }).verified ||
            (verify.json as { verified?: boolean }).verified,
        );

        return Response.json({
          ok: onTarget && deploy.status < 300,
          domain: DOMAIN,
          site: SITE,
          onTarget,
          verified,
          projectId,
          teamId: teamId ?? null,
          redeployId: (deploy.json as { id?: string }).id ?? null,
          verification: after.json.verification || verify.json.verification,
          steps,
          dnsHint:
            verified
              ? "Domain verified — wait for deploy propagation"
              : "If still unverified, add TXT _vercel.h4ck3d.me = value from verification[], then re-POST",
        });
      },
    },
  },
});
