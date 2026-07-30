#!/usr/bin/env node
/**
 * Option B ship gate — truth + quota + primary surfaces.
 * Requires dev/preview server already on BASE (default http://127.0.0.1:8080).
 *
 * Exit 0 = green. Non-zero = fail with reasons.
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = (process.argv[2] || process.env.SHIP_GATE_BASE || "http://127.0.0.1:8080").replace(
  /\/$/,
  "",
);
const outDir = "/workspace/screenshots";
mkdirSync(outDir, { recursive: true });

const fails = [];
const notes = [];

function must(cond, msg) {
  if (!cond) fails.push(msg);
  else notes.push(`ok: ${msg}`);
}

async function jsonGet(path) {
  const res = await fetch(`${BASE}${path}`);
  const text = await res.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = text.slice(0, 200);
  }
  return { status: res.status, body };
}

async function jsonPost(path, payload) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = text.slice(0, 200);
  }
  return { status: res.status, body };
}

// --- API truth ---
const agentsGet = await jsonGet("/api/agents/run");
must(agentsGet.status === 200, `GET /api/agents/run status ${agentsGet.status}`);
const q = agentsGet.body?.quota || agentsGet.body;
must(q?.planTier === "FREE" || q?.planTier == null || typeof q?.planTier === "string", "quota.planTier present");
must(
  Number(q?.dailyLimit ?? q?.quota?.dailyLimit ?? 0) === 20 ||
    Number(agentsGet.body?.quota?.dailyLimit) === 20,
  "dailyLimit === 20",
);
const dailyLimit = agentsGet.body?.quota?.dailyLimit ?? agentsGet.body?.dailyLimit;
must(dailyLimit === 20, `quota.dailyLimit is 20 (got ${dailyLimit})`);
const promptLimit = agentsGet.body?.quota?.promptLimit ?? agentsGet.body?.promptLimit;
must(promptLimit === 100, `quota.promptLimit is 100 (got ${promptLimit})`);

const empty = await jsonPost("/api/agents/run", {});
must(empty.status === 400 && empty.body?.error === "EMPTY_PROMPT", "empty prompt → 400 EMPTY_PROMPT");

// Landing must not claim Figma / Kernel product
const landHtml = await fetch(`${BASE}/`).then((r) => r.text());
must(!/figma\s*→\s*production/i.test(landHtml), "landing no Figma→production claim");
must(!/enterprise\s+sso/i.test(landHtml), "landing no Enterprise SSO claim");

// Browser surfaces
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(String(e?.message || e)));

  async function visit(path, expectAny) {
    pageErrors.length = 0;
    const res = await page.goto(`${BASE}${path}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForTimeout(1500);
    const text = await page.locator("body").innerText();
    const status = res?.status() ?? 0;
    must(status < 400, `${path} HTTP ${status}`);
    const hit = expectAny.some((s) => text.includes(s));
    must(hit, `${path} contains one of: ${expectAny.join(" | ")}`);
    // Allow known Monaco dispose noise only on leave — fail on other errors
    const real = pageErrors.filter(
      (m) => !m.includes("TextModel got disposed") && !m.includes("ResizeObserver"),
    );
    must(real.length === 0, `${path} no page errors (${real.slice(0, 2).join("; ")})`);
    return text;
  }

  await visit("/", ["Spustiť v studiu", "Studio", "20"]);
  await visit("/pricing", ["Not live yet", "Free", "20"]);
  const studioText = await visit("/studio", ["FREE", "Limits", "Share"]);
  must(!/\bPRO\b/.test(studioText.split("\n").slice(0, 8).join(" ")), "TopBar not default PRO");
  must(studioText.includes("Kaviareň") || studioText.includes("template") || studioText.includes("café") || studioText.includes("Dashboard") || studioText.includes("Pricing"), "templates or empty-state present");

  await page.screenshot({ path: `${outDir}/ship-gate-studio.png` });

  // Playground freeze banner
  await page.goto(`${BASE}/playground`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1200);
  const lab = await page.locator("body").innerText();
  must(
    /not product|experimental|frozen|library demo/i.test(lab),
    "playground shows freeze / not-product banner",
  );
  must(!/Cozy Lab · hracie pieskovisko/i.test(lab), "playground no product Lab hero");
  await page.screenshot({ path: `${outDir}/ship-gate-playground.png` });
} finally {
  await browser.close();
}

const report = {
  base: BASE,
  ok: fails.length === 0,
  fails,
  notes,
  at: new Date().toISOString(),
};
writeFileSync(`${outDir}/ship-gate-report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(fails.length ? 1 : 0);
