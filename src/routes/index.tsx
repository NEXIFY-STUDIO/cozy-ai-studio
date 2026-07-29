import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Check,
  Code2,
  Command,
  Eye,
  FlaskConical,
  Layers,
  Play,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      {
        title: "COSY Studio — Od nápadu k aplikácii s AI",
      },
      {
        name: "description",
        content:
          "Vizualny AI studio. Planuj, generuj kod, schvaluj zmeny a nasadzuj — s agentmi G0, G1 a G2.",
      },
    ],
  }),
});

const FEATURES = [
  {
    icon: Brain,
    title: "Tri agenti, jeden tok",
    body: "Plánovač navrhne štruktúru, kóder streamuje zmeny a auditor skontroluje bezpečnosť aj štýl.",
    span: "sm:col-span-2",
  },
  {
    icon: Code2,
    title: "Diff, ktorý chápeš",
    body: "Farebné pridania a odobratia. Schvál alebo zamietni bloky jedným klikom.",
    span: "",
  },
  {
    icon: Eye,
    title: "Náhľad v reálnom čase",
    body: "Mobil, tablet aj desktop. Vidíš výsledok skôr, než niečo uložíš.",
    span: "",
  },
  {
    icon: ShieldCheck,
    title: "Ty rozhoduješ",
    body: "Žiadny slepý commit. Human-in-the-loop karty pred zápisom do projektu.",
    span: "",
  },
  {
    icon: Layers,
    title: "Builder Kernel + pluginy",
    body: "Headless jadro, node graf a plugin SDK. Vyskúšaj v Lab playgroundi.",
    span: "sm:col-span-2",
  },
  {
    icon: Smartphone,
    title: "Mobilný companion",
    body: "Schvaľuj zmeny na ceste swipe gestami.",
    span: "",
  },
  {
    icon: Upload,
    title: "Publikuj na jeden klik",
    body: "Nasadenie na *.cosy.studio a galéria v Showcase.",
    span: "",
  },
  {
    icon: Zap,
    title: "Go to Production",
    body: "Kontroly, predplatné, build, SSL a live URL v jednom sprievodcovi.",
    span: "",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Opíš zámer",
    body: "Napríklad „landing pre kaviareň s cenníkom“. Stačí jedna veta.",
  },
  {
    n: "02",
    title: "Sleduj agentov",
    body: "G0 plánuje, G1 píše kód, G2 audituje. Všetko vidíš v paneli.",
  },
  {
    n: "03",
    title: "Schváľ a spusti",
    body: "Inline accept/reject, live preview, potom produkčný deploy.",
  },
];

const PROMPTS = [
  "Landing pre remeselnú kávu v Košiciach",
  "Dashboard s metriky a dark mode",
  "Pricing stránka s tromi balíkmi",
];

function LandingPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [focused, setFocused] = useState(false);

  const launch = (value?: string) => {
    const q = (value ?? prompt).trim();
    if (q) {
      try {
        sessionStorage.setItem("cosy-landing-prompt", q);
      } catch {
        /* ignore */
      }
    }
    void navigate({ to: "/studio" });
  };

  return (
    <div className="min-h-dvh bg-background text-foreground overflow-x-hidden">
      {/* Ambient wash — restrained, not purple AI soup */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-choco/[0.07] blur-3xl" />
        <div className="absolute top-[40%] right-[-10%] h-[360px] w-[360px] rounded-full bg-choco-soft/40 blur-3xl dark:bg-choco/10" />
      </div>

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-choco text-white font-serif font-bold text-sm shadow-[var(--shadow-brutalist-sm)] group-hover:-translate-y-px transition-transform">
              C
            </div>
            <div className="leading-none">
              <span className="font-serif text-lg font-bold tracking-tight">
                COSY Studio
              </span>
              <span className="hidden sm:block text-[11px] text-muted-foreground mt-0.5">
                AI visual IDE
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            {[
              { href: "#funkcie", label: "Funkcie" },
              { href: "#ako", label: "Ako to funguje" },
              { to: "/playground" as const, label: "Lab" },
              { to: "/pricing" as const, label: "Cenník" },
              { to: "/showcase" as const, label: "Galéria" },
            ].map((item) =>
              "href" in item ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  className="rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/playground" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="h-9 gap-1.5">
                <FlaskConical className="h-3.5 w-3.5" />
                Lab
              </Button>
            </Link>
            <Link to="/studio">
              <Button size="sm" className="h-9 gap-1.5">
                Otvoriť studio
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ───────────────────────────────────────── */}
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-14 sm:pt-20 pb-10 sm:pb-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-success agent-pulse" />
              Multi-agent · Human-in-the-loop · SK-ready
            </div>

            <h1 className="font-serif text-[2.35rem] sm:text-6xl lg:text-[4rem] font-bold leading-[1.08] tracking-tight mb-5 text-balance">
              Od vety k živej appke{" "}
              <span className="text-choco">— s tebou v slučke</span>
            </h1>

            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 text-pretty">
              COSY Studio je vizuálne AI prostredie: agenti naplánujú, napíšu a
              skontrolujú kód. Ty schvaľuješ zmeny, sleduješ diff a live preview —
              ako v modernom AI studio, ale s teplým, prehľadným dizajnom.
            </p>

            {/* Prompt dock — Lovable / AI Studio vibe */}
            <div
              className={cn(
                "mx-auto max-w-2xl rounded-2xl border bg-card p-2 sm:p-2.5 shadow-[var(--shadow-elevated)] transition-shadow",
                focused ? "border-choco/50 ring-2 ring-choco/20" : "border-border",
              )}
            >
              <label className="sr-only" htmlFor="hero-prompt">
                Opíš, čo chceš postaviť
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-choco pointer-events-none" />
                  <input
                    id="hero-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") launch();
                    }}
                    placeholder="Napr. „Landing pre kaviarenský brand s cenníkom“"
                    className="h-12 sm:h-14 w-full rounded-xl border-0 bg-muted/50 pl-10 pr-3 text-sm sm:text-base outline-none placeholder:text-muted-foreground/80 focus:bg-muted/70"
                  />
                </div>
                <Button
                  size="lg"
                  className="h-12 sm:h-14 shrink-0 gap-2 px-6"
                  onClick={() => launch()}
                >
                  <Play className="h-4 w-4" />
                  Spustiť v studiu
                </Button>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 px-1 pb-0.5">
                <span className="text-xs text-muted-foreground">Skús:</span>
                {PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPrompt(p);
                      launch(p);
                    }}
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-choco/40 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-success" /> Bez inštalácie
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-success" /> Free 100 promptov
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Command className="h-3.5 w-3.5" /> ⌘K v studiu
              </span>
            </div>
          </div>

          {/* Product stage */}
          <div className="relative mx-auto mt-14 max-w-5xl">
            <div className="absolute -inset-3 sm:-inset-4 rounded-[1.75rem] bg-gradient-to-b from-choco/10 via-transparent to-transparent blur-sm" />
            <div className="relative rounded-[1.35rem] border border-border bg-card/90 p-2 sm:p-3 shadow-[var(--shadow-elevated)] backdrop-blur">
              {/* Fake window chrome */}
              <div className="mb-2 flex items-center gap-2 px-2 py-1.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="inline-flex rounded-md bg-muted px-3 py-1 text-xs font-mono text-muted-foreground">
                    cosy.studio / studio
                  </span>
                </div>
                <div className="w-12" />
              </div>

              <div className="grid gap-2 lg:grid-cols-[0.9fr_1.15fr_0.95fr] min-h-[300px] sm:min-h-[340px]">
                {/* Agents */}
                <div className="rounded-2xl border border-border bg-muted/40 p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-4 w-4 text-choco" />
                    <span className="text-sm font-semibold">Agenti</span>
                    <span className="ml-auto text-xs font-mono text-muted-foreground">
                      G0 → G1 → G2
                    </span>
                  </div>
                  <div className="space-y-2.5 flex-1">
                    {[
                      { name: "Plánovač", status: "hotovo", done: true },
                      { name: "Kóder", status: "hotovo", done: true },
                      { name: "Auditor", status: "beží…", done: false },
                    ].map((a) => (
                      <div
                        key={a.name}
                        className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5"
                      >
                        <span
                          className={cn(
                            "h-2 w-2 rounded-full shrink-0",
                            a.done ? "bg-success" : "bg-choco agent-pulse",
                          )}
                        />
                        <span className="text-sm font-medium">{a.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    Každý krok je viditeľný — žiadna čierna skrinka.
                  </p>
                </div>

                {/* Diff */}
                <div className="rounded-2xl border border-border bg-[#141414] p-4 font-mono text-[12.5px] leading-6 overflow-hidden text-[#e8eaed]">
                  <div className="flex items-center gap-2 mb-3 text-white/50">
                    <Code2 className="h-3.5 w-3.5 text-choco" />
                    <span>diff · Hero.tsx</span>
                    <span className="ml-auto text-[11px] rounded bg-white/10 px-1.5 py-0.5">
                      +12 −3
                    </span>
                  </div>
                  <div className="text-red-300/90 bg-red-500/10 px-2 rounded-md">
                    {"−  <h1>Vitajte</h1>"}
                  </div>
                  <div className="text-emerald-300 bg-emerald-500/10 px-2 rounded-md mt-0.5">
                    {"+  <h1>Od vety k živej appke</h1>"}
                  </div>
                  <div className="text-white/45 px-2 mt-2">
                    {"  <p className=\"text-lg\">…"}
                  </div>
                  <div className="text-emerald-300 bg-emerald-500/10 px-2 rounded-md mt-0.5">
                    {"+  <Button>Spustiť v studiu</Button>"}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="rounded-lg bg-emerald-500/15 text-emerald-300 px-2.5 py-1 text-xs">
                      Schváliť blok
                    </span>
                    <span className="rounded-lg bg-white/8 text-white/55 px-2.5 py-1 text-xs">
                      Zamietnuť
                    </span>
                  </div>
                </div>

                {/* Preview */}
                <div className="rounded-2xl border border-border bg-muted/40 p-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="h-4 w-4 text-choco" />
                    <span className="text-sm font-semibold">Live preview</span>
                  </div>
                  <div className="flex-1 rounded-[1.35rem] border-[5px] border-charcoal/15 dark:border-white/15 bg-white dark:bg-canvas-elevated p-4 flex flex-col items-center justify-center text-center shadow-inner min-h-[200px]">
                    <p className="font-serif text-xl font-bold text-charcoal dark:text-[#f2f3f5]">
                      Aurora Café
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 max-w-[12rem] leading-relaxed">
                      Mobilný frame · 375×667 · chocolate accent
                    </p>
                    <div className="mt-4 h-9 w-28 rounded-xl bg-choco text-white text-xs font-medium flex items-center justify-center">
                      Objednať
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust strip ────────────────────────────────── */}
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground/80">Stavané pre</span>
            {["Product dizajn", "Frontend", "Startup MVP", "Agentické workflow"].map(
              (t) => (
                <span key={t} className="font-serif text-base font-semibold tracking-tight">
                  {t}
                </span>
              ),
            )}
          </div>
        </section>

        {/* ── Features bento ─────────────────────────────── */}
        <section id="funkcie" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl mb-12">
              <p className="label-caps text-choco mb-3">Funkcie</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-balance">
                Všetko, čo čakáš od AI studia — a kontrola navyše
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Inšpirované rýchlosťou Lovable a prehľadnosťou AI Studio. Bez
                fialového chaosu, s chocolate accentom a jasným canvasom.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, body, span }) => (
                <article
                  key={title}
                  className={cn(
                    "group rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-sm hover:shadow-[var(--shadow-elevated)] hover:border-choco/25 transition-all duration-200",
                    span,
                  )}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-choco/10 text-choco group-hover:bg-choco group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-2 leading-snug">
                    {title}
                  </h3>
                  <p className="text-[0.95rem] text-muted-foreground leading-relaxed">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ───────────────────────────────── */}
        <section id="ako" className="border-t border-border bg-muted/35 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="label-caps text-choco mb-3">Ako to funguje</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                Tri kroky. Žiadna mágia, plná kontrola.
              </h2>
            </div>
            <ol className="grid gap-4 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className="relative rounded-3xl border border-border bg-card p-6 sm:p-7"
                >
                  <span className="font-serif text-4xl font-bold text-choco/25">
                    {s.n}
                  </span>
                  <h3 className="font-serif text-xl font-bold mt-2 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-[0.95rem] text-muted-foreground leading-relaxed">
                    {s.body}
                  </p>
                  {i < STEPS.length - 1 && (
                    <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-choco/40 z-10" />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Lab + pricing teaser ───────────────────────── */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-border bg-canvas text-[#f2f3f5] p-8 sm:p-10 relative overflow-hidden">
              <div
                aria-hidden
                className="absolute inset-0 bg-dots-pattern opacity-80"
              />
              <div className="relative">
                <FlaskConical className="h-8 w-8 text-choco mb-4" />
                <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
                  COSY Lab
                </h3>
                <p className="text-[0.95rem] text-white/70 leading-relaxed max-w-md mb-6">
                  Playground s Builder Kernel, Plugin SDK, Mistral gateway a
                  canvasom. Vyskúšaj breakthrough API skôr, než pôjdu do
                  produkcie.
                </p>
                <Link to="/playground">
                  <Button className="gap-2">
                    Otvoriť Lab
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-card p-8 sm:p-10 flex flex-col">
              <p className="label-caps text-choco mb-3">Cenník</p>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3">
                Začni zadarmo. Škáluj s Pro.
              </h3>
              <p className="text-[0.95rem] text-muted-foreground leading-relaxed mb-6 flex-1">
                Free tier: 100 promptov a základný preview. Pro odomkne plný
                G0–G2 stack, produkčný launch a prioritné tokeny.
              </p>
              <ul className="space-y-2.5 mb-8 text-sm">
                {[
                  "100 free promptov na štart",
                  "Live preview a code diff",
                  "Pro: Go to Production wizard",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <Link to="/pricing">
                  <Button variant="outline" className="gap-2">
                    Zobraziť cenník
                  </Button>
                </Link>
                <Link to="/studio">
                  <Button variant="secondary" className="gap-2">
                    Vyskúšať studio
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ──────────────────────────────────── */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24 text-center">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-balance">
              Pripravený postaviť niečo krásne?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
              Otvor studio, napíš prvý prompt a nechaj agentov pracovať — ty
              držíš kľúč od každého commitu.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/studio">
                <Button size="lg" className="h-12 gap-2 px-8">
                  <Sparkles className="h-4 w-4" />
                  Spustiť COSY Studio
                </Button>
              </Link>
              <Link to="/playground">
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Najprv Lab playground
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-choco text-white font-serif font-bold text-xs">
              C
            </div>
            <span className="font-medium text-foreground">COSY Studio</span>
            <span className="text-xs">v1.0</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/studio" className="hover:text-foreground transition-colors">
              Studio
            </Link>
            <Link
              to="/playground"
              className="hover:text-foreground transition-colors"
            >
              Lab
            </Link>
            <Link to="/pricing" className="hover:text-foreground transition-colors">
              Cenník
            </Link>
            <Link
              to="/showcase"
              className="hover:text-foreground transition-colors"
            >
              Galéria
            </Link>
            <Link to="/mobile" className="hover:text-foreground transition-colors">
              Mobil
            </Link>
          </div>
          <p className="text-xs">Warm Brutalism · Chocolate · Canvas grey</p>
        </div>
      </footer>
    </div>
  );
}
