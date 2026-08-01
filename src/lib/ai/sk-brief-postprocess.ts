/**
 * Lightweight Slovak-aware post-process for Studio briefs.
 *
 * Layers (fast → specific):
 * 1) fence / quote strip
 * 2) language hint (SK vs EN) — avoids CZ bleed on SK text
 * 3) whole-phrase multiword fixes
 * 4) case-preserving token glossary (domain + diacritics)
 * 5) soft length clamp
 *
 * Not a full spellchecker (no Hunspell/ByT5). Domain glossary covers
 * ~80% of brief typos users type on phone without diacritics.
 */

/** High-value SK domain terms users type without diacritics / with typos */
const SK_TOKEN_MAP: Record<string, string> = {
  // cities / brands common in our demos
  kosice: "Košice",
  kosiciach: "Košiciach",
  bratislava: "Bratislava",
  // café / product
  kaviaren: "kaviareň",
  kaviarni: "kaviarni",
  kava: "káva",
  kavu: "kávu",
  kavy: "kávy",
  terakota: "terakota",
  terakotovy: "terakotový",
  terakotova: "terakotová",
  terakotove: "terakotové",
  terakotovym: "terakotovým",
  terakotovou: "terakotovou",
  kremovy: "krémový",
  kremova: "krémová",
  kremove: "krémové",
  // UI / product Slovak
  tlacidlo: "tlačidlo",
  tlacidla: "tlačidlá",
  nadpis: "nadpis",
  hlavicka: "hlavička",
  paticka: "pätička",
  galeria: "galéria",
  cennik: "cenník",
  objednat: "objednať",
  objednaj: "objednaj",
  prihlasenie: "prihlásenie",
  odhlasenie: "odhlásenie",
  nastavenia: "nastavenia",
  zobrazenie: "zobrazenie",
  responzivny: "responzívny",
  responzivne: "responzívne",
  mobilny: "mobilný",
  mobilna: "mobilná",
  mobilne: "mobilné",
  // technical SK phonetics
  dizajn: "dizajn",
  styly: "štýly",
  styl: "štýl",
  farby: "farby",
  farba: "farba",
};

/** EN / product-English typos that appear even in SK briefs */
const EN_TOKEN_MAP: Record<string, string> = {
  landig: "landing",
  landng: "landing",
  promt: "prompt",
  promts: "prompts",
  msitral: "Mistral",
  mistrall: "Mistral",
  digtal: "digital",
  digial: "digital",
  resolutin: "resolution",
  resoultion: "resolution",
  fullstack: "full-stack",
  webiste: "website",
  websit: "website",
  heder: "header",
  heaeder: "header",
  footter: "footer",
  buton: "button",
  buttom: "button",
  stilcky: "sticky",
  stickey: "sticky",
  sefl: "self",
  contianed: "contained",
  mobil: "mobile", // only as whole token; "mobil first" etc.
};

const MULTIWORD: [RegExp, string][] = [
  [/\bkaviare\s+n\b/gi, "kaviareň"],
  [/\bv\s+kosiciach\b/gi, "v Košiciach"],
  [/\bv\s+kosice\b/gi, "v Košiciach"],
  [/\bself\s+contained\b/gi, "self-contained"],
  [/\bmobile\s+frist\b/gi, "mobile-first"],
  [/\bmobil\s+first\b/gi, "mobile-first"],
  [/\bmobil-first\b/gi, "mobile-first"],
  [/\bsticky\s+heder\b/gi, "sticky header"],
  [/\bcall\s+to\s+acton\b/gi, "call to action"],
  [/\bfull\s+stack\b/gi, "full-stack"],
];

/** Czech bleed → Slovak (when text is SK) */
const CZ_TO_SK: [RegExp, string][] = [
  [/\bpro\s+moderní\b/gi, "pre modernú"],
  [/\bpro\s+modernu\b/gi, "pre modernú"],
  [/\bpro\s+/gi, "pre "],
  [/\bpřichytav/gi, "priľnav"],
  [/\bnyn[ií]\b/gi, "teraz"],
  [/\btlačítk/gi, "tlačidl"],
  [/\btlacitk/gi, "tlačidl"],
  [/\bobjednat\s+nyn[ií]\b/gi, "objednať teraz"],
  [/\bkter[yýáaéé]\b/gi, "ktorý"],
  [/\bjenom\b/gi, "iba"],
  [/\bmoderní\b/gi, "modernú"],
];

const SK_HINT =
  /[áäčďéíĺľňóôŕšťúýžÁÄČĎÉÍĹĽŇÓÔŔŠŤÚÝŽ]|\b(pre|kaviareň|stránka|tlačidlo|hlavička|objednať|mobilný|farby|sekcie)\b/i;

function looksSlovak(text: string): boolean {
  if (SK_HINT.test(text)) return true;
  // bare forms without diacritics that still signal SK
  return /\b(kaviaren|kosice|tlacidlo|objednat|hlavicka|galeria|cennik|nastavenia)\b/i.test(
    text,
  );
}

function applyCase(sample: string, replacement: string): string {
  if (!sample) return replacement;
  if (sample === sample.toUpperCase() && sample.length > 1) {
    return replacement.toUpperCase();
  }
  if (sample[0] === sample[0]?.toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function mapToken(raw: string, dict: Record<string, string>): string {
  // keep punctuation glued: "kaviaren," → fix stem
  const m = raw.match(/^([("'„«]*)(.*?)([)\]"'“».,;:!?…]*)$/);
  if (!m) return raw;
  const [, pre, core, post] = m;
  if (!core || core.length < 2) return raw;
  // skip URLs, paths, @handles, ALLCAPS brands longer codes
  if (/^https?:\/\//i.test(core) || core.includes("/") || core.startsWith("@")) {
    return raw;
  }
  if (/^[A-Z0-9]{2,}[-_][A-Z0-9-]+$/.test(core)) return raw; // D1G1C3RT-ish
  const key = core.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  // Prefer exact lower key first, then stripped diacritics key
  const hit =
    dict[core.toLowerCase()] ??
    dict[key] ??
    null;
  if (!hit) return raw;
  return `${pre}${applyCase(core, hit)}${post}`;
}

export type SkPostprocessResult = {
  text: string;
  lang: "sk" | "en" | "mixed";
  fixes: number;
};

export function postprocessStudioBrief(input: string): SkPostprocessResult {
  let t = input.trim();
  if (!t) return { text: t, lang: "en", fixes: 0 };
  const before = t;

  t = t.replace(/^```[\w]*\n?|\n?```$/g, "").trim();
  t = t.replace(/^["'“”„«]+|["'“”»]+$/g, "").trim();
  t = t.replace(
    /^(here(?:'s| is)|improved brief|brief|vylepšený brief)\s*:\s*/i,
    "",
  ).trim();

  for (const [re, to] of MULTIWORD) t = t.replace(re, to);

  const sk = looksSlovak(t);
  if (sk) {
    for (const [re, to] of CZ_TO_SK) t = t.replace(re, to);
  }

  const dict = { ...EN_TOKEN_MAP, ...(sk ? SK_TOKEN_MAP : {}) };
  t = t
    .split(/(\s+)/)
    .map((part) => (/^\s+$/.test(part) ? part : mapToken(part, dict)))
    .join("");

  // Soft clamp — keep complete last word when possible
  if (t.length > 600) {
    const cut = t.slice(0, 597);
    const sp = cut.lastIndexOf(" ");
    t = (sp > 400 ? cut.slice(0, sp) : cut).trimEnd() + "…";
  }

  // crude fix count
  const fixes =
    before === t
      ? 0
      : Math.max(
          1,
          Math.abs(before.length - t.length) +
            (before.toLowerCase() === t.toLowerCase() ? 0 : 1),
        );

  return {
    text: t,
    lang: sk ? "sk" : "en",
    fixes,
  };
}

/** Back-compat helper used by brief-assist */
export function cleanBrief(text: string): string {
  return postprocessStudioBrief(text).text;
}
