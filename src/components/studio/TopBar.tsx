import { Link, useNavigate } from "@tanstack/react-router";
import { Command, Sun, Circle, FlaskConical, LayoutGrid } from "lucide-react";
import { useStudioStore } from "@/stores/studio-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductionLaunchButton } from "./ProductionLaunch";
import {
  IconOpenWindow,
  StudioChromeIcons,
} from "@/components/icons/studio-icons";
import { CozyLogo } from "@/components/brand/CozyLogo";
import { UserButton, SignedIn, SignedOut } from "@/lib/auth/gates";
import { authEnabled } from "@/lib/auth/client";

export function TopBar() {
  const theme = useStudioStore((s) => s.theme);
  const toggleTheme = useStudioStore((s) => s.toggleTheme);
  const setCommandOpen = useStudioStore((s) => s.setCommandOpen);
  const setMobilePanel = useStudioStore((s) => s.setMobilePanel);
  const planTier = useStudioStore((s) => s.planTier);
  const isPipelineRunning = useStudioStore((s) => s.isPipelineRunning);
  const productionLive = useStudioStore((s) => s.productionLive);
  const productionLaunchRunning = useStudioStore((s) => s.productionLaunchRunning);
  const navigate = useNavigate();

  const openAgentsWindow = () => {
    setMobilePanel("chat");
    void navigate({ to: "/studio" });
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLTextAreaElement>(
        'textarea[aria-label="Prompt"]',
      );
      el?.focus();
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-card/80 px-3 sm:px-4 backdrop-blur-md">
      <div className="flex items-center gap-3 min-w-0">
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <CozyLogo size="sm" variant="seal" className="group-hover:-translate-y-px transition-transform" />
          <div className="hidden sm:block min-w-0">
            <div className="font-serif text-base font-bold leading-none truncate">
              CAI
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-0.5">
              Cozy AI Studio
            </div>
          </div>
        </Link>

        <div
          className={cn(
            "hidden md:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border",
            productionLaunchRunning || isPipelineRunning
              ? "border-agents-blue/40 bg-agents-blue/10 text-agents-blue"
              : productionLive
                ? "border-success/40 bg-success/10 text-success"
                : "border-border bg-muted text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              productionLaunchRunning || isPipelineRunning
                ? "bg-agents-blue agent-pulse"
                : "bg-success",
            )}
          />
          {productionLaunchRunning
            ? "Launching prod…"
            : productionLive
              ? "Production"
              : isPipelineRunning
                ? "Agents running"
                : "Ready"}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="hidden lg:flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 h-9 text-xs text-muted-foreground hover:text-foreground hover:border-agents-blue/40 transition-colors min-w-[120px]"
        >
          <Command className="h-3.5 w-3.5" />
          <span>Search…</span>
          <kbd className="ml-auto font-mono text-xs opacity-60">⌘K</kbd>
        </button>

        <StudioChromeIcons
          className="hidden sm:inline-flex"
          onBilling={() => void navigate({ to: "/pricing", search: {} })}
          onChat={openAgentsWindow}
          onSettings={toggleTheme}
        />

        <Button
          size="sm"
          className="h-9 gap-1.5 rounded-full px-3.5 text-xs font-semibold shadow-none"
          onClick={openAgentsWindow}
        >
          Agents Window
          <IconOpenWindow className="opacity-90" />
        </Button>

        <Link to="/playground" className="hidden md:block">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label="Lab playground"
            title="Lab"
          >
            <FlaskConical className="h-4 w-4 text-success" />
          </Button>
        </Link>
        <Link to="/showcase" className="hidden sm:block">
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Showcase">
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 sm:hidden"
          onClick={() => setCommandOpen(true)}
          aria-label="Command palette"
        >
          <Command className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden sm:inline-flex h-9 w-9"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to cream theme" : "Switch to silver theme"}
          title={theme === "dark" ? "Cream theme" : "Silver theme"}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Circle className="h-4 w-4 fill-muted-foreground/30" />
          )}
        </Button>

        <span className="hidden xl:inline text-xs text-muted-foreground font-mono">
          {planTier}
        </span>

        <ProductionLaunchButton />

        {authEnabled && (
          <div className="hidden sm:flex items-center shrink-0 ml-1">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Link
                to="/login"
                search={{ redirect: "/studio" }}
                className="text-xs font-medium px-3 h-9 inline-flex items-center rounded-xl border border-border hover:border-choco/40 hover:text-choco transition-colors"
              >
                Sign in
              </Link>
            </SignedOut>
          </div>
        )}
      </div>
    </header>
  );
}
