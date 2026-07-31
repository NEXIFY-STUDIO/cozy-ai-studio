import { createFileRoute } from "@tanstack/react-router";

/**
 * One-shot GO-LIVE ops: bind canvas.h4ck3d.me → Production project.
 * DELETE after successful go-live. Gated by X-Ops-Key.
 * rev 3: multi-team domain hunt + detach + verify + redeploy
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
    teamId?: string | null;
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
          purpose:
            "Bind canvas.h4ck3d.me to Production across teams + force verify + redeploy",
          requires: "X-Ops-Key header",
          rev: 3,
        }),
      POST: async ({ request }) => {
        const key = request.headers.get("x-ops-key")?.trim() || "";
        if (key !== OPS_KEY) {
          return Response.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
        }

        let body: { action?: string } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          body = {};
        }
        const action = body.action || "go-live";

        const token = envVal("VERCEL_TOKEN");
        const projectId =
          envVal("VERCEL_PROJECT_ID") || envVal("VERCEL_PROJECT_NAME");
        const defaultTeamId = envVal("VERCEL_TEAM_ID") || null;

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

        // Teams accessible by this token
        const teamsRes = await vercel(`/v2/teams`, { token });
        const teams = (
          (teamsRes.json as { teams?: { id: string; name: string; slug: string }[] })
            .teams ?? []
        );
        steps.push({
          step: "list-teams",
          status: teamsRes.status,
          detail: teams.map((t) => ({ id: t.id, name: t.name, slug: t.slug })),
        });

        // Also include personal account (no teamId)
        const scopes: { label: string; teamId: string | null }[] = [
          { label: "personal", teamId: null },
          ...teams.map((t) => ({ label: t.slug, teamId: t.id })),
        ];

        type Hit = {
          scope: string;
          teamId: string | null;
          projectId: string;
          projectName: string;
          verified?: boolean;
        };
        const hits: Hit[] = [];

        for (const sc of scopes) {
          const projects = await vercel(`/v9/projects?limit=100`, {
            token,
            teamId: sc.teamId,
          });
          const plist = (
            (projects.json as { projects?: { id: string; name: string }[] })
              .projects ?? []
          );
          for (const p of plist) {
            const d = await vercel(
              `/v9/projects/${encodeURIComponent(p.id)}/domains`,
              { token, teamId: sc.teamId },
            );
            const domains = (
              (d.json as { domains?: { name: string; verified?: boolean }[] })
                .domains ?? []
            );
            const match = domains.find((x) => x.name === DOMAIN);
            if (match) {
              hits.push({
                scope: sc.label,
                teamId: sc.teamId,
                projectId: p.id,
                projectName: p.name,
                verified: match.verified,
              });
            }
          }
        }

        steps.push({ step: "domain-hits", status: 200, detail: hits });

        if (action === "scan") {
          return Response.json({
            ok: true,
            action: "scan",
            domain: DOMAIN,
            targetProjectId: projectId,
            defaultTeamId,
            hits,
            steps,
            rev: 3,
          });
        }

        // Detach from every project that is NOT the target
        for (const h of hits) {
          if (h.projectId === projectId) continue;
          const rem = await vercel(
            `/v9/projects/${encodeURIComponent(h.projectId)}/domains/${DOMAIN}`,
            { method: "DELETE", token, teamId: h.teamId },
          );
          steps.push({
            step: `detach-${h.projectName}`,
            status: rem.status,
            detail: rem.json.error || rem.json || rem.text.slice(0, 200),
          });
        }

        // Ensure on target project (default team)
        const domains = await vercel(
          `/v9/projects/${encodeURIComponent(projectId)}/domains`,
          { token, teamId: defaultTeamId },
        );
        const domainList = (
          (domains.json as { domains?: { name: string; verified: boolean }[] })
            .domains ?? []
        );
        let onTarget = domainList.some((d) => d.name === DOMAIN);
        if (!onTarget) {
          const add = await vercel(
            `/v10/projects/${encodeURIComponent(projectId)}/domains`,
            {
              method: "POST",
              token,
              teamId: defaultTeamId,
              body: { name: DOMAIN },
            },
          );
          steps.push({
            step: "add-domain",
            status: add.status,
            detail: add.json.error || add.json,
          });
          onTarget = add.status === 200 || add.status === 201;
        } else {
          steps.push({
            step: "add-domain",
            status: 200,
            detail: "already present",
          });
        }

        // Force verify
        const verify = await vercel(
          `/v9/projects/${encodeURIComponent(projectId)}/domains/${DOMAIN}/verify`,
          { method: "POST", token, teamId: defaultTeamId },
        );
        steps.push({
          step: "verify-domain",
          status: verify.status,
          detail: verify.json.error || {
            verified: verify.json.verified,
            verification: verify.json.verification,
          },
        });

        const after = await vercel(
          `/v9/projects/${encodeURIComponent(projectId)}/domains/${DOMAIN}`,
          { token, teamId: defaultTeamId },
        );
        steps.push({
          step: "domain-after",
          status: after.status,
          detail: {
            name: after.json.name,
            verified: after.json.verified,
            verification: after.json.verification,
            gitBranch: after.json.gitBranch,
          },
        });

        // SITE_URL + open-demo flags (delete+create for sensitive vars)
        const envList = await vercel(
          `/v9/projects/${encodeURIComponent(projectId)}/env`,
          { token, teamId: defaultTeamId },
        );
        const envs = (
          (envList.json as {
            envs?: { id: string; key: string; target?: string[] }[];
          }).envs ?? []
        );

        const ensureEnv = async (ek: string, value: string) => {
          for (const m of envs.filter(
            (e) => e.key === ek && (e.target ?? []).includes("production"),
          )) {
            const del = await vercel(
              `/v9/projects/${encodeURIComponent(projectId)}/env/${m.id}`,
              { method: "DELETE", token, teamId: defaultTeamId },
            );
            steps.push({
              step: `env-del-${ek}`,
              status: del.status,
              detail: del.status < 300 ? "deleted" : del.json.error,
            });
          }
          const create = await vercel(
            `/v10/projects/${encodeURIComponent(projectId)}/env`,
            {
              method: "POST",
              token,
              teamId: defaultTeamId,
              body: {
                key: ek,
                value,
                type: "encrypted",
                target: ["production"],
              },
            },
          );
          steps.push({
            step: `env-set-${ek}`,
            status: create.status,
            detail: create.status < 300 ? "set" : create.json.error,
          });
        };

        await ensureEnv("SITE_URL", SITE);
        await ensureEnv("AUTH_PROVIDER", "none");
        await ensureEnv("VITE_AUTH_PROVIDER", "none");
        await ensureEnv("VITE_AUTH_ENABLED", "false");
        await ensureEnv("DEMO_PIPELINE", "false");

        for (const bad of envs.filter((e) => e.key === "VITE_DEMO_PIPELINE")) {
          const del = await vercel(
            `/v9/projects/${encodeURIComponent(projectId)}/env/${bad.id}`,
            { method: "DELETE", token, teamId: defaultTeamId },
          );
          steps.push({
            step: "delete-VITE_DEMO_PIPELINE",
            status: del.status,
            detail: del.json.error || "deleted",
          });
        }

        // Redeploy
        const gitOrg = envVal("VERCEL_GIT_ORG") || "NEXIFY-STUDIO";
        const gitRepo = envVal("VERCEL_GIT_REPO") || "cozy-ai-studio";
        const gitRef = envVal("VERCEL_GIT_REF") || "main";
        const deploy = await vercel(`/v13/deployments`, {
          method: "POST",
          token,
          teamId: defaultTeamId,
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
            meta: { goLiveCanvas: "3" },
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

        const verification =
          after.json.verification || verify.json.verification || null;

        return Response.json({
          ok: onTarget && deploy.status < 300,
          rev: 3,
          domain: DOMAIN,
          site: SITE,
          onTarget,
          verified,
          hitsBefore: hits,
          projectId,
          teamId: defaultTeamId,
          redeployId: (deploy.json as { id?: string }).id ?? null,
          verification,
          steps,
          dnsRequired: !verified
            ? {
                type: "TXT",
                name: "_vercel.h4ck3d.me",
                value:
                  Array.isArray(verification) && verification[0]
                    ? (verification[0] as { value?: string }).value
                    : "vc-domain-verify=canvas.h4ck3d.me,…",
                note: "Websupport DNS: replace existing _vercel TXT with this value, wait 60s, re-POST",
              }
            : null,
        });
      },
    },
  },
});
