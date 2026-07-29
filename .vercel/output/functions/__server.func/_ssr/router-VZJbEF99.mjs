import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, m as createRootRoute, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-VZJbEF99.js
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-C8PFWsTG.css";
var Route$5 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "COSY Studio — AI Visual IDE" },
			{
				name: "description",
				content: "Warm Brutalism AI IDE with multi-agent pipeline, live preview, and Human-in-the-Loop approvals."
			},
			{
				name: "theme-color",
				content: "#D96B43"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap"
		}]
	}),
	component: RootComponent
});
function RootComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RootDocument, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		position: "bottom-right",
		toastOptions: {
			className: "font-sans text-sm",
			style: {
				background: "var(--color-card)",
				color: "var(--color-foreground)",
				border: "1px solid var(--color-border)"
			}
		}
	})] });
}
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
var $$splitComponentImporter$4 = () => import("./routes-B1rn0gmG.mjs");
var Route$4 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./mobile-DmNUJemj.mjs");
var Route$3 = createFileRoute("/mobile")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [{ title: "Mobile Companion — COSY" }] })
});
var $$splitComponentImporter$2 = () => import("./pricing-Bu47zkji.mjs");
var Route$2 = createFileRoute("/pricing")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [{ title: "Pricing — COSY Studio" }] })
});
var $$splitComponentImporter$1 = () => import("./showcase-Bp7ROgiu.mjs");
var Route$1 = createFileRoute("/showcase")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [{ title: "Showcase — COSY Studio" }] })
});
var $$splitComponentImporter = () => import("./studio-3cl9VowL.mjs");
var Route = createFileRoute("/studio")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "Studio — COSY" }] }),
	ssr: false
});
var rootRouteChildren = {
	IndexRoute: Route$4.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$5
	}),
	MobileRoute: Route$3.update({
		id: "/mobile",
		path: "/mobile",
		getParentRoute: () => Route$5
	}),
	PricingRoute: Route$2.update({
		id: "/pricing",
		path: "/pricing",
		getParentRoute: () => Route$5
	}),
	ShowcaseRoute: Route$1.update({
		id: "/showcase",
		path: "/showcase",
		getParentRoute: () => Route$5
	}),
	StudioRoute: Route.update({
		id: "/studio",
		path: "/studio",
		getParentRoute: () => Route$5
	})
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent"
	});
}
//#endregion
export { getRouter };
