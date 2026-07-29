import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn, t as Button } from "./button-CP-_CggN.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { P as Check, z as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as useStudioStore } from "./studio-store-COsw9EQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pricing-Bu47zkji.js
var import_jsx_runtime = require_jsx_runtime();
var tiers = [
	{
		id: "FREE",
		name: "Free",
		price: "$0",
		blurb: "Explore the studio",
		features: [
			"100 AI prompts / month",
			"G0 Planner only",
			"Community showcase",
			"Mobile companion"
		]
	},
	{
		id: "PRO",
		name: "Pro",
		price: "$29",
		blurb: "For serious builders",
		features: [
			"Unlimited prompts (fair use)",
			"Full G0 → G1 → G2 pipeline",
			"Claude / GPT-4o class models",
			"Live multi-device preview",
			"1-click publish"
		],
		highlight: true
	},
	{
		id: "ENTERPRISE",
		name: "Enterprise",
		price: "$49",
		blurb: "Per seat / month",
		features: [
			"Everything in Pro",
			"Priority GPU queue",
			"Team real-time CRDTs",
			"SSO & audit logs",
			"Custom fine-tunes"
		]
	}
];
function PricingPage() {
	const planTier = useStudioStore((s) => s.planTier);
	const setPlanTier = useStudioStore((s) => s.setPlanTier);
	const select = (tier) => {
		setPlanTier(tier);
		toast.success(`Plan set to ${tier}`, { description: tier === "FREE" ? "Stripe checkout skipped in demo mode" : "Demo: subscription activated without Stripe charge" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-4 sm:px-6 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold tracking-widest text-terracotta uppercase mb-2",
					children: "Monetization"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-4xl font-bold mb-2",
					children: "Simple plans. Honest compute."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted-foreground mb-10 max-w-lg",
					children: [
						"Current plan:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground font-mono",
							children: planTier
						}),
						". Stripe webhooks are simulated for this demo."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-5 md:grid-cols-3",
					children: tiers.map((tier) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: cn("flex flex-col rounded-2xl border bg-card p-6", tier.highlight ? "border-terracotta border-2 shadow-[var(--shadow-brutalist)]" : "border-border shadow-sm"),
						children: [
							tier.highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-3 inline-block w-fit rounded-full bg-terracotta/15 px-2.5 py-0.5 text-xs font-semibold text-terracotta",
								children: "Recommended"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-xl font-bold",
								children: tier.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mt-1",
								children: tier.blurb
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-serif text-4xl font-bold",
									children: tier.price
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted-foreground",
									children: " / mo"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2.5 text-sm mb-8 flex-1",
								children: tier.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-terracotta shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f })]
								}, f))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: tier.highlight ? "default" : "outline",
								className: "w-full",
								onClick: () => select(tier.id),
								disabled: planTier === tier.id,
								children: planTier === tier.id ? "Current plan" : `Choose ${tier.name}`
							})
						]
					}, tier.id))
				})
			]
		})
	});
}
//#endregion
export { PricingPage as component };
