#!/usr/bin/env node
/**
 * Production smoke — Option B spine (no browser).
 * Usage: node scripts/prod-smoke.mjs [baseUrl]
 */
const BASE = (process.argv[2] || process.env.PROD_URL || "https://cozy-ai-studio.vercel.app").replace(/\/$/, "");
const fails = [];
const notes = [];
function must(cond, msg) {
  if (cond) notes.push(`ok: ${msg}`);
  else fails.push(msg);
}

async function main() {
  const mvp = await fetch(`${BASE}/api/mvp-status`).then((r) => r.json());
  must(mvp.optionBReady === true || mvp.mvpReady === true, "optionBReady");
  must(mvp.gates?.mistralLive === true, "mistralLive");
  must(mvp.gates?.databaseUrl === true, "databaseUrl");
  must(mvp.gates?.stripeCheckout !== true, "stripe not falsely live");

  const agents = await fetch(`${BASE}/api/agents/run`).then((r) => r.json());
  must(agents.ok === true, "agents/run GET ok");
  must(agents.quota?.dailyLimit === 20, "dailyLimit 20");
  must(agents.quota?.promptLimit === 100, "promptLimit 100");

  const empty = await fetch(`${BASE}/api/agents/run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  const emptyBody = await empty.json().catch(() => ({}));
  must(empty.status === 400 && emptyBody.error === "EMPTY_PROMPT", "empty prompt 400");

  const share = await fetch(`${BASE}/api/share`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      html: "<!doctype html><html><body><h1>prod-smoke</h1></body></html>",
      title: "prod-smoke",
    }),
  }).then((r) => r.json());
  must(share.ok && share.id, "share create");
  if (share.id) {
    const page = await fetch(`${BASE}/a/${share.id}`);
    must(page.status === 200, `share page ${page.status}`);
    const html = await page.text();
    must(/<title>[^<]+Cozy share/i.test(html) || /og:title/i.test(html), "share page has title/og");
    must(/prod-smoke|Cozy/i.test(html), "share page content");
  }

  const act = await fetch(`${BASE}/api/activation-stats?hours=24`).then((r) => r.json());
  must(act.ok === true && act.counts, "activation-stats ok");
  must("share_viewed" in (act.counts || {}), "share_viewed metric present");

  // pair open (does not require two peers)
  const pairOpen = await fetch(`${BASE}/api/ws/http`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ op: "open" }),
  }).then((r) => r.json());
  must(Boolean(pairOpen.clientId), "pair http open");
  if (pairOpen.clientId) {
    const pair = await fetch(`${BASE}/api/ws/http`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        op: "send",
        clientId: pairOpen.clientId,
        message: {
          type: "create_pair",
          projectId: "smoke-proj",
          clientId: pairOpen.clientId,
        },
      }),
    }).then((r) => r.json());
    const code = pair.messages?.find((m) => m.type === "pair_code")?.code;
    must(Boolean(code), `pair code ${code || "missing"}`);
  }

  const landing = await fetch(`${BASE}/`);
  const html = await landing.text();
  must(landing.status === 200, "landing 200");
  must(!/Figma\s*→\s*production/i.test(html), "no Figma claim");

  console.log(JSON.stringify({ base: BASE, ok: fails.length === 0, fails, notes }, null, 2));
  process.exit(fails.length ? 1 : 0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
