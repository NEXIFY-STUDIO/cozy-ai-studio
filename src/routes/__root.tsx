import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import appCss from "@/styles.css?url";

/** Inline: silver (dark) default before React hydrates; respect saved theme. */
const THEME_BOOT = `(function(){try{var k="cozy-ai-studio-v1";var raw=localStorage.getItem(k);var t="dark";if(raw){var p=JSON.parse(raw);var s=p&&(p.state||p);if(s&&s.theme==="light")t="light";}var d=document.documentElement;if(t==="dark")d.classList.add("dark");else d.classList.remove("dark");}catch(e){document.documentElement.classList.add("dark");}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      {
        title: "Cozy AI Studio — Brief → preview → share",
      },
      {
        name: "description",
        content:
          "Speed Studio: brief to live preview with multi-agent pipeline, HitL approvals, and free daily caps. No fake Kernel or Figma product claims.",
      },
      { name: "application-name", content: "Cozy AI Studio" },
      { name: "apple-mobile-web-app-title", content: "Cozy Studio" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "mobile-web-app-capable", content: "yes" },
      // Silver gunmetal default
      { name: "theme-color", content: "#3a3e46" },
      { name: "msapplication-TileColor", content: "#3a3e46" },
      { name: "msapplication-TileImage", content: "/android-chrome-192x192.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap",
        crossOrigin: "anonymous",
      },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48x48.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        href: "/android-chrome-512x512.png",
      },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "mask-icon", href: "/favicon-32x32.png", color: "#7090b5" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "font-sans text-sm",
          style: {
            background: "var(--color-card)",
            color: "var(--color-foreground)",
            border: "1px solid var(--color-border)",
          },
        }}
      />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="sk" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
