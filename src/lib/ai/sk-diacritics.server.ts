/**
 * P2: cheap Slovak diacritics-only pass (no rewrite).
 * Uses small model + low temperature. Server-only.
 */

import { getMistralApiKey, mistralChat, MistralHttpError } from "./mistral.server";
import { postprocessStudioBrief } from "./sk-brief-postprocess";

const DIACRITICS_SYSTEM = `You restore Slovak diacritics ONLY.

Rules:
- Output ONLY the corrected text (no quotes, no markdown, no preamble).
- Add missing diacritics: a→á/ä, c→č, d→ď, e→é, i→í, l→ĺ/ľ, n→ň, o→ó/ô, r→ŕ, s→š, t→ť, u→ú, y→ý, z→ž where correct in Slovak.
- Do NOT rewrite, reorder, summarize, or add words.
- Do NOT translate. Do NOT switch to Czech.
- Keep punctuation, numbers, brand codes (e.g. D1G1C3RT), English product words, URLs unchanged.
- Keep line breaks and spacing shape as close as possible.
- If already correct, return the text unchanged.`;

function skeleton(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function looksLikeNeedsDiacritics(text: string): boolean {
  // SK-ish bare forms without diacritics
  if (/[áäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ]/.test(text)) {
    // already has some diacritics — still may miss more
    return /\b(kaviaren|kosice|tlacidlo|objednat|hlavicka|galeria|cennik|stranka|aplikacia|mobilny|responzivny|terakotovy|kremovy)\b/i.test(
      text,
    );
  }
  return /\b(kaviaren|kosice|tlacidlo|objednat|hlavicka|galeria|cennik|stranka|nastavenia|aplikacia|pre|moju|kavu|ponuka)\b/i.test(
    text,
  );
}

function acceptDiacriticsResult(input: string, output: string): boolean {
  const a = input.trim();
  const b = output.trim();
  if (!b || b.length < 2) return false;
  // length must stay in same ballpark (no rewrite/expansion)
  if (b.length > a.length * 1.35 + 12) return false;
  if (b.length < a.length * 0.55 - 8) return false;
  // same letter skeleton (diacritics stripped)
  const sa = skeleton(a);
  const sb = skeleton(b);
  if (sa === sb) return true;
  // allow tiny punctuation drift
  const sa2 = sa.replace(/[^\p{L}\p{N}]+/gu, "");
  const sb2 = sb.replace(/[^\p{L}\p{N}]+/gu, "");
  if (sa2 === sb2) return true;
  // levenshtein-ish cheap: shared prefix/suffix ratio
  if (sa2.length > 8 && sb2.length > 8) {
    let same = 0;
    const n = Math.min(sa2.length, sb2.length);
    for (let i = 0; i < n; i++) if (sa2[i] === sb2[i]) same++;
    if (same / Math.max(sa2.length, sb2.length) >= 0.88) return true;
  }
  return false;
}

export type DiacriticsResult = {
  text: string;
  provider: "mistral" | "glossary" | "noop";
  changed: boolean;
  model?: string;
};

/**
 * Restore Slovak diacritics without semantic rewrite.
 * Pipeline: local glossary first → optional cheap Mistral pass when lang=sk.
 */
export async function restoreSlovakDiacritics(opts: {
  text: string;
  signal?: AbortSignal;
  /** force Mistral even if glossary fully fixed */
  forceModel?: boolean;
}): Promise<DiacriticsResult> {
  const input = (opts.text || "").trim();
  if (!input) {
    return { text: "", provider: "noop", changed: false };
  }

  // 1) free local glossary / multiword
  const local = postprocessStudioBrief(input);
  let text = local.text;
  let provider: DiacriticsResult["provider"] =
    local.fixes > 0 ? "glossary" : "noop";

  const lang = local.lang;
  const needs =
    opts.forceModel ||
    (lang === "sk" && looksLikeNeedsDiacritics(text)) ||
    (lang === "sk" && !/[áäčďéíĺľňóôŕšťúýž]/i.test(text) && /[a-z]{4,}/i.test(text));

  if (!needs || lang === "en") {
    return {
      text,
      provider,
      changed: text !== input,
    };
  }

  if (!getMistralApiKey()) {
    return { text, provider, changed: text !== input };
  }

  const model =
    process.env.MISTRAL_MODEL_DIACRITICS ??
    process.env.MISTRAL_MODEL_PLAN ??
    "mistral-small-latest";

  try {
    const raw = await mistralChat({
      signal: opts.signal,
      model,
      temperature: 0.05,
      maxTokens: Math.min(600, Math.max(120, Math.ceil(text.length * 1.4))),
      messages: [
        { role: "system", content: DIACRITICS_SYSTEM },
        {
          role: "user",
          content: `Restore Slovak diacritics only:\n\n${text}`,
        },
      ],
    });
    let out = raw.trim();
    out = out.replace(/^```[\w]*\n?|\n?```$/g, "").trim();
    out = out.replace(/^["'“”]+|["'“”]+$/g, "").trim();

    if (acceptDiacriticsResult(text, out)) {
      // final local polish
      const polished = postprocessStudioBrief(out);
      return {
        text: polished.text,
        provider: "mistral",
        changed: polished.text !== input,
        model,
      };
    }
    // reject rewrite — keep local
    return { text, provider, changed: text !== input, model };
  } catch (e) {
    if (e instanceof MistralHttpError && e.status === 429) throw e;
    return { text, provider, changed: text !== input };
  }
}
