import { Link, useNavigate } from "@tanstack/react-router";
import { Command, Sun, Circle, LayoutGrid, Cloud, CloudOff } from "lucide-react";
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
import { useProjectSync } from "@/hooks/useProjectSync";

export function TopBar() {
  const theme = useStudioStore((s) => s.theme);
  const toggleTheme = useStudioStore((s) => s.toggleTheme);
  const setCommandOpen = useStudioStore((s) => s.setCommandOpen);
  const setMobilePanel = useStudioStore((s) => s.setMobilePanel);
  const planTier = useStudioStore((s) => s.planTier);
  const promptsUsed = useStudioStore((s) => s.promptsUsed);
  const promptLimit = useStudioStore((s) => s.promptLimit);
  const dailyUsed = useStudioStore((s) => s.dailyUsed);
  const dailyLimit = useStudioStore((s) => s.dailyLimit);
  const stripeConfigured = useStudioStore((s) => s.stripeConfigured);
  const isPipelineRunning = useStudioStore((s) => s.isPipelineRunning);
  const productionLive = useStudioStore((s) => s.productionLive);
  const productionLaunchRunning = useStudioStore((s) => s.productionLaunchRunning);
  const navigate = useNavigate();
  const { hydrated, syncing, projectId } = useProjectSync();

  const remaining =
    planTier === "FREE"
      ? Math.max(0, (promptLimit || 100) - promptsUsed)
      : null;
  const dailyLeft =
    planTier === "FREE" && dailyLimit != null
      ? Math.max(0, dailyLimit - dailyUsed)
      : null;

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
              Cozy
            </div>
            <div className="text-xs text-muted-foreground font-mono mt-0.5">
              AI Studio
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
            ? "Deploy…"
            : productionLive
              ? "Deployed (local)"
              : isPipelineRunning
                ? "Agents running"
                : "Ready"}
        </div>

        {authEnabled && (
          <div
            className={cn(
              "hidden lg:flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-mono border",
              syncing
                ? "border-agents-blue/40 bg-agents-blue/10 text-agents-blue"
                : projectId && hydrated
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-border bg-muted text-muted-foreground",
            )}
            title={
              projectId
                ? `Cloud project ${projectId}`
                : "Local only — sign in to sync"
            }
          >
            {projectId ? (
              <Cloud className="h-3 w-3" />
            ) : (
              <CloudOff className="h-3 w-3" />
            )}
            {syncing ? "Sync…" : projectId ? "Cloud" : "Local"}
          </div>
        )}
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
          Agents
          <IconOpenWindow className="opacity-90" />
        </Button>

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

        <button
          type="button"
          onClick={() => void navigate({ to: "/pricing", search: {} })}
          className={cn(
            "hidden sm:inline-flex items-center gap-1.5 rounded-full border px-2.5 h-8 text-[11px] font-mono transition-colors",
            planTier === "FREE"
              ? "border-border bg-muted/60 text-muted-foreground hover:border-choco/40 hover:text-foreground"
              : "border-choco/30 bg-choco/10 text-choco",
          )}
          title={
            dailyLeft != null
              ? `Daily left: ${dailyLeft} · Monthly left: ${remaining}`
              : `Plan ${planTier}`
          }
        >
          <span className="font-semibold">{planTier}</span>
          {remaining != null && (
            <span className="tabular-nums opacity-80">
              {dailyLeft != null ? `${dailyLeft}d` : ""}
              {dailyLeft != null ? " · " : ""}
              {remaining} left
            </span>
          )}
        </button>

        <ProductionLaunchButton stripeConfigured={stripeConfigured} />

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
