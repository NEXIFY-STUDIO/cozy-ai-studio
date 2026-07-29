import { Link } from "@tanstack/react-router";
import {
  Command,
  Sun,
  Smartphone,
  CreditCard,
  LayoutGrid,
  Home,
  Circle,
  FlaskConical,
} from "lucide-react";
import { useStudioStore } from "@/stores/studio-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProductionLaunchButton } from "./ProductionLaunch";

export function TopBar() {
  const theme = useStudioStore((s) => s.theme);
  const toggleTheme = useStudioStore((s) => s.toggleTheme);
  const setCommandOpen = useStudioStore((s) => s.setCommandOpen);
  const planTier = useStudioStore((s) => s.planTier);
  const isPipelineRunning = useStudioStore((s) => s.isPipelineRunning);
  const productionLive = useStudioStore((s) => s.productionLive);
  const productionLaunchRunning = useStudioStore((s) => s.productionLaunchRunning);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-card/80 px-3 sm:px-4 backdrop-blur-md">
      <div className="flex items-center gap-3 min-w-0">
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-terracotta text-white font-serif font-bold text-sm shadow-[var(--shadow-brutalist-sm)] group-hover:-translate-y-px transition-transform">
            C
          </div>
          <div className="hidden sm:block">
            <div className="font-serif text-base font-bold leading-none">COSY Studio</div>
            <div className="text-xs text-muted-foreground font-mono mt-0.5">
              AI Visual IDE
            </div>
          </div>
        </Link>

        <div
          className={cn(
            "hidden md:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border",
            productionLaunchRunning
              ? "border-terracotta/40 bg-terracotta/10 text-terracotta"
              : productionLive
                ? "border-success/40 bg-success/10 text-success"
                : isPipelineRunning
                  ? "border-terracotta/40 bg-terracotta/10 text-terracotta"
                  : "border-border bg-muted text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              productionLaunchRunning || isPipelineRunning
                ? "bg-terracotta agent-pulse"
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

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="hidden sm:flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 h-9 text-xs text-muted-foreground hover:text-foreground hover:border-terracotta/30 transition-colors min-w-[140px]"
        >
          <Command className="h-3.5 w-3.5" />
          <span>Search…</span>
          <kbd className="ml-auto font-mono text-xs opacity-60">⌘K</kbd>
        </button>

        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden h-9 w-9"
          onClick={() => setCommandOpen(true)}
          aria-label="Command palette"
        >
          <Command className="h-4 w-4" />
        </Button>

        <Link to="/playground">
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Lab playground" title="Lab playground">
            <FlaskConical className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/showcase">
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Showcase">
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/mobile">
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Mobile companion">
            <Smartphone className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/pricing">
          <Button
            variant="secondary"
            size="sm"
            className="hidden sm:inline-flex h-9 gap-1.5 text-xs"
          >
            <CreditCard className="h-3.5 w-3.5" />
            {planTier}
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
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

        <ProductionLaunchButton />

        <Link to="/" className="sm:hidden">
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Home">
            <Home className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
