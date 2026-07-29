import { r as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/monaco-editor__react+react.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as cn, t as Button } from "./button-CP-_CggN.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { L as Bell, P as Check, t as X, z as ArrowLeft } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mobile-DmNUJemj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var initial = [
	{
		id: "1",
		title: "Pricing section with 3 tiers",
		files: ["src/App.tsx"],
		summary: "G2 audit passed. Terracotta CTAs + brutalist shadows ready for review."
	},
	{
		id: "2",
		title: "Sticky glass navigation",
		files: ["src/App.tsx", "src/styles.css"],
		summary: "Mobile menu affordance + sticky blur header."
	},
	{
		id: "3",
		title: "Contact form shell",
		files: ["src/App.tsx"],
		summary: "Client validation + success state. No OWASP issues."
	}
];
function MobileCompanionPage() {
	const [cards, setCards] = (0, import_react.useState)(initial);
	const [dragX, setDragX] = (0, import_react.useState)(0);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const [startX, setStartX] = (0, import_react.useState)(0);
	const top = cards[0];
	const decide = (approved) => {
		if (!top) return;
		setCards((c) => c.slice(1));
		setDragX(0);
		toast.success(approved ? `Approved: ${top.title}` : `Rejected: ${top.title}`, { description: "Desktop studio will sync via realtime gateway (demo)" });
	};
	const onPointerDown = (e) => {
		setDragging(true);
		setStartX(e.clientX);
	};
	const onPointerMove = (e) => {
		if (!dragging) return;
		setDragX(e.clientX - startX);
	};
	const onPointerUp = () => {
		setDragging(false);
		if (dragX > 100) decide(true);
		else if (dragX < -100) decide(false);
		else setDragX(0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between border-b border-border px-4 h-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/studio",
					className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Studio"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-serif font-bold text-sm",
					children: "Remote Review"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "relative p-2 text-muted-foreground",
					"aria-label": "Notifications",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), cards.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1 right-1 h-2 w-2 rounded-full bg-terracotta" })]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mb-4 text-center",
				children: "Swipe right to approve · left to reject"
			}), top ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full touch-none select-none",
				onPointerDown,
				onPointerMove,
				onPointerUp,
				onPointerLeave: onPointerUp,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("rounded-2xl border-l-8 border-l-terracotta border border-border bg-card p-6 shadow-[var(--shadow-elevated)] transition-transform", !dragging && "duration-200"),
					style: { transform: `translateX(${dragX}px) rotate(${dragX * .04}deg)` },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] font-semibold uppercase tracking-wider text-terracotta mb-2",
							children: [
								"Pending review · ",
								cards.length,
								" left"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl font-bold mb-2",
							children: top.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mb-4 leading-relaxed",
							children: top.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-muted/60 p-3 mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] font-semibold text-muted-foreground mb-1.5",
								children: "FILES"
							}), top.files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-terracotta",
								children: f
							}, f))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "danger",
								className: "flex-1 min-h-12",
								onClick: () => decide(false),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), "Reject"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "flex-1 min-h-12",
								onClick: () => decide(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), "Approve"]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between mt-3 px-2 text-xs font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("text-danger", dragX < -40 ? "opacity-100" : "opacity-30"),
						children: "← Reject"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("text-success", dragX > 40 ? "opacity-100" : "opacity-30"),
						children: "Approve →"
					})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-2xl font-bold mb-2",
						children: "Inbox clear"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mb-6",
						children: "No pending agent decisions. Push notifications will arrive via FCM when desktop finishes a run."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/studio",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Back to studio" })
					})
				]
			})]
		})]
	});
}
//#endregion
export { MobileCompanionPage as component };
