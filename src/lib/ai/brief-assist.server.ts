/**
 * Brief assist — Mistral-powered inspire / improve for Studio composer.
 * Server-only.
 */

import { getMistralApiKey, mistralChat, MistralHttpError } from "./mistral.server";
import { cleanBrief, postprocessStudioBrief } from "./sk-brief-postprocess";

export type BriefAssistMode = "inspire" | "improve";

const INSPIRE_SYSTEM = `You write short Studio briefs for COSY / Cozy AI Studio (Option B speed studio).
The user will send this brief to G0→G1→G2 to generate a self-contained React landing/UI.

Rules:
- Output ONLY the brief text (no quotes, no markdown fences, no preamble).
- 1–3 sentences. Match the user's language when they give a seed (Slovak → Slovak, English → English). Default English if no seed.
- Concrete product: brand name, audience, sections, visual direction, mobile-first.
- Prefer self-contained CSS (no Tailwind-only), sticky header with safe-area, 100vh hero when relevant.
- Variety: pick a fresh niche each time (café, SaaS, portfolio, shop, clinic, festival…).
- Correct spelling and grammar in the output. For Slovak use proper diacritics (kaviareň, Košice, tlačidlo).
- Never switch Slovak to Czech.
- Max ~280 characters when possible, hard max 500.`;

const IMPROVE_SYSTEM = `You are a senior product designer improving Studio briefs for COSY AI Studio.
Rewrite the user's rough idea into a crisp, correctly spelled brief for G0 Planner → G1 Coder.

Rules:
- Output ONLY the improved brief (no quotes, no markdown, no "Here is…").
- FIRST fix all typos, diacritics, and grammar (Slovak and English). Examples: "kaviaren"→"kaviareň", "promt"→"prompt", "kosice"→"Košice", "landig"→"landing".
- Keep the user's intent, language (SK stay SK, EN stay EN), and any named brand.
- Do NOT switch Slovak to Czech (no "pro", "přichytavý", "nyní", "který" when user wrote Slovak — use "pre", "teraz", "ktorý").
- Add: layout sections, visual tokens (warm cream / terracotta when unset), mobile-first, sticky header, CTA.
- Prefer self-contained <style> React App (no Tailwind-only mash).
- 2–4 sentences, max ~450 characters.
- Do not invent unrelated products; sharpen and correct what they wrote.`;

const FALLBACK_INSPIRE = [
  "Landing for Aurora Coffee in Košice: 100vh warm cream hero, sticky Cosy header, menu chips, terracotta Order CTA, mobile-first self-contained CSS.",
  "SaaS metrics dashboard for Flux Metrics: 4 KPI cards, simple bar chart, activity list, sidebar nav Dashboard/Analytics/Settings, warm palette, no Tailwind-only.",
  "Portfolio for studio D1G1C3RT: sticky nav, case-study grid, dark/light toggle with persistence, pixel-perfect mobile, self-contained styles.",
  "Pricing page for Nimbus Host: 3 tiers, annual toggle, FAQ accordion, sticky CTA bar, soft area padding, cream/terracotta brand.",
];

function pickFallback(seed?: string): string {
  const i =
    Math.abs(
      (seed || String(Date.now()))
        .split("")
        .reduce((a, c) => a + c.charCodeAt(0), 0),
    ) % FALLBACK_INSPIRE.length;
  return FALLBACK_INSPIRE[i]!;
}

export async function runBriefAssist(opts: {
  mode: BriefAssistMode;
  text?: string;
  signal?: AbortSignal;
}): Promise<{
  ok: true;
  mode: BriefAssistMode;
  text: string;
  provider: "mistral" | "fallback";
  lang?: "sk" | "en" | "mixed";
  postFixes?: number;
}> {
  const mode = opts.mode;
  const input = (opts.text || "").trim();

  if (mode === "improve" && !input) {
    throw new Error("EMPTY_TEXT");
  }

  const key = getMistralApiKey();
  if (!key) {
    const raw =
      mode === "improve"
        ? `${input} — mobile-first, sticky header, warm cream + terracotta CTA, self-contained CSS React App.`
        : pickFallback(input);
    const pp = postprocessStudioBrief(raw);
    return {
      ok: true,
      mode,
      text: pp.text,
      provider: "fallback",
      lang: pp.lang,
      postFixes: pp.fixes,
    };
  }

  try {
    const langHint = postprocessStudioBrief(input || "x").lang;
    const raw = await mistralChat({
      signal: opts.signal,
      temperature: mode === "inspire" ? 0.95 : 0.35,
      maxTokens: 400,
      model:
        process.env.MISTRAL_MODEL_PLAN ??
        process.env.MISTRAL_MODEL ??
        "mistral-small-latest",
      messages: [
        {
          role: "system",
          content: mode === "inspire" ? INSPIRE_SYSTEM : IMPROVE_SYSTEM,
        },
        {
          role: "user",
          content:
            mode === "inspire"
              ? input
                ? `Inspire a new brief. Language hint: ${langHint}. Optional seed: ${input}`
                : `Generate one fresh random Studio brief now. Variation seed: ${Date.now()}`
              : `Improve and fix typos in this Studio brief. Detected language: ${langHint}. Keep that language. Output only the brief:\n\n${input}`,
        },
      ],
    });
    const pp = postprocessStudioBrief(raw);
    if (!pp.text || pp.text.length < 12) {
      const fb = mode === "improve" ? input : pickFallback(input);
      const fpp = postprocessStudioBrief(fb);
      return {
        ok: true,
        mode,
        text: fpp.text,
        provider: "fallback",
        lang: fpp.lang,
        postFixes: fpp.fixes,
      };
    }
    return {
      ok: true,
      mode,
      text: pp.text,
      provider: "mistral",
      lang: pp.lang,
      postFixes: pp.fixes,
    };
  } catch (e) {
    if (e instanceof MistralHttpError && e.status === 429) {
      throw e;
    }
    const raw =
      mode === "improve"
        ? `${input} — clarify sections, CTA, mobile-first, self-contained styles.`
        : pickFallback(input);
    const pp = postprocessStudioBrief(raw);
    return {
      ok: true,
      mode,
      text: pp.text,
      provider: "fallback",
      lang: pp.lang,
      postFixes: pp.fixes,
    };
  }
}

// re-export for tests
export { cleanBrief, postprocessStudioBrief };
