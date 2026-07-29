import { buildPreviewHtml } from "@/stores/studio-store";
import type { TaskNode } from "./types";

export type Intent =
  | "pricing"
  | "dashboard"
  | "portfolio"
  | "todo"
  | "dark"
  | "nav"
  | "form"
  | "hero";

export interface GeneratedArtifact {
  plan: string;
  code: string;
  language: string;
  filePath: string;
  previewHtml: string;
  auditNotes: string[];
  title: string;
  description: string;
  affectedFiles: string[];
  taskGraph: TaskNode[];
}

export type { TaskNode };

export function detectIntent(prompt: string): Intent {
  const p = prompt.toLowerCase();
  if (p.includes("pricing") || p.includes("cen") || p.includes("plan")) return "pricing";
  if (p.includes("dashboard") || p.includes("metric") || p.includes("analytics"))
    return "dashboard";
  if (p.includes("portfolio") || p.includes("gallery") || p.includes("showcase"))
    return "portfolio";
  if (p.includes("todo") || p.includes("task") || p.includes("checklist")) return "todo";
  if (p.includes("dark") || p.includes("theme") || p.includes("tmav")) return "dark";
  if (p.includes("nav") || p.includes("header") || p.includes("menu")) return "nav";
  if (p.includes("form") || p.includes("contact") || p.includes("login")) return "form";
  return "hero";
}

function generateRaw(intent: Intent, prompt: string): Omit<GeneratedArtifact, "taskGraph"> {
  switch (intent) {
    case "pricing":
      return {
        title: "Pricing section with 3 tiers",
        description:
          "Adds a Free / Pro / Enterprise pricing grid with terracotta CTAs and brutalist shadows.",
        affectedFiles: ["src/App.tsx", "src/styles.css"],
        filePath: "src/App.tsx",
        language: "typescript",
        plan: `Task Graph (G0):
1. Extract PricingSection component
2. Define Free / Pro / Enterprise tiers with features
3. Highlight Pro as recommended (terracotta border)
4. Wire CTA buttons to upgrade flow
5. Ensure mobile stacking at 390px`,
        auditNotes: [
          "OWASP: no user input → XSS safe",
          "Tailwind-compatible utility classes",
          "Keyboard focusable CTAs",
          "Contrast AA on terracotta buttons",
        ],
        code: `import React from "react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    blurb: "For exploring ideas",
    features: ["100 AI prompts / mo", "G0 Planner only", "Community gallery"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    blurb: "For serious builders",
    features: ["Unlimited prompts", "Full G0 → G1 → G2", "Live multi-device preview"],
    cta: "Go Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    blurb: "Per seat / month",
    features: ["Priority GPU queue", "Team CRDT collab", "SSO & audit logs"],
    cta: "Talk to sales",
    highlight: false,
  },
];

export default function App() {
  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1C1D21]">
      <header className="border-b border-black/10 px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold">Aurora</h1>
        <button className="rounded-lg bg-[#D96B43] px-4 py-2 text-white text-sm font-medium">
          Dashboard
        </button>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-center text-sm font-semibold tracking-widest text-[#D96B43] uppercase mb-3">
          Pricing
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4">
          Simple plans. Honest compute.
        </h2>
        <p className="text-center text-black/60 max-w-xl mx-auto mb-12">
          {/* Prompt: ${prompt.slice(0, 80)} */}
          Scale from weekend prototype to multi-agent production without rewriting your stack.
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={\`rounded-2xl border bg-white p-6 flex flex-col \${
                tier.highlight
                  ? "border-[#D96B43] border-2 shadow-[4px_4px_0_#1C1D21] scale-[1.02]"
                  : "border-black/10 shadow-sm"
              }\`}
            >
              {tier.highlight && (
                <span className="mb-3 inline-block w-fit rounded-full bg-[#D96B43]/15 px-2.5 py-0.5 text-xs font-semibold text-[#C85A32]">
                  Recommended
                </span>
              )}
              <h3 className="font-serif text-xl font-bold">{tier.name}</h3>
              <p className="text-sm text-black/55 mt-1">{tier.blurb}</p>
              <p className="mt-4 mb-6">
                <span className="font-serif text-4xl font-bold">{tier.price}</span>
                <span className="text-sm text-black/50"> / mo</span>
              </p>
              <ul className="space-y-2 text-sm text-black/70 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-[#D96B43]">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={\`w-full rounded-xl py-2.5 text-sm font-medium \${
                  tier.highlight
                    ? "bg-[#D96B43] text-white shadow-[3px_3px_0_#1C1D21]"
                    : "border-2 border-[#1C1D21] bg-transparent"
                }\`}
              >
                {tier.cta}
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
`,
        previewHtml: `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,system-ui,sans-serif;background:#F4F1EA;color:#1C1D21;min-height:100vh}
header{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.5rem;border-bottom:1px solid rgba(0,0,0,.1)}
.logo{font-family:"Playfair Display",serif;font-weight:700;font-size:1.35rem}
.btn{background:#D96B43;color:#fff;border:0;border-radius:.65rem;padding:.5rem 1rem;font-size:.85rem;font-weight:500}
main{max-width:56rem;margin:0 auto;padding:2.5rem 1.25rem}
.eyebrow{text-align:center;font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:#D96B43;font-weight:600;margin-bottom:.75rem}
h1{font-family:"Playfair Display",serif;font-size:clamp(1.75rem,5vw,2.75rem);text-align:center;margin-bottom:.75rem}
.sub{text-align:center;color:rgba(28,29,33,.55);margin-bottom:2rem;font-size:.95rem}
.grid{display:grid;gap:1rem}@media(min-width:700px){.grid{grid-template-columns:repeat(3,1fr)}}
.card{background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:1rem;padding:1.25rem;display:flex;flex-direction:column}
.card.hi{border:2px solid #D96B43;box-shadow:4px 4px 0 #1C1D21}
.badge{display:inline-block;background:rgba(217,107,67,.15);color:#C85A32;font-size:.65rem;font-weight:600;padding:.2rem .5rem;border-radius:999px;margin-bottom:.5rem;width:fit-content}
.price{font-family:"Playfair Display",serif;font-size:2rem;font-weight:700;margin:.75rem 0 1rem}
ul{list-style:none;font-size:.85rem;color:rgba(28,29,33,.7);flex:1;margin-bottom:1rem}
li{margin-bottom:.4rem}li::before{content:"✓ ";color:#D96B43}
.cta{width:100%;border-radius:.75rem;padding:.65rem;font-weight:500;font-size:.85rem;cursor:pointer;border:2px solid #1C1D21;background:transparent}
.cta.primary{background:#D96B43;color:#fff;border:none;box-shadow:3px 3px 0 #1C1D21}
</style></head><body>
<header><div class="logo">Aurora</div><button class="btn">Dashboard</button></header>
<main>
<p class="eyebrow">Pricing</p>
<h1>Simple plans. Honest compute.</h1>
<p class="sub">Scale from weekend prototype to multi-agent production.</p>
<div class="grid">
  <div class="card"><h3>Free</h3><p style="font-size:.8rem;color:#666">For exploring ideas</p><div class="price">$0</div><ul><li>100 AI prompts / mo</li><li>G0 Planner only</li><li>Community gallery</li></ul><button class="cta">Start free</button></div>
  <div class="card hi"><span class="badge">Recommended</span><h3>Pro</h3><p style="font-size:.8rem;color:#666">For serious builders</p><div class="price">$29</div><ul><li>Unlimited prompts</li><li>Full G0 → G1 → G2</li><li>Live multi-device preview</li></ul><button class="cta primary">Go Pro</button></div>
  <div class="card"><h3>Enterprise</h3><p style="font-size:.8rem;color:#666">Per seat / month</p><div class="price">$49</div><ul><li>Priority GPU queue</li><li>Team CRDT collab</li><li>SSO & audit logs</li></ul><button class="cta">Talk to sales</button></div>
</div>
</main></body></html>`,
      };

    case "dashboard":
      return {
        title: "Metrics dashboard shell",
        description:
          "Creates a warm brutalist analytics layout with KPI cards and a simple activity list.",
        affectedFiles: ["src/App.tsx"],
        filePath: "src/App.tsx",
        language: "typescript",
        plan: `Task Graph (G0):
1. App shell with sidebar + main
2. Four KPI cards (MRR, Users, Latency, Approvals)
3. Activity feed from agent pipeline
4. Responsive: stack on mobile, grid on desktop`,
        auditNotes: [
          "No external scripts — XSS surface minimal",
          "Tabular nums for metrics",
          "Semantic headings hierarchy",
        ],
        code: `import React from "react";

const kpis = [
  { label: "MRR", value: "$12.4k", delta: "+8.2%" },
  { label: "Active users", value: "2,481", delta: "+12%" },
  { label: "Avg latency", value: "142ms", delta: "-18ms" },
  { label: "Approvals", value: "94%", delta: "+2.1%" },
];

const activity = [
  { agent: "G0", text: "Planned pricing section graph", time: "2m" },
  { agent: "G1", text: "Streamed 186 lines of TSX", time: "1m" },
  { agent: "G2", text: "Audit passed — 0 OWASP issues", time: "now" },
];

export default function App() {
  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1C1D21] flex">
      <aside className="hidden md:flex w-56 flex-col border-r border-black/10 p-5 gap-2">
        <div className="font-serif text-xl font-bold mb-6">Aurora</div>
        {["Overview", "Agents", "Billing", "Telemetry"].map((item, i) => (
          <button
            key={item}
            className={\`text-left rounded-lg px-3 py-2 text-sm \${
              i === 0 ? "bg-[#D96B43] text-white" : "hover:bg-black/5"
            }\`}
          >
            {item}
          </button>
        ))}
      </aside>
      <main className="flex-1 p-6 md:p-8">
        <header className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#D96B43] uppercase">
              Dashboard
            </p>
            <h1 className="font-serif text-3xl font-bold mt-1">Studio health</h1>
          </div>
          <button className="rounded-xl bg-[#D96B43] px-4 py-2 text-sm text-white font-medium shadow-[3px_3px_0_#1C1D21]">
            Run audit
          </button>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
          {kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
            >
              <p className="text-xs text-black/50 font-medium">{k.label}</p>
              <p className="font-serif text-3xl font-bold mt-2 tabular-nums">{k.value}</p>
              <p className="text-xs text-[#15803D] mt-1 font-medium">{k.delta}</p>
            </div>
          ))}
        </div>
        <section className="rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="font-serif text-lg font-bold mb-4">Agent activity</h2>
          <ul className="space-y-3">
            {activity.map((a) => (
              <li
                key={a.text}
                className="flex items-center gap-3 text-sm border-b border-black/5 pb-3 last:border-0"
              >
                <span className="rounded-md bg-[#D96B43]/15 text-[#C85A32] px-2 py-0.5 text-xs font-mono font-semibold">
                  {a.agent}
                </span>
                <span className="flex-1">{a.text}</span>
                <span className="text-black/40 text-xs tabular-nums">{a.time}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
`,
        previewHtml: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,system-ui,sans-serif;background:#F4F1EA;color:#1C1D21;min-height:100vh;display:flex}
aside{width:13rem;border-right:1px solid rgba(0,0,0,.1);padding:1.25rem;display:none;flex-direction:column;gap:.35rem}
@media(min-width:768px){aside{display:flex}}
.logo{font-family:"Playfair Display",serif;font-weight:700;font-size:1.2rem;margin-bottom:1.25rem}
.nav{text-align:left;border:0;background:transparent;padding:.5rem .75rem;border-radius:.5rem;font-size:.85rem;cursor:pointer}
.nav.on{background:#D96B43;color:#fff}
main{flex:1;padding:1.5rem}
.eyebrow{font-size:.65rem;letter-spacing:.14em;text-transform:uppercase;color:#D96B43;font-weight:600}
h1{font-family:"Playfair Display",serif;font-size:1.75rem;margin:.25rem 0 1.5rem}
.kpis{display:grid;gap:.75rem;grid-template-columns:1fr 1fr;margin-bottom:1.5rem}
@media(min-width:900px){.kpis{grid-template-columns:repeat(4,1fr)}}
.kpi{background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:1rem;padding:1rem}
.kpi .l{font-size:.7rem;color:#888}.kpi .v{font-family:"Playfair Display",serif;font-size:1.6rem;font-weight:700;margin-top:.35rem}.kpi .d{font-size:.7rem;color:#15803D;margin-top:.2rem}
.feed{background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:1rem;padding:1rem}
.feed h2{font-family:"Playfair Display",serif;font-size:1rem;margin-bottom:.75rem}
.row{display:flex;gap:.6rem;align-items:center;font-size:.8rem;padding:.5rem 0;border-bottom:1px solid rgba(0,0,0,.05)}
.tag{background:rgba(217,107,67,.15);color:#C85A32;font-family:ui-monospace,monospace;font-size:.65rem;font-weight:600;padding:.15rem .4rem;border-radius:.3rem}
</style></head><body>
<aside><div class="logo">Aurora</div>
<button class="nav on">Overview</button><button class="nav">Agents</button><button class="nav">Billing</button><button class="nav">Telemetry</button>
</aside>
<main>
<p class="eyebrow">Dashboard</p>
<h1>Studio health</h1>
<div class="kpis">
  <div class="kpi"><div class="l">MRR</div><div class="v">$12.4k</div><div class="d">+8.2%</div></div>
  <div class="kpi"><div class="l">Active users</div><div class="v">2,481</div><div class="d">+12%</div></div>
  <div class="kpi"><div class="l">Avg latency</div><div class="v">142ms</div><div class="d">-18ms</div></div>
  <div class="kpi"><div class="l">Approvals</div><div class="v">94%</div><div class="d">+2.1%</div></div>
</div>
<div class="feed"><h2>Agent activity</h2>
<div class="row"><span class="tag">G0</span><span style="flex:1">Planned pricing section graph</span><span style="color:#999;font-size:.7rem">2m</span></div>
<div class="row"><span class="tag">G1</span><span style="flex:1">Streamed 186 lines of TSX</span><span style="color:#999;font-size:.7rem">1m</span></div>
<div class="row"><span class="tag">G2</span><span style="flex:1">Audit passed — 0 OWASP issues</span><span style="color:#999;font-size:.7rem">now</span></div>
</div>
</main></body></html>`,
      };

    case "todo":
      return {
        title: "Interactive todo board",
        description: "Ships a warm brutalist task list with add / complete / filter UI.",
        affectedFiles: ["src/App.tsx"],
        filePath: "src/App.tsx",
        language: "typescript",
        plan: `Task Graph (G0):
1. Local state for tasks
2. Add form with Enter submit
3. Complete toggle + filter chips
4. Empty state with serif headline`,
        auditNotes: [
          "Client-only state — no injection vectors",
          "Accessible checkboxes via button role",
          "No eval / dangerouslySetInnerHTML",
        ],
        code: `import React, { useState } from "react";

type Task = { id: string; title: string; done: boolean };

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Review G1 diff for pricing card", done: false },
    { id: "2", title: "Approve mobile companion layout", done: true },
    { id: "3", title: "Ship showcase gallery entry", done: false },
  ]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");

  const visible = tasks.filter((t) =>
    filter === "all" ? true : filter === "open" ? !t.done : t.done,
  );

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1C1D21] px-4 py-10">
      <div className="mx-auto max-w-lg">
        <p className="text-xs font-semibold tracking-widest text-[#D96B43] uppercase mb-2">
          Tasks
        </p>
        <h1 className="font-serif text-4xl font-bold mb-6">Today's board</h1>

        <form
          className="flex gap-2 mb-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            setTasks((t) => [
              { id: String(Date.now()), title: input.trim(), done: false },
              ...t,
            ]);
            setInput("");
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a task…"
            className="flex-1 rounded-xl border-2 border-[#1C1D21]/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#D96B43]"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#D96B43] px-4 py-2.5 text-sm font-medium text-white shadow-[3px_3px_0_#1C1D21]"
          >
            Add
          </button>
        </form>

        <div className="flex gap-2 mb-4">
          {(["all", "open", "done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={\`rounded-lg px-3 py-1.5 text-xs font-medium capitalize \${
                filter === f ? "bg-[#1C1D21] text-white" : "bg-white border border-black/10"
              }\`}
            >
              {f}
            </button>
          ))}
        </div>

        <ul className="space-y-2">
          {visible.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3"
            >
              <button
                onClick={() =>
                  setTasks((all) =>
                    all.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)),
                  )
                }
                className={\`h-5 w-5 rounded-md border-2 flex items-center justify-center text-[10px] \${
                  t.done
                    ? "border-[#D96B43] bg-[#D96B43] text-white"
                    : "border-black/25"
                }\`}
              >
                {t.done ? "✓" : ""}
              </button>
              <span className={\`text-sm flex-1 \${t.done ? "line-through text-black/40" : ""}\`}>
                {t.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
`,
        previewHtml: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,system-ui,sans-serif;background:#F4F1EA;color:#1C1D21;min-height:100vh;padding:2rem 1rem}
.wrap{max-width:28rem;margin:0 auto}
.eyebrow{font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:#D96B43;font-weight:600;margin-bottom:.5rem}
h1{font-family:"Playfair Display",serif;font-size:2rem;margin-bottom:1.25rem}
form{display:flex;gap:.5rem;margin-bottom:1rem}
input{flex:1;border:2px solid rgba(28,29,33,.15);border-radius:.75rem;padding:.65rem 1rem;font-size:.9rem;background:#fff}
button.add{background:#D96B43;color:#fff;border:0;border-radius:.75rem;padding:.65rem 1rem;font-weight:500;box-shadow:3px 3px 0 #1C1D21}
.chips{display:flex;gap:.4rem;margin-bottom:1rem}
.chip{border:1px solid rgba(0,0,0,.1);background:#fff;border-radius:.5rem;padding:.35rem .7rem;font-size:.75rem;cursor:pointer}
.chip.on{background:#1C1D21;color:#fff;border-color:#1C1D21}
.task{display:flex;align-items:center;gap:.75rem;background:#fff;border:1px solid rgba(0,0,0,.1);border-radius:.75rem;padding:.85rem 1rem;margin-bottom:.5rem;font-size:.9rem}
.box{width:1.15rem;height:1.15rem;border:2px solid rgba(0,0,0,.25);border-radius:.3rem;display:flex;align-items:center;justify-content:center;font-size:.65rem}
.box.on{background:#D96B43;border-color:#D96B43;color:#fff}
.done{text-decoration:line-through;color:rgba(0,0,0,.4)}
</style></head><body>
<div class="wrap">
<p class="eyebrow">Tasks</p>
<h1>Today's board</h1>
<form onsubmit="event.preventDefault();const i=this.q;if(!i.value.trim())return;const u=document.getElementById('list');const d=document.createElement('div');d.className='task';d.innerHTML='<div class=box></div><span>'+i.value.replace(/</g,'')+'</span>';u.prepend(d);i.value=''">
<input name="q" placeholder="Add a task…"/><button class="add" type="submit">Add</button>
</form>
<div class="chips"><span class="chip on">all</span><span class="chip">open</span><span class="chip">done</span></div>
<div id="list">
<div class="task"><div class="box"></div><span>Review G1 diff for pricing card</span></div>
<div class="task"><div class="box on">✓</div><span class="done">Approve mobile companion layout</span></div>
<div class="task"><div class="box"></div><span>Ship showcase gallery entry</span></div>
</div>
</div></body></html>`,
      };

    case "portfolio":
      return {
        title: "Editorial portfolio grid",
        description: "Serif-forward portfolio with project cards and terracotta accents.",
        affectedFiles: ["src/App.tsx"],
        filePath: "src/App.tsx",
        language: "typescript",
        plan: `Task Graph (G0):
1. Hero with name + role
2. Project grid (3 case studies)
3. Contact strip
4. Mobile-first vertical rhythm`,
        auditNotes: ["Static content only", "External links use rel noopener pattern ready"],
        code: `import React from "react";

const projects = [
  { title: "COSY Diff Engine", tag: "Product", year: "2026" },
  { title: "Ledger OS", tag: "Fintech", year: "2025" },
  { title: "Nomad Type", tag: "Brand", year: "2025" },
];

export default function App() {
  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1C1D21]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm text-[#D96B43] font-semibold tracking-widest uppercase mb-3">
          Portfolio
        </p>
        <h1 className="font-serif text-5xl font-bold leading-tight mb-4">
          Erik Babčan
        </h1>
        <p className="text-lg text-black/60 mb-12 max-w-md">
          Product designer & builder. Warm interfaces, sharp systems.
        </p>
        <div className="space-y-3">
          {projects.map((p) => (
            <article
              key={p.title}
              className="group flex items-center justify-between rounded-2xl border border-black/10 bg-white px-5 py-5 hover:border-[#D96B43] hover:shadow-[4px_4px_0_#1C1D21] transition-all"
            >
              <div>
                <span className="text-xs font-medium text-[#D96B43]">{p.tag}</span>
                <h2 className="font-serif text-xl font-bold mt-0.5">{p.title}</h2>
              </div>
              <span className="text-sm text-black/40 tabular-nums">{p.year}</span>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
`,
        previewHtml: buildPreviewHtml(
          "Erik",
          "Warm interfaces, sharp systems",
          "Editorial portfolio for product designers — case studies, type, and terracotta accents.",
        ),
      };

    case "form":
      return {
        title: "Contact form with validation shell",
        description: "Glass-bordered contact form with terracotta submit and field states.",
        affectedFiles: ["src/App.tsx"],
        filePath: "src/App.tsx",
        language: "typescript",
        plan: `Task Graph (G0):
1. Form layout (name, email, message)
2. Client-side required validation
3. Success toast state
4. Accessible labels`,
        auditNotes: [
          "No secrets in client",
          "Input sanitization on display",
          "Autocomplete attributes present",
        ],
        code: `import React, { useState } from "react";

export default function App() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1C1D21] flex items-center justify-center p-6">
      <form
        className="w-full max-w-md rounded-2xl border border-black/10 bg-white/90 backdrop-blur-xl p-6 shadow-[4px_4px_0_#1C1D21]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name || !form.email || !form.message) return;
          setSent(true);
        }}
      >
        <p className="text-xs font-semibold tracking-widest text-[#D96B43] uppercase mb-2">
          Contact
        </p>
        <h1 className="font-serif text-3xl font-bold mb-6">Let's talk</h1>
        {sent ? (
          <p className="text-sm text-[#15803D] font-medium py-8 text-center">
            Message queued. We'll reply within one business day.
          </p>
        ) : (
          <div className="space-y-4">
            {(["name", "email", "message"] as const).map((field) => (
              <label key={field} className="block">
                <span className="text-xs font-medium text-black/60 capitalize">{field}</span>
                {field === "message" ? (
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-black/15 bg-[#F4F1EA]/50 px-3 py-2 text-sm outline-none focus:border-[#D96B43]"
                  />
                ) : (
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-black/15 bg-[#F4F1EA]/50 px-3 py-2 text-sm outline-none focus:border-[#D96B43]"
                  />
                )}
              </label>
            ))}
            <button
              type="submit"
              className="w-full rounded-xl bg-[#D96B43] py-2.5 text-sm font-medium text-white shadow-[3px_3px_0_#1C1D21]"
            >
              Send message
            </button>
          </div>
        )}
      </form>
    </main>
  );
}
`,
        previewHtml: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,system-ui,sans-serif;background:#F4F1EA;color:#1C1D21;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.5rem}
form{width:100%;max-width:24rem;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border:1px solid rgba(0,0,0,.1);border-radius:1rem;padding:1.5rem;box-shadow:4px 4px 0 #1C1D21}
.eyebrow{font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;color:#D96B43;font-weight:600;margin-bottom:.4rem}
h1{font-family:"Playfair Display",serif;font-size:1.75rem;margin-bottom:1.25rem}
label{display:block;margin-bottom:.85rem;font-size:.7rem;font-weight:500;color:rgba(0,0,0,.55);text-transform:capitalize}
input,textarea{display:block;width:100%;margin-top:.3rem;border:1px solid rgba(0,0,0,.15);border-radius:.75rem;padding:.6rem .75rem;font-size:.9rem;background:rgba(244,241,234,.5);font-family:inherit}
button{width:100%;background:#D96B43;color:#fff;border:0;border-radius:.75rem;padding:.7rem;font-weight:500;box-shadow:3px 3px 0 #1C1D21;margin-top:.25rem;cursor:pointer}
</style></head><body>
<form onsubmit="event.preventDefault();this.innerHTML='<p class=eyebrow>Contact</p><h1>Let\\'s talk</h1><p style=\\'text-align:center;color:#15803D;padding:2rem 0;font-size:.9rem\\'>Message queued. We\\'ll reply within one business day.</p>'">
<p class="eyebrow">Contact</p><h1>Let's talk</h1>
<label>Name<input required/></label>
<label>Email<input type="email" required/></label>
<label>Message<textarea rows="4" required></textarea></label>
<button type="submit">Send message</button>
</form></body></html>`,
      };

    case "dark":
      return {
        title: "Dark mode slate shell",
        description: "Converts the hero to deep slate with terracotta accents and glass cards.",
        affectedFiles: ["src/App.tsx"],
        filePath: "src/App.tsx",
        language: "typescript",
        plan: `Task Graph (G0):
1. Switch surfaces to slate-dark / slate-card
2. Soften borders to white/10
3. Keep terracotta CTAs
4. Preserve hierarchy in dark contrast`,
        auditNotes: ["Contrast checked for dark surfaces", "No pure #000 body text"],
        code: `import React from "react";

export default function App() {
  return (
    <main className="min-h-screen bg-[#0D0E11] text-[#E8E6E1]">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold">Aurora</h1>
        <button className="rounded-lg bg-[#D96B43] px-4 py-2 text-white text-sm font-medium">
          Get started
        </button>
      </header>
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="mb-4 text-sm font-medium tracking-widest text-[#D96B43] uppercase">
          Dark slate
        </p>
        <h2 className="font-serif text-5xl font-bold leading-tight mb-6">
          Night mode, still warm
        </h2>
        <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
          Deep slate surfaces, glass borders, and terracotta actions — tuned for late-night building sessions.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 text-left">
          <div className="rounded-2xl border border-white/10 bg-[#16181D]/90 backdrop-blur-md p-5">
            <h3 className="font-serif text-lg font-bold mb-1">Glass panels</h3>
            <p className="text-sm text-white/45">Backdrop blur without neon soup.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#16181D]/90 backdrop-blur-md p-5">
            <h3 className="font-serif text-lg font-bold mb-1">Brutal shadows</h3>
            <p className="text-sm text-white/45">Offset shadows in terracotta ink.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
`,
        previewHtml: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:Inter,system-ui,sans-serif;background:#0D0E11;color:#E8E6E1;min-height:100vh}
header{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.5rem;border-bottom:1px solid rgba(255,255,255,.1)}
.logo{font-family:"Playfair Display",serif;font-weight:700;font-size:1.35rem}
.btn{background:#D96B43;color:#fff;border:0;border-radius:.65rem;padding:.55rem 1rem;font-size:.85rem;font-weight:500}
main{max-width:40rem;margin:0 auto;padding:4rem 1.5rem;text-align:center}
.eyebrow{font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:#D96B43;font-weight:600;margin-bottom:1rem}
h1{font-family:"Playfair Display",serif;font-size:clamp(2rem,6vw,3rem);line-height:1.15;margin-bottom:1.25rem}
p{color:rgba(255,255,255,.5);font-size:1.05rem;line-height:1.6;margin-bottom:2rem}
.grid{display:grid;gap:1rem;text-align:left}@media(min-width:540px){.grid{grid-template-columns:1fr 1fr}}
.card{background:rgba(22,24,29,.9);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1);border-radius:1rem;padding:1.25rem}
.card h3{font-family:"Playfair Display",serif;margin-bottom:.35rem}.card p{font-size:.85rem;margin:0;color:rgba(255,255,255,.45)}
</style></head><body>
<header><div class="logo">Aurora</div><button class="btn">Get started</button></header>
<main>
<p class="eyebrow">Dark slate</p>
<h1>Night mode, still warm</h1>
<p>Deep slate surfaces, glass borders, and terracotta actions — tuned for late-night building sessions.</p>
<div class="grid">
<div class="card"><h3>Glass panels</h3><p>Backdrop blur without neon soup.</p></div>
<div class="card"><h3>Brutal shadows</h3><p>Offset shadows in terracotta ink.</p></div>
</div>
</main></body></html>`,
      };

    case "nav":
      return {
        title: "Sticky glass navigation",
        description: "Adds a refined sticky header with glass blur and mobile menu affordance.",
        affectedFiles: ["src/App.tsx"],
        filePath: "src/App.tsx",
        language: "typescript",
        plan: `Task Graph (G0):
1. Sticky top bar with backdrop blur
2. Desktop links + CTA
3. Mobile icon button
4. Brand serif lockup`,
        auditNotes: ["Focus rings on interactive nav items", "No layout shift on sticky"],
        code: `import React, { useState } from "react";

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1C1D21]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#F4F1EA]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <span className="font-serif text-xl font-bold">Aurora</span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-black/60">
            <a href="#product">Product</a>
            <a href="#agents">Agents</a>
            <a href="#pricing">Pricing</a>
            <button className="rounded-lg bg-[#D96B43] px-4 py-2 text-white font-medium shadow-[3px_3px_0_#1C1D21]">
              Open studio
            </button>
          </nav>
          <button
            className="md:hidden rounded-lg border border-black/15 px-3 py-2 text-sm"
            onClick={() => setOpen((v) => !v)}
          >
            Menu
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t border-black/10 px-5 py-3 space-y-2 text-sm">
            <a className="block py-2" href="#product">Product</a>
            <a className="block py-2" href="#agents">Agents</a>
            <a className="block py-2" href="#pricing">Pricing</a>
          </div>
        )}
      </header>
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-serif text-5xl font-bold mb-4">Navigation that stays put</h1>
        <p className="text-black/55 text-lg">Glassmorphic sticky header with mobile collapse.</p>
      </section>
    </main>
  );
}
`,
        previewHtml: buildPreviewHtml(
          "Aurora",
          "Navigation that stays put",
          "Glassmorphic sticky header with mobile collapse and terracotta CTA.",
        ),
      };

    default:
      return {
        title: "Refined hero rewrite",
        description: `G1 rewrote the hero section based on: "${prompt.slice(0, 120)}"`,
        affectedFiles: ["src/App.tsx"],
        filePath: "src/App.tsx",
        language: "typescript",
        plan: `Task Graph (G0):
1. Parse intent from prompt
2. Redesign hero hierarchy (eyebrow → headline → sub → CTAs)
3. Add two feature cards with glass borders
4. Keep Warm Brutalism tokens (cream / charcoal / terracotta)
5. Hand off to G1 for TSX generation`,
        auditNotes: [
          "No dangerouslySetInnerHTML",
          "Tailwind class validity OK",
          "Semantic <main> / <header> structure",
          "CTA contrast AA",
        ],
        code: `import React from "react";

export default function App() {
  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#1C1D21]">
      <header className="border-b border-black/10 px-6 py-4 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold tracking-tight">Aurora</h1>
        <nav className="hidden sm:flex gap-6 text-sm text-black/60 items-center">
          <a href="#features">Features</a>
          <a href="#agents">Agents</a>
          <button className="rounded-lg bg-[#D96B43] px-4 py-2 text-white font-medium shadow-[3px_3px_0_#1C1D21]">
            Open studio
          </button>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="mb-4 text-sm font-semibold tracking-widest text-[#D96B43] uppercase">
          Multi-agent IDE
        </p>
        <h2 className="font-serif text-5xl md:text-6xl font-bold leading-[1.08] mb-6">
          From prompt to polished UI in one breath
        </h2>
        <p className="text-lg text-black/55 mb-10 max-w-xl mx-auto leading-relaxed">
          {/* ${prompt.replace(/\*\//g, "").slice(0, 100)} */}
          G0 plans architecture, G1 streams code, G2 audits security — you approve with Human-in-the-Loop.
        </p>
        <div className="flex justify-center gap-3 flex-wrap mb-16">
          <button className="rounded-xl bg-[#D96B43] px-6 py-3 text-white font-medium shadow-[4px_4px_0_#1C1D21] hover:translate-x-[-1px] hover:translate-y-[-1px]">
            Start free
          </button>
          <button className="rounded-xl border-2 border-[#1C1D21] px-6 py-3 font-medium">
            Watch pipeline
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-left">
          <article className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur-md p-5 shadow-sm">
            <p className="text-xs font-semibold text-[#D96B43] mb-2">G0 → G1 → G2</p>
            <h3 className="font-serif text-xl font-bold mb-1">Orchestrated agents</h3>
            <p className="text-sm text-black/55">Planner, coder, and auditor run as a visible pipeline with live status.</p>
          </article>
          <article className="rounded-2xl border border-black/10 bg-white/80 backdrop-blur-md p-5 shadow-sm">
            <p className="text-xs font-semibold text-[#D96B43] mb-2">HitL</p>
            <h3 className="font-serif text-xl font-bold mb-1">You stay in control</h3>
            <p className="text-sm text-black/55">Approve or reject every change before it lands in the project tree.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
`,
        previewHtml: buildPreviewHtml(
          "Aurora",
          "From prompt to polished UI in one breath",
          "G0 plans, G1 codes, G2 audits — approve changes with Human-in-the-Loop before they land.",
        ),
      };
  }
}



function buildTaskGraph(artifact: Omit<GeneratedArtifact, "taskGraph">): TaskNode[] {
  const fileTasks = artifact.affectedFiles.map((file, i) => ({
    id: `g1-file-${i}`,
    title: `Generate ${file}`,
    agent: "G1_CODER" as const,
    dependsOn: ["g0-plan"],
    status: "pending" as const,
  }));
  return [
    {
      id: "g0-plan",
      title: "Decompose prompt into task graph",
      agent: "G0_PLANNER",
      dependsOn: [],
      status: "pending",
    },
    {
      id: "g0-components",
      title: "Map React component boundaries",
      agent: "G0_PLANNER",
      dependsOn: ["g0-plan"],
      status: "pending",
    },
    ...fileTasks,
    {
      id: "g2-syntax",
      title: "Syntax & export validation",
      agent: "G2_AUDITOR",
      dependsOn: fileTasks.map((t) => t.id),
      status: "pending",
    },
    {
      id: "g2-owasp",
      title: "OWASP Top 10 static scan",
      agent: "G2_AUDITOR",
      dependsOn: ["g2-syntax"],
      status: "pending",
    },
    {
      id: "g2-tailwind",
      title: "Tailwind CSS compatibility",
      agent: "G2_AUDITOR",
      dependsOn: ["g2-owasp"],
      status: "pending",
    },
  ];
}

export function generateForIntent(intent: Intent, prompt: string): GeneratedArtifact {
  const raw = generateRaw(intent, prompt);
  return { ...raw, taskGraph: buildTaskGraph(raw) };
}
