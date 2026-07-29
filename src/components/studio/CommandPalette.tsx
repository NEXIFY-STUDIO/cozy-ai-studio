import { useEffect, useMemo } from "react";
import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";
import {
  FileCode2,
  Sun,
  Circle,
  Rocket,
  ShieldCheck,
  LayoutDashboard,
  Smartphone,
  CreditCard,
  Sparkles,
  RefreshCw,
  Upload,
  AlertTriangle,
  Timer,
  WifiOff,
  FlaskConical,
} from "lucide-react";
import { useStudioStore } from "@/stores/studio-store";
import { runStudioPipeline } from "@/lib/ai/run-studio-pipeline";
import { toast } from "sonner";

export function CommandPalette() {
  const open = useStudioStore((s) => s.commandOpen);
  const setCommandOpen = useStudioStore((s) => s.setCommandOpen);
  const toggleTheme = useStudioStore((s) => s.toggleTheme);
  const theme = useStudioStore((s) => s.theme);
  const files = useStudioStore((s) => s.files);
  const setActiveFile = useStudioStore((s) => s.setActiveFile);
  const refreshPreview = useStudioStore((s) => s.refreshPreview);
  const setPublishUrl = useStudioStore((s) => s.setPublishUrl);
  const setPlanTier = useStudioStore((s) => s.setPlanTier);
  const setProductionLaunchOpen = useStudioStore((s) => s.setProductionLaunchOpen);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(!useStudioStore.getState().commandOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCommandOpen]);

  const fileEntries = useMemo(() => Object.values(files), [files]);

  const runQuick = async (prompt: string) => {
    setCommandOpen(false);
    await runStudioPipeline(prompt);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-charcoal/40 backdrop-blur-sm pt-[12vh] px-4">
      <Command
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevated)]"
        label="Command palette"
      >
        <div className="flex items-center border-b border-border px-3">
          <Sparkles className="h-4 w-4 text-terracotta mr-2 shrink-0" />
          <Command.Input
            placeholder="Search commands, files, error demos…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          <kbd className="hidden sm:inline text-xs font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>
        <Command.List className="max-h-80 overflow-auto cosy-scroll p-2">
          <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
            No results.
          </Command.Empty>

          <Command.Group
            heading="Actions"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1.5"
          >
            <Item
              icon={FlaskConical}
              label="Open Lab playground"
              onSelect={() => {
                setCommandOpen(false);
                navigate({ to: "/playground" });
              }}
            />
            <Item
              icon={Rocket}
              label="Go to Production"
              onSelect={() => {
                setCommandOpen(false);
                setProductionLaunchOpen(true);
              }}
            />
            <Item
              icon={ShieldCheck}
              label="Run full agent audit"
              onSelect={() =>
                runQuick(
                  "Audit the current UI for OWASP and Tailwind issues, then improve the hero",
                )
              }
            />
            <Item
              icon={LayoutDashboard}
              label="Generate pricing section"
              onSelect={() =>
                runQuick("Add a pricing section with Free Pro and Enterprise tiers")
              }
            />
            <Item
              icon={RefreshCw}
              label="Refresh live preview"
              onSelect={() => {
                refreshPreview();
                setCommandOpen(false);
                toast.success("Preview refreshed");
              }}
            />
            <Item
              icon={Upload}
              label="Publish to cosy.studio"
              onSelect={() => {
                const slug = `app-${Math.random().toString(36).slice(2, 7)}`;
                const url = `${slug}.cosy.studio`;
                setPublishUrl(url);
                setCommandOpen(false);
                toast.success(`Published: ${url}`);
              }}
            />
            <Item
              icon={theme === "dark" ? Sun : Circle}
              label={theme === "dark" ? "Switch to cream theme" : "Switch to silver theme"}
              onSelect={() => {
                toggleTheme();
                setCommandOpen(false);
              }}
            />
            <Item
              icon={CreditCard}
              label="Upgrade to Pro"
              onSelect={() => {
                setPlanTier("PRO");
                setCommandOpen(false);
                navigate({ to: "/pricing" });
              }}
            />
            <Item
              icon={Smartphone}
              label="Open mobile companion"
              onSelect={() => {
                setCommandOpen(false);
                navigate({ to: "/mobile" });
              }}
            />
            <Item
              icon={Rocket}
              label="Open showcase gallery"
              onSelect={() => {
                setCommandOpen(false);
                navigate({ to: "/showcase" });
              }}
            />
          </Command.Group>

          <Command.Group
            heading="Error handling examples"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1.5 mt-1"
          >
            <Item
              icon={AlertTriangle}
              label="Simulate rate limit (429)"
              onSelect={() => runQuick("simulate rate limit error")}
            />
            <Item
              icon={WifiOff}
              label="Simulate network error"
              onSelect={() => runQuick("simulate network error")}
            />
            <Item
              icon={Timer}
              label="Simulate pipeline timeout"
              onSelect={() => runQuick("simulate pipeline timeout")}
            />
            <Item
              icon={AlertTriangle}
              label="Simulate unhealable audit failure"
              onSelect={() => runQuick("simulate unhealable audit failure")}
            />
            <Item
              icon={ShieldCheck}
              label="Demo auto-heal XSS recovery"
              onSelect={() => runQuick("inject broken XSS for auto-heal demo")}
            />
          </Command.Group>

          <Command.Group
            heading="Files"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1.5 mt-1"
          >
            {fileEntries.map((f) => (
              <Item
                key={f.path}
                icon={FileCode2}
                label={f.path}
                onSelect={() => {
                  setActiveFile(f.path);
                  setCommandOpen(false);
                }}
              />
            ))}
          </Command.Group>
        </Command.List>
      </Command>
      <button
        type="button"
        className="absolute inset-0 -z-10 cursor-default"
        aria-label="Close command palette"
        onClick={() => setCommandOpen(false)}
      />
    </div>
  );
}

function Item({
  icon: Icon,
  label,
  onSelect,
}: {
  icon: typeof FileCode2;
  label: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      value={label}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm aria-selected:bg-terracotta/10 aria-selected:text-foreground data-[selected=true]:bg-terracotta/10"
    >
      <Icon className="h-4 w-4 text-terracotta shrink-0" />
      <span>{label}</span>
    </Command.Item>
  );
}
