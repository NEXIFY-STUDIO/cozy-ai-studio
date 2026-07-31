# GO-LIVE status — Option B (2026-07-31)

## Target

| URL | Role |
| --- | --- |
| https://cozy-ai-studio.vercel.app | Production project `cozy-ai-studio` |
| https://canvas.h4ck3d.me | Custom domain (must map to **same** Production deploy) |

## cozy-ai-studio.vercel.app — READY

| Gate | Value |
| --- | --- |
| mvpReady | **true** |
| optionBReady | **true** |
| sellReady | **false** (Stripe P4 hold) |
| mistralLive | true |
| demoPipeline | false |
| databaseUrl | true (postgres / Supabase pooler) |
| authProvider | none (open demo) |
| stripeCheckout | false |

Verified:

- `SMOKE_AGENT=0 PROD_URL=https://cozy-ai-studio.vercel.app npm run prod-smoke` → `ok: true`, `fails: []`
- `POST /api/agents/run` → SSE G0→G1 Mistral (not DEMO_PIPELINE)
- Studio UI: no `Dev: error demos`
- iPhone 17 Air: shell `padding-top` **68px**, Dynamic Island chrome

## canvas.h4ck3d.me — BLOCKED (DNS ownership)

**Problem:** domain still serves an **older Vercel project on another account** (better-auth + pglite + no Mistral).

Evidence:

- Different JS assets than vercel.app
- `mvpReady: false`, `authProvider: better-auth`, `dbBackend: pglite`
- UI still contains `Dev: error demos`

**What we did (API):**

1. Added `canvas.h4ck3d.me` to project `prj_97Ue4HbU0F65zhBOE6InUvwjYwlN` (cozy-ai-studio)
2. Set Production `SITE_URL=https://canvas.h4ck3d.me`, `AUTH_PROVIDER=none`, `DEMO_PIPELINE=false`
3. Triggered Production redeploys
4. Multi-team scan: domain is **not** on any other project visible to this `VERCEL_TOKEN`

**Blocker:** Vercel verification pending. DNS still has the **old** TXT for the previous project:

| Record | Current (wrong) | Required (new) |
| --- | --- | --- |
| TXT `_vercel.h4ck3d.me` | `vc-domain-verify=canvas.h4ck3d.me,31168f329f329ec8e290` | `vc-domain-verify=canvas.h4ck3d.me,c2c0a28e5f64c4e5f8a2` |

NS: `ns1/2/3.websupport.sk`  
CNAME `canvas` → `bfb079b452bf5d88.vercel-dns-013.com` (keep)

### One manual step (Websupport)

1. Login → DNS for `h4ck3d.me`
2. Edit TXT `_vercel` (or `_vercel.h4ck3d.me`) to:

```text
vc-domain-verify=canvas.h4ck3d.me,c2c0a28e5f64c4e5f8a2
```

3. Wait ~1–5 min, then re-run ops verify (agent) or:

```bash
curl -s https://canvas.h4ck3d.me/api/mvp-status
# expect mvpReady true, optionBReady true, sellReady false
```

## Stripe

**Not set.** `sellReady` stays false until explicit **P4**.

## Ops endpoint (temporary)

`POST /api/ops/go-live-canvas` on Production — domain verify + env + redeploy.  
**Delete after canvas is green.**

## Git author

Commits as `NEXIFY-STUDIO <u0352652320@gmail.com>` (no grok-export@).
