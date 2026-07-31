import { useEffect, useState } from "react";
import {
  Panel,
  Group as PanelGroup,
  Separator as PanelResizeHandle,
} from "react-resizable-panels";
import { MessageSquare, Code2, Eye } from "lucide-react";
import { useStudioStore } from "@/stores/studio-store";
import { TopBar } from "./TopBar";
import { AgentPanel } from "./AgentPanel";
import { CodeDiffViewer } from "./CodeDiffViewer";
import { LivePreview } from "./LivePreview";
import { HitLApprovalCard } from "./HitLApprovalCard";
import { RejectionPoll } from "./RejectionPoll";
import { CommandPalette } from "./CommandPalette";
import { ProductionLaunchHost } from "./ProductionLaunch";
import { cn } from "@/lib/utils";
import { useBillingSync } from "@/hooks/useBillingSync";
import { applyShareRemix } from "@/lib/share-preview";
import { toast } from "sonner";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

export function StudioShell() {
  useBillingSync();
  // hydrate/sync: TopBar mounts useProjectSync (Cloud badge)

  const theme = useStudioStore((s) => s.theme);
  const mobilePanel = useStudioStore((s) => s.mobilePanel);
  const setMobilePanel = useStudioStore((s) => s.setMobilePanel);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Remix from public share /a/:id → /studio?remix=
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = new URLSearchParams(window.location.search).get("remix")?.trim();
    if (!id) return;
    let cancelled = false;
    void (async () => {
      const ok = await applyShareRemix(id);
      if (cancelled) return;
      if (!ok) {
        toast.error("Remix failed", { description: "Share not found or expired" });
      }
      // strip query so refresh doesn't re-apply
      const url = new URL(window.location.href);
      url.searchParams.delete("remix");
      window.history.replaceState({}, "", url.pathname + url.search);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <TopBar />

      {isDesktop ? (
        <div className="flex min-h-0 flex-1 p-3">
          {/*
            react-resizable-panels v4: bare numbers = pixels, strings = %.
            Left rail needs a real % width so agent UI never collapses to ~28px.
          */}
          <PanelGroup orientation="horizontal" className="min-h-0 flex-1">
            <Panel
              id="agents"
              defaultSize="28%"
              minSize="22%"
              maxSize="40%"
              className="min-h-0 min-w-0 overflow-hidden pr-1.5"
            >
              <AgentPanel />
            </Panel>
            <PanelResizeHandle className="w-1.5 rounded-full bg-transparent hover:bg-choco/30 transition-colors" />
            <Panel
              id="diff"
              defaultSize="40%"
              minSize="28%"
              className="min-h-0 min-w-0 overflow-hidden px-1.5"
            >
              <CodeDiffViewer />
            </Panel>
            <PanelResizeHandle className="w-1.5 rounded-full bg-transparent hover:bg-choco/30 transition-colors" />
            <Panel
              id="preview"
              defaultSize="32%"
              minSize="22%"
              className="min-h-0 min-w-0 overflow-hidden pl-1.5"
            >
              <LivePreview />
            </Panel>
          </PanelGroup>
        </div>
      ) : (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col p-2 sm:p-3">
          <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
            {mobilePanel === "chat" && <AgentPanel />}
            {mobilePanel === "studio" && <CodeDiffViewer />}
            {mobilePanel === "preview" && <LivePreview />}
          </div>
          <nav className="mt-2 flex shrink-0 items-center justify-around rounded-2xl border border-border bg-card p-1.5 shadow-sm">
            {(
              [
                { id: "chat" as const, icon: MessageSquare, label: "Brief" },
                { id: "studio" as const, icon: Code2, label: "Diff" },
                { id: "preview" as const, icon: Eye, label: "Preview" },
              ] as const
            ).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMobilePanel(id)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-xs font-medium transition-colors min-h-11",
                  mobilePanel === id
                    ? "bg-choco text-white"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      )}

      <HitLApprovalCard />
      <RejectionPoll />
      <CommandPalette />
      <ProductionLaunchHost />
    </div>
  );
}
