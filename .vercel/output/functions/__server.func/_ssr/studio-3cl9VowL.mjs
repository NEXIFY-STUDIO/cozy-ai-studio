import { r as __toESM } from "../_runtime.mjs";
import { n as require_react, t as we } from "../_libs/monaco-editor__react+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn, t as Button } from "./button-CP-_CggN.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as CreditCard, C as House, D as FileCode2, E as FolderTree, F as Bug, I as Brain, M as CodeXml, N as Circle, O as Eye, P as Check, S as LayoutDashboard, T as GitBranch, _ as MessageSquare, a as Square, b as LoaderCircle, c as ShieldCheck, d as Rocket, f as RefreshCw, g as Monitor, h as Moon, i as Sun, j as Command, l as Send, m as MousePointer2, n as Upload, o as Sparkles, p as Paintbrush, r as Tablet, s as Smartphone, t as X, u as RotateCw, v as MessageSquareOff, x as LayoutGrid, y as Maximize2 } from "../_libs/lucide-react.mjs";
import { n as useStudioStore, t as buildPreviewHtml } from "./studio-store-COsw9EQn.mjs";
import { n as Zt, r as tn, t as Xt } from "../_libs/react-resizable-panels.mjs";
import { t as loader } from "../_libs/@monaco-editor/loader+[...].mjs";
import { t as _e } from "../_libs/cmdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio-3cl9VowL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TopBar() {
	const theme = useStudioStore((s) => s.theme);
	const toggleTheme = useStudioStore((s) => s.toggleTheme);
	const setCommandOpen = useStudioStore((s) => s.setCommandOpen);
	const planTier = useStudioStore((s) => s.planTier);
	const publishUrl = useStudioStore((s) => s.publishUrl);
	const setPublishUrl = useStudioStore((s) => s.setPublishUrl);
	const isPipelineRunning = useStudioStore((s) => s.isPipelineRunning);
	const publish = () => {
		const url = `${`app-${Math.random().toString(36).slice(2, 7)}`}.cosy.studio`;
		setPublishUrl(url);
		toast.success(`Published to ${url}`, { description: "Added to COSY Showcase gallery" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-card/80 px-3 sm:px-4 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2 shrink-0 group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-8 w-8 items-center justify-center rounded-lg bg-terracotta text-white font-serif font-bold text-sm shadow-[var(--shadow-brutalist-sm)] group-hover:-translate-y-px transition-transform",
					children: "C"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden sm:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif text-base font-bold leading-none",
						children: "COSY Studio"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] text-muted-foreground font-mono mt-0.5",
						children: "AI Visual IDE"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("hidden md:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium border", isPipelineRunning ? "border-terracotta/40 bg-terracotta/10 text-terracotta" : "border-border bg-muted text-muted-foreground"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 w-1.5 rounded-full", isPipelineRunning ? "bg-terracotta agent-pulse" : "bg-success") }), isPipelineRunning ? "Agents running" : "Ready"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1.5 sm:gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setCommandOpen(true),
					className: "hidden sm:flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 h-9 text-xs text-muted-foreground hover:text-foreground hover:border-terracotta/30 transition-colors min-w-[140px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, { className: "h-3.5 w-3.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Search…" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "ml-auto font-mono text-[10px] opacity-60",
							children: "⌘K"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "sm:hidden h-9 w-9",
					onClick: () => setCommandOpen(true),
					"aria-label": "Command palette",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/showcase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "h-9 w-9",
						"aria-label": "Showcase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-4 w-4" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/mobile",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "h-9 w-9",
						"aria-label": "Mobile companion",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-4 w-4" })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/pricing",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						size: "sm",
						className: "hidden sm:inline-flex h-9 gap-1.5 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-3.5 w-3.5" }), planTier]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "h-9 w-9",
					onClick: toggleTheme,
					"aria-label": "Toggle theme",
					children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: publish,
					className: "h-9 text-xs gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: publishUrl ? "Published" : "Publish"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "sm:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "h-9 w-9",
						"aria-label": "Home",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4" })
					})
				})
			]
		})]
	});
}
function detectIntent(prompt) {
	const p = prompt.toLowerCase();
	if (p.includes("pricing") || p.includes("cen") || p.includes("plan")) return "pricing";
	if (p.includes("dashboard") || p.includes("metric") || p.includes("analytics")) return "dashboard";
	if (p.includes("portfolio") || p.includes("gallery") || p.includes("showcase")) return "portfolio";
	if (p.includes("todo") || p.includes("task") || p.includes("checklist")) return "todo";
	if (p.includes("dark") || p.includes("theme") || p.includes("tmav")) return "dark";
	if (p.includes("nav") || p.includes("header") || p.includes("menu")) return "nav";
	if (p.includes("form") || p.includes("contact") || p.includes("login")) return "form";
	return "hero";
}
function generateRaw(intent, prompt) {
	switch (intent) {
		case "pricing": return {
			title: "Pricing section with 3 tiers",
			description: "Adds a Free / Pro / Enterprise pricing grid with terracotta CTAs and brutalist shadows.",
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
				"Contrast AA on terracotta buttons"
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
</main></body></html>`
		};
		case "dashboard": return {
			title: "Metrics dashboard shell",
			description: "Creates a warm brutalist analytics layout with KPI cards and a simple activity list.",
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
				"Semantic headings hierarchy"
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
</main></body></html>`
		};
		case "todo": return {
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
				"No eval / dangerouslySetInnerHTML"
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
</div></body></html>`
		};
		case "portfolio": return {
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
			previewHtml: buildPreviewHtml("Erik", "Warm interfaces, sharp systems", "Editorial portfolio for product designers — case studies, type, and terracotta accents.")
		};
		case "form": return {
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
				"Autocomplete attributes present"
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
</form></body></html>`
		};
		case "dark": return {
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
</main></body></html>`
		};
		case "nav": return {
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
			previewHtml: buildPreviewHtml("Aurora", "Navigation that stays put", "Glassmorphic sticky header with mobile collapse and terracotta CTA.")
		};
		default: return {
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
				"CTA contrast AA"
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
			previewHtml: buildPreviewHtml("Aurora", "From prompt to polished UI in one breath", "G0 plans, G1 codes, G2 audits — approve changes with Human-in-the-Loop before they land.")
		};
	}
}
function buildTaskGraph(artifact) {
	const fileTasks = artifact.affectedFiles.map((file, i) => ({
		id: `g1-file-${i}`,
		title: `Generate ${file}`,
		agent: "G1_CODER",
		dependsOn: ["g0-plan"],
		status: "pending"
	}));
	return [
		{
			id: "g0-plan",
			title: "Decompose prompt into task graph",
			agent: "G0_PLANNER",
			dependsOn: [],
			status: "pending"
		},
		{
			id: "g0-components",
			title: "Map React component boundaries",
			agent: "G0_PLANNER",
			dependsOn: ["g0-plan"],
			status: "pending"
		},
		...fileTasks,
		{
			id: "g2-syntax",
			title: "Syntax & export validation",
			agent: "G2_AUDITOR",
			dependsOn: fileTasks.map((t) => t.id),
			status: "pending"
		},
		{
			id: "g2-owasp",
			title: "OWASP Top 10 static scan",
			agent: "G2_AUDITOR",
			dependsOn: ["g2-syntax"],
			status: "pending"
		},
		{
			id: "g2-tailwind",
			title: "Tailwind CSS compatibility",
			agent: "G2_AUDITOR",
			dependsOn: ["g2-owasp"],
			status: "pending"
		}
	];
}
function generateForIntent(intent, prompt) {
	const raw = generateRaw(intent, prompt);
	return {
		...raw,
		taskGraph: buildTaskGraph(raw)
	};
}
/** G2 Auditor — static analysis for syntax, OWASP, Tailwind heuristics */
function auditCode(code, language) {
	const issues = [];
	const lines = code.split("\n");
	const push = (rule, severity, message, line, autoFixable = false) => {
		issues.push({
			id: `${rule}-${issues.length}`,
			rule,
			severity,
			message,
			line,
			autoFixable
		});
	};
	const open = (code.match(/\{/g) || []).length;
	const close = (code.match(/\}/g) || []).length;
	if (open !== close) push("syntax-braces", "error", `Unbalanced braces ({ ${open} vs } ${close})`);
	if ((code.match(/\(/g) || []).length !== (code.match(/\)/g) || []).length) push("syntax-parens", "error", `Unbalanced parentheses`);
	if (language === "typescript" || language === "tsx" || language === "javascript") {
		if (!/export\s+default/.test(code) && !/module\.exports/.test(code)) push("export-default", "warn", "No default export found for React entry file");
	}
	lines.forEach((line, i) => {
		const n = i + 1;
		if (/\beval\s*\(/.test(line)) push("owasp-a03", "error", "eval() detected — code injection risk (A03 Injection)", n);
		if (/new\s+Function\s*\(/.test(line)) push("owasp-a03", "error", "new Function() detected — dynamic code execution", n);
		if (/dangerouslySetInnerHTML/.test(line)) push("owasp-a03", "error", "dangerouslySetInnerHTML without sanitizer — XSS risk", n);
		if (/\.innerHTML\s*=/.test(line)) push("owasp-a03", "error", "innerHTML assignment — XSS risk", n, true);
		if (/document\.write\s*\(/.test(line)) push("owasp-a03", "warn", "document.write is unsafe in modern apps", n);
		if (/localStorage\.setItem\([^,]+,\s*(password|token|secret)/i.test(line)) push("owasp-a02", "error", "Sensitive data written to localStorage (A02 Crypto)", n);
		if (/http:\/\/(?!localhost|127\.0\.0\.1)/.test(line)) push("owasp-a02", "warn", "Insecure HTTP URL — prefer HTTPS", n, true);
		if (/api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i.test(line)) push("owasp-a07", "error", "Hard-coded API key detected (A07 Auth Failures)", n);
	});
	const classMatches = code.matchAll(/className=\{?`([^`]+)`\}?|className="([^"]+)"/g);
	for (const m of classMatches) {
		const classes = (m[1] || m[2] || "").split(/\s+/);
		for (const c of classes) {
			if (!c) continue;
			if (/\[[^\]]*$/.test(c) || /^\[/.test(c) && !/\]$/.test(c) && c.includes("[")) {
				if (c.includes("[") && !c.includes("]")) push("tailwind-arbitrary", "error", `Unclosed Tailwind arbitrary value: ${c}`, void 0, true);
			}
			if (c === "flex-center" || c === "center-flex") push("tailwind-typo", "warn", `Non-standard utility "${c}" — use flex items-center justify-center`, void 0, true);
		}
	}
	if (/#(7c3aed|8b5cf6|a855f7|6366f1)\b/i.test(code)) push("design-tokens", "warn", "Purple accent detected — COSY Warm Brutalism prefers terracotta #D96B43", void 0, true);
	const errors = issues.filter((i) => i.severity === "error");
	const notes = [
		...issues.filter((i) => i.severity === "info" || i.severity === "warn").map((i) => `${i.severity.toUpperCase()}: ${i.message}`),
		errors.length === 0 ? "OWASP static scan: no critical issues" : `${errors.length} critical issue(s) found`,
		"Tailwind class scan complete",
		"Export / syntax structure checked"
	];
	return {
		passed: errors.length === 0,
		issues,
		notes,
		finalCode: code,
		healed: false
	};
}
/** Auto-heal common G2 findings via deterministic rewrites */
function autoHealCode(code, issues) {
	let next = code;
	const fixed = [];
	for (const issue of issues) {
		if (!issue.autoFixable) continue;
		if (issue.rule === "owasp-a03" && issue.message.includes("innerHTML")) {
			next = next.replace(/\.innerHTML\s*=\s*([^;]+);/g, ".textContent = $1;");
			fixed.push("Replaced innerHTML with textContent");
		}
		if (issue.rule === "owasp-a02" && issue.message.includes("HTTP")) {
			next = next.replace(/http:\/\/(?!localhost|127\.0\.0\.1)/g, "https://");
			fixed.push("Upgraded http:// to https://");
		}
		if (issue.rule === "design-tokens") {
			next = next.replace(/#7c3aed/gi, "#D96B43").replace(/#8b5cf6/gi, "#D96B43").replace(/#a855f7/gi, "#C85A32").replace(/#6366f1/gi, "#D96B43");
			fixed.push("Mapped purple accents to terracotta");
		}
		if (issue.rule === "tailwind-typo") {
			next = next.replace(/\bflex-center\b/g, "flex items-center justify-center");
			next = next.replace(/\bcenter-flex\b/g, "flex items-center justify-center");
			fixed.push("Normalized flex centering utilities");
		}
	}
	return {
		code: next,
		fixed
	};
}
function sleep(ms, signal) {
	return new Promise((resolve, reject) => {
		if (signal?.aborted) {
			reject(new DOMException("Pipeline aborted", "AbortError"));
			return;
		}
		const t = setTimeout(resolve, ms);
		const onAbort = () => {
			clearTimeout(t);
			reject(new DOMException("Pipeline aborted", "AbortError"));
		};
		signal?.addEventListener("abort", onAbort, { once: true });
	});
}
function throwIfAborted(signal) {
	if (signal?.aborted) throw new DOMException("Pipeline aborted", "AbortError");
}
async function streamText(full, onChunk, opts = {}) {
	const { chunkSize = 48, delayMs = 12, signal } = opts;
	let acc = "";
	for (let i = 0; i < full.length; i += chunkSize) {
		throwIfAborted(signal);
		acc += full.slice(i, i + chunkSize);
		onChunk(acc);
		await sleep(delayMs, signal);
	}
	onChunk(full);
}
function patchGraph(graph, id, status, detail) {
	return graph.map((n) => n.id === id ? {
		...n,
		status,
		detail
	} : n);
}
/**
* Multi-Agent Orchestrator
* G0 Planner → G1 Coder → G2 Auditor (+ auto-heal loop)
*/
var MultiAgentOrchestrator = class {
	options;
	signal;
	constructor(options) {
		this.options = options;
		this.signal = options?.signal;
	}
	async runPipeline(userPrompt, _originalCode, cb) {
		const signal = cb.signal ?? this.signal;
		const phases = [];
		const artifact = generateForIntent(detectIntent(userPrompt), userPrompt);
		let graph = artifact.taskGraph.map((n) => ({ ...n }));
		cb.onTaskGraph?.(graph);
		cb.onPhase?.("planning");
		cb.onProgress?.(5, "G0 Planner starting");
		const g0Start = Date.now();
		cb.onAgentUpdate({
			id: "g0",
			status: "in_progress",
			payload: "Decomposing prompt into architecture task graph…",
			startedAt: g0Start
		});
		cb.onChat("G0 Planner: breaking request into a task graph…", "G0_PLANNER");
		graph = patchGraph(graph, "g0-plan", "in_progress");
		cb.onTaskGraph?.(graph);
		await sleep(400, signal);
		await streamText(artifact.plan, (partial) => {
			cb.onAgentUpdate({
				id: "g0",
				payload: partial
			});
			cb.onProgress?.(5 + Math.min(20, Math.round(partial.length / Math.max(artifact.plan.length, 1) * 20)), "G0 planning");
		}, {
			chunkSize: 28,
			delayMs: 14,
			signal
		});
		graph = patchGraph(graph, "g0-plan", "completed", "Task graph ready");
		graph = patchGraph(graph, "g0-components", "in_progress");
		cb.onTaskGraph?.(graph);
		await sleep(350, signal);
		graph = patchGraph(graph, "g0-components", "completed", artifact.affectedFiles.join(", "));
		cb.onTaskGraph?.(graph);
		cb.onAgentUpdate({
			id: "g0",
			status: "completed",
			payload: artifact.plan,
			finishedAt: Date.now()
		});
		cb.onChat(artifact.plan, "G0_PLANNER");
		phases.push({
			agent: "G0_PLANNER",
			durationMs: Date.now() - g0Start
		});
		cb.onProgress?.(28, "Plan complete");
		cb.onPhase?.("coding");
		const g1Start = Date.now();
		cb.onAgentUpdate({
			id: "g1",
			status: "in_progress",
			payload: `Generating ${artifact.filePath}…`,
			startedAt: g1Start
		});
		cb.onChat(`G1 Coder: implementing ${artifact.affectedFiles.length} file(s) from plan…`, "G1_CODER");
		const fileNodes = graph.filter((n) => n.id.startsWith("g1-file-"));
		for (const node of fileNodes) {
			throwIfAborted(signal);
			graph = patchGraph(graph, node.id, "in_progress", node.title);
			cb.onTaskGraph?.(graph);
			await sleep(180, signal);
		}
		await streamText(artifact.code, (partial) => {
			cb.onStreamCode(partial);
			const pct = Math.min(100, Math.round(partial.length / Math.max(artifact.code.length, 1) * 100));
			cb.onAgentUpdate({
				id: "g1",
				payload: `Streaming ${artifact.filePath}… ${pct}%`
			});
			cb.onProgress?.(28 + Math.round(pct * .42), `G1 coding ${pct}%`);
		}, {
			chunkSize: 72,
			delayMs: 8,
			signal
		});
		for (const node of fileNodes) graph = patchGraph(graph, node.id, "completed", `${artifact.code.split("\n").length} lines`);
		cb.onTaskGraph?.(graph);
		cb.onAgentUpdate({
			id: "g1",
			status: "completed",
			payload: `Generated ${artifact.code.split("\n").length} lines → ${artifact.filePath}`,
			finishedAt: Date.now()
		});
		phases.push({
			agent: "G1_CODER",
			durationMs: Date.now() - g1Start
		});
		cb.onProgress?.(72, "Code generated");
		cb.onPhase?.("auditing");
		const g2Start = Date.now();
		cb.onAgentUpdate({
			id: "g2",
			status: "in_progress",
			payload: "Running syntax · OWASP · Tailwind audit…",
			startedAt: g2Start
		});
		cb.onChat("G2 Auditor: static analysis + security pass…", "G2_AUDITOR");
		for (const id of [
			"g2-syntax",
			"g2-owasp",
			"g2-tailwind"
		]) {
			throwIfAborted(signal);
			graph = patchGraph(graph, id, "in_progress");
			cb.onTaskGraph?.(graph);
			await sleep(280, signal);
			graph = patchGraph(graph, id, "completed");
			cb.onTaskGraph?.(graph);
			cb.onProgress?.(id === "g2-syntax" ? 78 : id === "g2-owasp" ? 86 : 92, `G2 ${id.replace("g2-", "")}`);
		}
		let code = artifact.code;
		let audit = auditCode(code, artifact.language);
		if (/inject|xss|heal|broken/i.test(userPrompt) && audit.passed) {
			code = artifact.code.replace(/return \(/, "const _demo = document.createElement(\"div\"); _demo.innerHTML = \"x\";\n  return (");
			audit = auditCode(code, artifact.language);
		}
		audit = {
			...audit,
			notes: [...artifact.auditNotes, ...audit.notes]
		};
		if (!audit.passed) {
			cb.onPhase?.("healing");
			cb.onAgentUpdate({
				id: "g2",
				payload: `Found ${audit.issues.filter((i) => i.severity === "error").length} issue(s) — auto-healing…`
			});
			cb.onChat(`G2: issues detected\n${audit.issues.map((i) => `• [${i.severity}] ${i.message}`).join("\n")}\nStarting auto-heal loop…`, "G2_AUDITOR");
			cb.onAgentUpdate({
				id: "g1",
				status: "in_progress",
				payload: "Auto-heal: fixing audit findings…"
			});
			await sleep(500, signal);
			const healed = autoHealCode(code, audit.issues);
			const reAudit = auditCode(healed.code, artifact.language);
			if (reAudit.passed || healed.fixed.length > 0) {
				code = reAudit.passed ? healed.code : artifact.code;
				audit = auditCode(code, artifact.language);
				audit.healed = true;
				audit.notes = [...healed.fixed.map((f) => `HEALED: ${f}`), ...audit.notes];
				cb.onStreamCode(code);
				cb.onChat(`G1 auto-heal applied:\n${(healed.fixed.length ? healed.fixed : ["Restored clean artifact"]).map((f) => `• ${f}`).join("\n")}`, "G1_CODER");
			} else {
				code = artifact.code;
				audit = auditCode(code, artifact.language);
				audit.healed = true;
				audit.notes = ["HEALED: reverted to clean G1 output", ...audit.notes];
				cb.onStreamCode(code);
			}
			cb.onAgentUpdate({
				id: "g1",
				status: "completed",
				payload: "Auto-heal complete"
			});
		}
		const reportLines = audit.notes.map((n) => `• ${n}`).join("\n");
		const statusLabel = audit.passed ? audit.healed ? "Passed after auto-heal" : "Passed" : "Failed";
		cb.onAgentUpdate({
			id: "g2",
			status: audit.passed ? "completed" : "failed",
			payload: `${statusLabel}\n${reportLines}`,
			finishedAt: Date.now()
		});
		cb.onChat(`G2 Auditor: ${statusLabel}\n${reportLines}`, "G2_AUDITOR");
		phases.push({
			agent: "G2_AUDITOR",
			durationMs: Date.now() - g2Start
		});
		cb.onStreamCode(code);
		cb.onProgress?.(100, "Pipeline complete");
		cb.onPhase?.(audit.passed ? "completed" : "failed");
		return {
			plan: artifact.plan,
			code,
			language: artifact.language,
			filePath: artifact.filePath,
			previewHtml: artifact.previewHtml,
			auditNotes: audit.notes,
			title: artifact.title,
			description: artifact.description,
			affectedFiles: artifact.affectedFiles,
			taskGraph: graph,
			audit,
			phases
		};
	}
};
async function runMultiAgentPipeline(userPrompt, originalCode, cb) {
	return new MultiAgentOrchestrator({ signal: cb.signal }).runPipeline(userPrompt, originalCode, cb);
}
/**
* Shared entry: run G0→G1→G2 against the live studio store.
* Used by AgentPanel, CommandPalette, and any other trigger.
*/
async function runStudioPipeline(prompt) {
	const trimmed = prompt.trim();
	if (!trimmed) return false;
	const store = useStudioStore.getState();
	if (store.isPipelineRunning) {
		toast.message("Pipeline already running");
		return false;
	}
	if (store.planTier === "FREE" && store.promptsUsed >= store.promptLimit) {
		toast.error("Free tier: 100 prompts/month used. Upgrade to Pro.");
		return false;
	}
	const started = Date.now();
	store.resetAgents();
	const signal = store.beginPipeline();
	store.incrementPrompts();
	store.addChat({
		role: "user",
		content: trimmed
	});
	useStudioStore.setState({ lastPrompt: trimmed });
	const original = store.files[store.activeFile]?.content ?? store.originalCode;
	try {
		const result = await runMultiAgentPipeline(trimmed, original, {
			signal,
			onAgentUpdate: (patch) => store.updateAgent(patch.id, patch),
			onStreamCode: (code) => store.streamModifiedCode(code),
			onChat: (content, agent) => store.addChat({
				role: "assistant",
				content,
				agent
			}),
			onPhase: (phase) => store.setPipelinePhase(phase),
			onTaskGraph: (nodes) => store.setTaskGraph(nodes),
			onProgress: (pct, label) => store.setPipelineProgress(pct, label)
		});
		if (store.files[result.filePath]) store.setActiveFile(result.filePath);
		const base = useStudioStore.getState().files[result.filePath]?.content ?? original;
		store.setDiff(base, result.code, result.language);
		store.setPipelineLatency(Date.now() - started);
		store.setPendingApproval({
			title: result.title,
			description: result.audit.healed ? `${result.description} (auto-healed by G2 loop)` : result.description,
			affectedFiles: result.affectedFiles,
			originalCode: base,
			modifiedCode: result.code,
			language: result.language,
			previewHtml: result.previewHtml
		});
		const timing = result.phases.map((p) => `${p.agent.replace("_", " ")} ${p.durationMs}ms`).join(" · ");
		toast.success("Pipeline complete — review the diff", { description: timing });
		return true;
	} catch (e) {
		if (e instanceof DOMException && e.name === "AbortError" || e instanceof Error && e.name === "AbortError") {
			store.setPipelinePhase("cancelled");
			toast.message("Pipeline cancelled");
			return false;
		}
		console.error(e);
		toast.error("Agent pipeline failed");
		store.updateAgent("g2", {
			status: "failed",
			payload: "Pipeline error"
		});
		store.setPipelinePhase("failed");
		return false;
	} finally {
		store.setPipelineRunning(false);
		useStudioStore.setState({ _abort: null });
	}
}
var icons = {
	G0_PLANNER: Brain,
	G1_CODER: CodeXml,
	G2_AUDITOR: ShieldCheck
};
var statusColor = {
	idle: "bg-muted-foreground/30",
	pending: "bg-muted-foreground/50",
	in_progress: "bg-terracotta agent-pulse",
	completed: "bg-success",
	failed: "bg-danger"
};
var phaseLabel = {
	idle: "Idle",
	planning: "G0 Planning",
	coding: "G1 Coding",
	auditing: "G2 Auditing",
	healing: "Auto-heal",
	completed: "Complete",
	failed: "Failed",
	cancelled: "Cancelled"
};
function AgentPipeline() {
	const agents = useStudioStore((s) => s.agents);
	const isPipelineRunning = useStudioStore((s) => s.isPipelineRunning);
	const pipelinePhase = useStudioStore((s) => s.pipelinePhase);
	const pipelineProgress = useStudioStore((s) => s.pipelineProgress);
	const pipelineProgressLabel = useStudioStore((s) => s.pipelineProgressLabel);
	const taskGraph = useStudioStore((s) => s.taskGraph);
	const cancelPipeline = useStudioStore((s) => s.cancelPipeline);
	const pipelineLatencyMs = useStudioStore((s) => s.pipelineLatencyMs);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-3 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-sm font-semibold",
					children: "Agent Pipeline"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5",
					children: isPipelineRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-terracotta",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), phaseLabel[pipelinePhase] ?? "Running"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "danger",
						className: "h-7 px-2 text-[10px]",
						onClick: cancelPipeline,
						"aria-label": "Cancel pipeline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-3 w-3" }), "Stop"]
					})] }) : pipelinePhase === "completed" && pipelineLatencyMs > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[10px] font-mono text-muted-foreground",
						children: [(pipelineLatencyMs / 1e3).toFixed(1), "s"]
					}) : null
				})]
			}),
			(isPipelineRunning || pipelineProgress > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex items-center justify-between text-[10px] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: pipelineProgressLabel || phaseLabel[pipelinePhase]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono tabular-nums",
						children: [Math.round(pipelineProgress), "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 overflow-hidden rounded-full bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-terracotta transition-all duration-300 ease-out",
						style: { width: `${Math.min(100, pipelineProgress)}%` }
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1 mb-3",
				children: agents.map((agent, i) => {
					const Icon = icons[agent.agent];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex w-full flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 transition-all", agent.status === "in_progress" && "border-terracotta/50 bg-terracotta/5", agent.status === "completed" && "border-success/30 bg-success-bg/50", agent.status === "idle" && "border-border bg-muted/40", agent.status === "failed" && "border-danger/40 bg-danger-bg"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-4 w-4", agent.status === "in_progress" ? "text-terracotta" : agent.status === "completed" ? "text-success" : "text-muted-foreground") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute -right-1 -top-1 h-2 w-2 rounded-full", statusColor[agent.status]) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold tracking-wide",
									children: agent.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[9px] font-mono text-muted-foreground capitalize",
									children: agent.status === "in_progress" ? "active" : agent.status
								})
							]
						}), i < agents.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("mx-0.5 h-0.5 w-3 shrink-0 rounded-full transition-colors", agents[i + 1].status !== "idle" || agent.status === "completed" ? "bg-terracotta" : "bg-border") })]
					}, agent.id);
				})
			}),
			taskGraph.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 rounded-xl border border-border bg-muted/30 p-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitBranch, { className: "h-3 w-3 text-terracotta" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Task Graph"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-auto text-[9px] font-mono text-muted-foreground",
							children: [
								taskGraph.filter((t) => t.status === "completed").length,
								"/",
								taskGraph.length
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1 max-h-28 overflow-auto cosy-scroll",
					children: taskGraph.map((node) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-2 text-[10px] leading-snug",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("mt-1 h-1.5 w-1.5 shrink-0 rounded-full", node.status === "completed" && "bg-success", node.status === "in_progress" && "bg-terracotta agent-pulse", node.status === "failed" && "bg-danger", node.status === "pending" && "bg-muted-foreground/30") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[9px] text-terracotta/80",
									children: node.agent.replace("_", "·")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-foreground/90",
									children: node.title
								})]
							}), node.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground truncate font-mono text-[9px]",
								children: node.detail
							})]
						})]
					}, node.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-28 overflow-auto cosy-scroll rounded-xl bg-muted/50 p-2.5",
				children: agents.map((agent) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 last:mb-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 mb-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: cn("h-1.5 w-1.5 fill-current", agent.status === "in_progress" ? "text-terracotta" : agent.status === "completed" ? "text-success" : "text-muted-foreground/40") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] font-mono font-semibold text-muted-foreground",
								children: agent.agent
							}),
							agent.startedAt && agent.finishedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-auto text-[9px] font-mono text-muted-foreground/70 tabular-nums",
								children: [agent.finishedAt - agent.startedAt, "ms"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "whitespace-pre-wrap break-words font-mono text-[10px] leading-relaxed text-foreground/80 pl-3",
						children: agent.payload
					})]
				}, agent.id))
			})
		]
	});
}
var SUGGESTIONS = [
	"Add a pricing section with Free, Pro, Enterprise",
	"Build a metrics dashboard",
	"Create a todo board with warm brutalism",
	"Switch the landing to dark slate mode",
	"Add a contact form with validation"
];
function AgentPanel() {
	const [input, setInput] = (0, import_react.useState)("");
	const chat = useStudioStore((s) => s.chat);
	const files = useStudioStore((s) => s.files);
	const activeFile = useStudioStore((s) => s.activeFile);
	const setActiveFile = useStudioStore((s) => s.setActiveFile);
	const isPipelineRunning = useStudioStore((s) => s.isPipelineRunning);
	const planTier = useStudioStore((s) => s.planTier);
	const promptsUsed = useStudioStore((s) => s.promptsUsed);
	const promptLimit = useStudioStore((s) => s.promptLimit);
	const scrollRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		scrollRef.current?.scrollTo({
			top: scrollRef.current.scrollHeight,
			behavior: "smooth"
		});
	}, [chat]);
	const run = async (prompt) => {
		if (!prompt.trim() || isPipelineRunning) return;
		setInput("");
		await runStudioPipeline(prompt);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentPipeline, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-3 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderTree, { className: "h-3.5 w-3.5 text-terracotta" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Project"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-0.5",
					children: Object.values(files).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveFile(f.path),
						className: cn("flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-mono transition-colors min-h-9", activeFile === f.path ? "bg-terracotta/10 text-terracotta" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCode2, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: f.path
						})]
					}, f.path))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-card shadow-sm overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-terracotta" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-serif text-sm font-semibold",
								children: "Prompt"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-mono text-muted-foreground",
							children: [
								planTier,
								" · ",
								promptsUsed,
								"/",
								planTier === "FREE" ? promptLimit : "∞"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: scrollRef,
						className: "min-h-0 flex-1 overflow-auto cosy-scroll p-3 space-y-2.5",
						children: chat.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("rounded-xl px-3 py-2 text-xs leading-relaxed", m.role === "user" && "bg-terracotta text-white ml-4", m.role === "assistant" && "bg-muted mr-2", m.role === "system" && "bg-muted/50 text-muted-foreground border border-dashed border-border"),
							children: [m.agent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1 block text-[9px] font-mono font-semibold opacity-70",
								children: m.agent
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "whitespace-pre-wrap break-words font-sans",
								children: m.content
							})]
						}, m.id))
					}),
					!isPipelineRunning && chat.length <= 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5 px-3 pb-2",
						children: SUGGESTIONS.slice(0, 3).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => run(s),
							className: "rounded-lg border border-border bg-muted/50 px-2 py-1 text-[10px] text-muted-foreground hover:border-terracotta/40 hover:text-foreground transition-colors text-left",
							children: s
						}, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex gap-2 border-t border-border p-2.5",
						onSubmit: (e) => {
							e.preventDefault();
							run(input);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: input,
							onChange: (e) => setInput(e.target.value),
							disabled: isPipelineRunning,
							placeholder: "Describe a UI change…",
							className: "min-h-11 flex-1 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta/30 disabled:opacity-50"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "icon",
							disabled: isPipelineRunning || !input.trim(),
							className: "h-11 w-11 shrink-0",
							"aria-label": "Send prompt",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
						})]
					})
				]
			})
		]
	});
}
loader.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs" } });
function FallbackDiff({ original, modified }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-full overflow-auto cosy-scroll font-mono text-[12.5px] leading-5 p-3",
		children: (0, import_react.useMemo)(() => {
			const o = original.split("\n");
			const m = modified.split("\n");
			const max = Math.max(o.length, m.length);
			const rows = [];
			for (let i = 0; i < max; i++) {
				const a = o[i];
				const b = m[i];
				if (a === b) rows.push({
					type: "same",
					text: b ?? a ?? "",
					n: i + 1
				});
				else {
					if (a !== void 0 && a !== b) rows.push({
						type: "del",
						text: a,
						n: i + 1
					});
					if (b !== void 0 && b !== a) rows.push({
						type: "add",
						text: b,
						n: i + 1
					});
				}
			}
			return rows;
		}, [original, modified]).map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex gap-3 px-2 rounded-sm", row.type === "add" && "diff-add", row.type === "del" && "diff-del"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-8 shrink-0 text-right opacity-40 select-none tabular-nums",
					children: row.n
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-5 shrink-0 opacity-60 select-none",
					children: row.type === "add" ? ">>" : row.type === "del" ? "<<" : "  "
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "flex-1 whitespace-pre-wrap break-all font-mono",
					children: row.text || " "
				})
			]
		}, `${row.n}-${i}-${row.type}`))
	});
}
function CodeDiffViewer() {
	const theme = useStudioStore((s) => s.theme);
	const originalCode = useStudioStore((s) => s.originalCode);
	const modifiedCode = useStudioStore((s) => s.modifiedCode);
	const language = useStudioStore((s) => s.language);
	const diffChunks = useStudioStore((s) => s.diffChunks);
	const acceptChunk = useStudioStore((s) => s.acceptChunk);
	const rejectChunk = useStudioStore((s) => s.rejectChunk);
	const acceptAllDiffs = useStudioStore((s) => s.acceptAllDiffs);
	const rejectAllDiffs = useStudioStore((s) => s.rejectAllDiffs);
	const isPipelineRunning = useStudioStore((s) => s.isPipelineRunning);
	const activeFile = useStudioStore((s) => s.activeFile);
	const [monacoReady, setMonacoReady] = (0, import_react.useState)(false);
	const [monacoFailed, setMonacoFailed] = (0, import_react.useState)(false);
	const editorRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		loader.init().then(() => {
			if (!cancelled) setMonacoReady(true);
		}).catch(() => {
			if (!cancelled) setMonacoFailed(true);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	const hasDiff = originalCode !== modifiedCode;
	const langLabel = language === "typescript" ? "TSX" : language === "css" ? "CSS" : language.toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-glass)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 border-b border-border bg-muted/80 px-4 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "h-4 w-4 text-terracotta shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-sm font-semibold truncate",
							children: "Code Diff"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-mono text-muted-foreground truncate hidden sm:inline",
							children: activeFile
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 shrink-0",
					children: [
						isPipelineRunning && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5 text-[11px] text-terracotta font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), "Streaming"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-background/80 px-2 py-0.5 text-[10px] font-mono text-muted-foreground border border-border",
							children: langLabel
						}),
						hasDiff && !isPipelineRunning && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "danger",
							onClick: rejectAllDiffs,
							className: "h-7 text-[11px]",
							children: "Reject all"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: acceptAllDiffs,
							className: "h-7 text-[11px]",
							children: "Accept all"
						})] })
					]
				})]
			}),
			hasDiff && diffChunks.length > 0 && !isPipelineRunning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5 border-b border-border bg-muted/40 px-3 py-2",
				children: diffChunks.map((chunk) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-mono", chunk.accepted === true && "border-success/40 bg-success-bg text-success", chunk.accepted === false && "border-danger/40 bg-danger-bg text-danger", chunk.accepted === null && "border-border bg-background text-muted-foreground"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"L",
							chunk.startLine,
							chunk.endLine !== chunk.startLine ? `–${chunk.endLine}` : ""
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Accept chunk",
							className: "rounded p-0.5 hover:bg-success-bg text-success",
							onClick: () => acceptChunk(chunk.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Reject chunk",
							className: "rounded p-0.5 hover:bg-danger-bg text-danger",
							onClick: () => rejectChunk(chunk.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
						})
					]
				}, chunk.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("relative min-h-0 flex-1", isPipelineRunning && "stream-caret"),
				children: monacoFailed || !monacoReady && typeof window === "undefined" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackDiff, {
					original: originalCode,
					modified: modifiedCode
				}) : monacoReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(we, {
					height: "100%",
					language: language === "typescript" ? "typescript" : language,
					original: originalCode,
					modified: modifiedCode,
					theme: theme === "dark" ? "vs-dark" : "light",
					loading: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-full items-center justify-center text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Loading editor…"]
					}),
					onMount: (editor) => {
						editorRef.current = editor;
					},
					options: {
						readOnly: true,
						renderSideBySide: false,
						minimap: { enabled: false },
						fontSize: 13,
						fontFamily: "Fira Code, ui-monospace, monospace",
						scrollBeyondLastLine: false,
						smoothScrolling: true,
						useInlineViewWhenSpaceIsLimited: true,
						renderIndicators: true,
						originalEditable: false,
						automaticLayout: true,
						padding: {
							top: 12,
							bottom: 12
						},
						lineNumbers: "on",
						glyphMargin: false,
						folding: false,
						wordWrap: "on"
					}
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackDiff, {
					original: originalCode,
					modified: modifiedCode
				})
			})
		]
	});
}
var devices = [
	{
		id: "mobile",
		icon: Smartphone,
		label: "iPhone",
		w: "w-[min(375px,100%)]",
		h: "h-[min(667px,100%)]"
	},
	{
		id: "tablet",
		icon: Tablet,
		label: "iPad",
		w: "w-[min(768px,100%)]",
		h: "h-[min(500px,100%)]"
	},
	{
		id: "desktop",
		icon: Monitor,
		label: "Desktop",
		w: "w-full",
		h: "h-full"
	}
];
function LivePreview() {
	const device = useStudioStore((s) => s.device);
	const setDevice = useStudioStore((s) => s.setDevice);
	const previewHtml = useStudioStore((s) => s.previewHtml);
	const previewKey = useStudioStore((s) => s.previewKey);
	const refreshPreview = useStudioStore((s) => s.refreshPreview);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const [inspectMode, setInspectMode] = (0, import_react.useState)(false);
	const [selectedLabel, setSelectedLabel] = (0, import_react.useState)(null);
	const iframeRef = (0, import_react.useRef)(null);
	const handleRefresh = (0, import_react.useCallback)(() => {
		setIsRefreshing(true);
		refreshPreview();
		setTimeout(() => setIsRefreshing(false), 400);
	}, [refreshPreview]);
	const onIframeLoad = (0, import_react.useCallback)(() => {
		const iframe = iframeRef.current;
		if (!iframe?.contentDocument) return;
		const doc = iframe.contentDocument;
		const handler = (e) => {
			if (!useStudioStore.getState().device) return;
			if (!iframe.dataset.inspect) return;
			e.preventDefault();
			e.stopPropagation();
			const t = e.target;
			const tag = t.tagName.toLowerCase();
			const cls = typeof t.className === "string" ? t.className.split(" ")[0] : "";
			const label = cls ? `${tag}.${cls}` : tag;
			setSelectedLabel(label);
			doc.querySelectorAll("[data-cosy-inspect]").forEach((el) => {
				el.style.outline = "";
				el.removeAttribute("data-cosy-inspect");
			});
			t.style.outline = "2px solid #D96B43";
			t.style.outlineOffset = "2px";
			t.setAttribute("data-cosy-inspect", "1");
		};
		doc.addEventListener("click", handler, true);
	}, []);
	const toggleInspect = () => {
		setInspectMode((v) => {
			const next = !v;
			if (iframeRef.current) if (next) iframeRef.current.dataset.inspect = "1";
			else {
				delete iframeRef.current.dataset.inspect;
				setSelectedLabel(null);
			}
			return next;
		});
	};
	const current = devices.find((d) => d.id === device) ?? devices[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-glass)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 border-b border-border bg-muted/80 px-3 py-2.5 sm:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-serif text-sm font-semibold shrink-0",
					children: "Live Preview"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 rounded-xl bg-background/70 p-1 border border-border",
					children: [
						devices.map(({ id, icon: Icon, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: label,
							onClick: () => setDevice(id),
							className: cn("rounded-lg p-1.5 transition-all", device === id ? "bg-terracotta text-white shadow-sm" : "text-muted-foreground hover:text-foreground"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						}, id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-0.5 h-4 w-px bg-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: "Visual element selector",
							onClick: toggleInspect,
							className: cn("rounded-lg p-1.5 transition-all", inspectMode ? "bg-terracotta text-white" : "text-muted-foreground hover:text-foreground"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MousePointer2, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							title: "Refresh",
							onClick: handleRefresh,
							className: "rounded-lg p-1.5 text-muted-foreground hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: cn("h-4 w-4", isRefreshing && "animate-spin") })
						})
					]
				})]
			}),
			selectedLabel && inspectMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border bg-terracotta/10 px-3 py-1.5 text-[11px] font-mono text-terracotta",
				children: ["Selected: ", selectedLabel]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex min-h-0 flex-1 items-center justify-center overflow-auto bg-dots-pattern p-3 sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("transition-all duration-300 ease-out bg-white dark:bg-black overflow-hidden shadow-[var(--shadow-elevated)]", device === "desktop" ? "h-full w-full rounded-xl border border-border" : cn("rounded-[28px] border-[5px] border-charcoal/20 dark:border-zinc-600", current.w, current.h)),
					style: device === "mobile" ? {
						maxHeight: "100%",
						aspectRatio: "375/667"
					} : device === "tablet" ? {
						maxHeight: "100%",
						aspectRatio: "768/500"
					} : void 0,
					children: [device !== "desktop" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center py-1.5 bg-charcoal/5 dark:bg-white/5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 w-16 rounded-full bg-charcoal/20 dark:bg-white/20" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						ref: iframeRef,
						title: "COSY Live Preview",
						srcDoc: previewHtml,
						onLoad: onIframeLoad,
						sandbox: "allow-scripts allow-same-origin allow-forms",
						className: cn("w-full border-0 bg-white", device === "desktop" ? "h-full" : "h-[calc(100%-14px)]")
					}, previewKey)]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 rounded-lg border border-border bg-card/90 px-2 py-1 text-[10px] font-mono text-muted-foreground backdrop-blur-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-3 w-3" }), device === "mobile" ? "375×667" : device === "tablet" ? "768×500" : "1920×1080"]
				})]
			})
		]
	});
}
function HitLApprovalCard() {
	const pending = useStudioStore((s) => s.pendingApproval);
	const approvePending = useStudioStore((s) => s.approvePending);
	const rejectPending = useStudioStore((s) => s.rejectPending);
	const isRunning = useStudioStore((s) => s.isPipelineRunning);
	(0, import_react.useEffect)(() => {
		if (!pending || isRunning) return;
		const handleKeyDown = (e) => {
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;
			if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
				e.preventDefault();
				approvePending();
			}
			if (e.key === "Escape") {
				e.preventDefault();
				rejectPending();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		pending,
		isRunning,
		approvePending,
		rejectPending
	]);
	if (!pending || isRunning) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-charcoal/30 backdrop-blur-md p-4 animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "hitl-title",
			className: "w-full max-w-lg rounded-2xl border border-white/20 bg-cream/90 dark:bg-slate-card/90 p-6 shadow-2xl backdrop-blur-xl border-l-8 border-l-terracotta",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl bg-terracotta/10 p-2.5 text-terracotta",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "h-6 w-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						id: "hitl-title",
						className: "font-serif text-xl font-bold text-charcoal dark:text-zinc-100",
						children: pending.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-charcoal/60 dark:text-zinc-400",
						children: "Human-in-the-Loop Review"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-charcoal/80 dark:text-zinc-300 mb-4 leading-relaxed",
					children: pending.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 rounded-xl bg-charcoal/5 dark:bg-black/40 p-3 border border-charcoal/10 dark:border-white/5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-semibold uppercase tracking-wider text-charcoal/70 dark:text-zinc-400 block mb-2",
						children: "Modified files"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: pending.affectedFiles.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs font-mono text-terracotta",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCode2, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: file })]
						}, file))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "danger",
						onClick: rejectPending,
						className: "min-h-11",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), "Reject (Esc)"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: approvePending,
						className: "min-h-11",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), "Approve (Enter)"]
					})]
				})
			]
		})
	});
}
var options = [
	{
		reason: "SYNTAX_ERROR",
		label: "Broken / non-functional code",
		icon: Bug
	},
	{
		reason: "BAD_STYLING",
		label: "Bad UI styling",
		icon: Paintbrush
	},
	{
		reason: "WRONG_LOGIC",
		label: "Didn't follow the prompt",
		icon: MessageSquareOff
	}
];
function RejectionPoll() {
	const show = useStudioStore((s) => s.showRejectionPoll);
	const submitRejection = useStudioStore((s) => s.submitRejection);
	const dismissRejectionPoll = useStudioStore((s) => s.dismissRejectionPoll);
	if (!show) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-charcoal/25 backdrop-blur-sm p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-elevated)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between mb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg font-bold",
						children: "Quick feedback"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: "Optional — helps fine-tune agent prompts"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: dismissRejectionPoll,
						className: "rounded-lg p-1.5 text-muted-foreground hover:bg-muted",
						"aria-label": "Dismiss",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: options.map(({ reason, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => submitRejection(reason),
						className: "flex w-full items-center gap-3 rounded-xl border border-border bg-muted/40 px-3 py-3 text-left text-sm hover:border-terracotta/40 hover:bg-terracotta/5 transition-colors min-h-11",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-terracotta shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
					}, reason))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					className: "mt-3 w-full",
					onClick: () => submitRejection("OTHER"),
					children: "Skip / other"
				})
			]
		})
	});
}
function CommandPalette() {
	const open = useStudioStore((s) => s.commandOpen);
	const setCommandOpen = useStudioStore((s) => s.setCommandOpen);
	const toggleTheme = useStudioStore((s) => s.toggleTheme);
	const theme = useStudioStore((s) => s.theme);
	const files = useStudioStore((s) => s.files);
	const setActiveFile = useStudioStore((s) => s.setActiveFile);
	const refreshPreview = useStudioStore((s) => s.refreshPreview);
	const setPublishUrl = useStudioStore((s) => s.setPublishUrl);
	const setPlanTier = useStudioStore((s) => s.setPlanTier);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setCommandOpen(!useStudioStore.getState().commandOpen);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [setCommandOpen]);
	const fileEntries = (0, import_react.useMemo)(() => Object.values(files), [files]);
	const runQuick = async (prompt) => {
		setCommandOpen(false);
		await runStudioPipeline(prompt);
	};
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[70] flex items-start justify-center bg-charcoal/40 backdrop-blur-sm pt-[12vh] px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e, {
			className: "w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevated)]",
			label: "Command palette",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center border-b border-border px-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-terracotta mr-2 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
						placeholder: "Search commands, files, agents…",
						className: "h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground",
						autoFocus: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
						className: "hidden sm:inline text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5",
						children: "ESC"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.List, {
				className: "max-h-80 overflow-auto cosy-scroll p-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
						className: "py-8 text-center text-sm text-muted-foreground",
						children: "No results."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Group, {
						heading: "Actions",
						className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
								icon: ShieldCheck,
								label: "Run full agent audit",
								onSelect: () => runQuick("Audit the current UI for OWASP and Tailwind issues, then improve the hero")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
								icon: LayoutDashboard,
								label: "Generate pricing section",
								onSelect: () => runQuick("Add a pricing section with Free Pro and Enterprise tiers")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
								icon: RefreshCw,
								label: "Refresh live preview",
								onSelect: () => {
									refreshPreview();
									setCommandOpen(false);
									toast.success("Preview refreshed");
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
								icon: Upload,
								label: "Publish to cosy.studio",
								onSelect: () => {
									const url = `${`app-${Math.random().toString(36).slice(2, 7)}`}.cosy.studio`;
									setPublishUrl(url);
									setCommandOpen(false);
									toast.success(`Published: ${url}`);
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
								icon: theme === "dark" ? Sun : Moon,
								label: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
								onSelect: () => {
									toggleTheme();
									setCommandOpen(false);
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
								icon: CreditCard,
								label: "Upgrade to Pro",
								onSelect: () => {
									setPlanTier("PRO");
									setCommandOpen(false);
									navigate({ to: "/pricing" });
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
								icon: Smartphone,
								label: "Open mobile companion",
								onSelect: () => {
									setCommandOpen(false);
									navigate({ to: "/mobile" });
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
								icon: Rocket,
								label: "Open showcase gallery",
								onSelect: () => {
									setCommandOpen(false);
									navigate({ to: "/showcase" });
								}
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
						heading: "Files",
						className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1.5 mt-1",
						children: fileEntries.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
							icon: FileCode2,
							label: f.path,
							onSelect: () => {
								setActiveFile(f.path);
								setCommandOpen(false);
							}
						}, f.path))
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 -z-10 cursor-default",
			"aria-label": "Close command palette",
			onClick: () => setCommandOpen(false)
		})]
	});
}
function Item({ icon: Icon, label, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
		value: label,
		onSelect,
		className: "flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm aria-selected:bg-terracotta/10 aria-selected:text-foreground data-[selected=true]:bg-terracotta/10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-terracotta shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
	});
}
function useIsDesktop() {
	const [isDesktop, setIsDesktop] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(min-width: 1024px)");
		const update = () => setIsDesktop(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);
	return isDesktop;
}
function StudioShell() {
	const theme = useStudioStore((s) => s.theme);
	const mobilePanel = useStudioStore((s) => s.mobilePanel);
	const setMobilePanel = useStudioStore((s) => s.setMobilePanel);
	const isDesktop = useIsDesktop();
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col overflow-hidden bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {}),
			isDesktop ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-0 flex-1 p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Xt, {
					orientation: "horizontal",
					className: "min-h-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zt, {
							defaultSize: 24,
							minSize: 18,
							maxSize: 34,
							className: "min-h-0 pr-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentPanel, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(tn, { className: "w-1.5 rounded-full bg-transparent hover:bg-terracotta/30 transition-colors" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zt, {
							defaultSize: 42,
							minSize: 28,
							className: "min-h-0 px-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeDiffViewer, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(tn, { className: "w-1.5 rounded-full bg-transparent hover:bg-terracotta/30 transition-colors" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zt, {
							defaultSize: 34,
							minSize: 22,
							className: "min-h-0 pl-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LivePreview, {})
						})
					]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 flex-col p-2 sm:p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1",
					children: [
						mobilePanel === "chat" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentPanel, {}),
						mobilePanel === "studio" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeDiffViewer, {}),
						mobilePanel === "preview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LivePreview, {})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mt-2 flex shrink-0 items-center justify-around rounded-2xl border border-border bg-card p-1.5 shadow-sm",
					children: [
						{
							id: "chat",
							icon: MessageSquare,
							label: "Agents"
						},
						{
							id: "studio",
							icon: CodeXml,
							label: "Diff"
						},
						{
							id: "preview",
							icon: Eye,
							label: "Preview"
						}
					].map(({ id, icon: Icon, label }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setMobilePanel(id),
						className: cn("flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-medium transition-colors min-h-11", mobilePanel === id ? "bg-terracotta text-white" : "text-muted-foreground hover:text-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), label]
					}, id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HitLApprovalCard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RejectionPoll, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, {})
		]
	});
}
function StudioPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioShell, {});
}
//#endregion
export { StudioPage as component };
