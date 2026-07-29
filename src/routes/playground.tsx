import { useCallback, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Boxes,
  Braces,
  Cable,
  Cpu,
  FlaskConical,
  GitBranch,
  Layers,
  Play,
  Plug,
  Power,
  Sparkles,
  Square,
  Users,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BuilderKernel,
  PluginRegistry,
  streamMistralPlan,
  type PluginState,
} from "@/lib/playground/kernel";

export const Route = createFileRoute("/playground")({
  component: PlaygroundPage,
  head: () => ({
    meta: [{ title: "Playground — Cozy Lab" }],
  }),
});

type LabTab = "kernel" | "plugins" | "ai" | "canvas" | "presence";

const TABS: {
  id: LabTab;
  label: string;
  icon: typeof Cpu;
  blurb: string;
}[] = [
  {
    id: "kernel",
    label: "Builder Kernel",
    icon: Cpu,
    blurb: "Build UI with simple commands",
  },
  {
    id: "plugins",
    label: "Plugin SDK",
    icon: Plug,
    blurb: "Turn tools on and off",
  },
  {
    id: "ai",
    label: "AI Gateway",
    icon: Sparkles,
    blurb: "Stream a plan with Mistral",
  },
  {
    id: "canvas",
    label: "Canvas",
    icon: Layers,
    blurb: "See pieces on the stage",
  },
  {
    id: "presence",
    label: "Multiplayer",
    icon: Users,
    blurb: "Who else is in the room",
  },
];

function PlaygroundPage() {
  const [tab, setTab] = useState<LabTab>("kernel");
  const kernelRef = useRef(new BuilderKernel("Cosy Lab Doc"));
  const pluginsRef = useRef(new PluginRegistry());
  const [, bump] = useState(0);
  const refresh = () => bump((n) => n + 1);

  const kernel = kernelRef.current;
  const registry = pluginsRef.current;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-choco text-white shadow-[var(--shadow-brutalist-sm)]">
                <FlaskConical className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="font-serif text-lg font-bold leading-tight truncate">
                  Cozy Lab
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  Safe place to try new features
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/studio">
              <Button size="sm" variant="secondary" className="h-9">
                Studio
              </Button>
            </Link>
            <Link to="/studio">
              <Button size="sm" className="h-9 gap-1.5">
                <Wand2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Open in Studio</span>
                <span className="sm:hidden">Open</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-choco mb-2">
            Lab playground
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-3">
            Try new features before you ship
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Click a module on the left. Each one is a short demo of a core Cozy
            piece: the builder, plugins, AI planning, the canvas, and live
            collaboration.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 min-h-[70dvh]">
          <aside className="lg:w-72 shrink-0">
            <nav className="flex lg:flex-col gap-2 overflow-x-auto @@Cozy_SCROLL@@ pb-1 lg:pb-0">
              {TABS.map(({ id, label, icon: Icon, blurb }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={cn(
                    "flex min-w-[11rem] lg:min-w-0 items-start gap-3 rounded-2xl border px-3.5 py-3 text-left transition-colors",
                    tab === id
                      ? "border-choco/40 bg-choco/10"
                      : "border-border bg-card hover:border-choco/30",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 mt-0.5 shrink-0",
                      tab === id ? "text-choco" : "text-muted-foreground",
                    )}
                  />
                  <span>
                    <span className="block text-sm font-semibold leading-snug">
                      {label}
                    </span>
                    <span className="block text-xs text-muted-foreground mt-1 leading-snug">
                      {blurb}
                    </span>
                  </span>
                </button>
              ))}
            </nav>

            <div className="mt-4 hidden lg:block rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Build info
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                AI provider: <span className="font-medium">Mistral</span>
                <br />
                Canvas: <span className="font-medium">studio-canvas-1</span>
              </p>
            </div>
          </aside>

          <main className="min-w-0 flex-1 rounded-3xl border border-border bg-card shadow-[var(--shadow-glass)] overflow-hidden flex flex-col">
            {tab === "kernel" && <KernelPanel kernel={kernel} onChange={refresh} />}
            {tab === "plugins" && (
              <PluginsPanel
                registry={registry}
                plugins={registry.plugins}
                onChange={refresh}
              />
            )}
            {tab === "ai" && <AiPanel kernel={kernel} onKernelChange={refresh} />}
            {tab === "canvas" && <CanvasPanel kernel={kernel} onChange={refresh} />}
            {tab === "presence" && <PresencePanel />}
          </main>
        </div>
      </div>
    </div>
  );
}

function PanelChrome({
  title,
  subtitle,
  children,
  actions,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-muted/40 px-4 sm:px-6 py-4">
        <div className="min-w-0 max-w-xl">
          <h2 className="font-serif text-xl font-bold leading-snug">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {subtitle}
          </p>
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      <div className="min-h-0 flex-1 p-4 sm:p-6">{children}</div>
    </>
  );
}

function KernelPanel({
  kernel,
  onChange,
}: {
  kernel: BuilderKernel;
  onChange: () => void;
}) {
  const run = (cmd: Parameters<BuilderKernel["dispatch"]>[0]) => {
    const entry = kernel.dispatch(cmd);
    onChange();
    toast[entry.ok ? "success" : "error"](entry.message);
  };

  return (
    <PanelChrome
      title="Builder Kernel"
      subtitle="Add UI pieces with commands. Watch the graph and the command history update."
      actions={
        <>
          <Button
            size="sm"
            variant="secondary"
            className="h-9"
            onClick={() =>
              run({
                type: "node.add",
                parentId: "root",
                kind: "text",
                props: { label: "Headline" },
              })
            }
          >
            Add text
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-9"
            onClick={() =>
              run({
                type: "node.add",
                parentId: "root",
                kind: "button",
                props: { label: "CTA", variant: "primary" },
              })
            }
          >
            Add button
          </Button>
          <Button
            size="sm"
            className="h-9 gap-1.5"
            onClick={() => {
              run({ type: "export.json" });
              navigator.clipboard?.writeText(kernel.exportJson()).catch(() => {});
              toast.message("Copied JSON to clipboard");
            }}
          >
            <Braces className="h-3.5 w-3.5" />
            Export JSON
          </Button>
        </>
      }
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold mb-2">
            Node graph
            <span className="font-normal text-muted-foreground">
              {" "}
              · version {kernel.doc.revision}
            </span>
          </p>
          <div className="rounded-2xl border border-border bg-canvas p-3 min-h-[300px] relative overflow-hidden">
            {kernel.doc.nodes.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() =>
                  run({
                    type: "node.move",
                    id: n.id,
                    x: n.x + 12,
                    y: n.y + 8,
                  })
                }
                className={cn(
                  "absolute rounded-xl border px-3 py-2 text-left shadow-sm transition-transform hover:-translate-y-0.5",
                  n.kind === "frame"
                    ? "border-choco/50 bg-choco/25 text-[#f4f1ea]"
                    : "border-white/20 bg-canvas-elevated text-[#f4f1ea]",
                )}
                style={{ left: n.x, top: n.y, minWidth: 104 }}
              >
                <span className="block text-xs uppercase tracking-wide opacity-80">
                  {n.kind}
                </span>
                <span className="block text-sm font-medium mt-0.5">
                  {n.props.label ?? n.id}
                </span>
              </button>
            ))}
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-xs text-white/70">
              <GitBranch className="h-3.5 w-3.5 shrink-0" />
              <span>
                {kernel.doc.name} · {kernel.doc.nodes.length} nodes · click a node
                to move it
              </span>
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold mb-2">Command history</p>
          <div className="rounded-2xl border border-border bg-muted/40 max-h-[300px] overflow-auto @@Cozy_SCROLL@@ divide-y divide-border">
            {kernel.log.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground leading-relaxed">
                No commands yet. Use the buttons above to add a node or export.
              </p>
            )}
            {kernel.log.map((e) => (
              <div key={e.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-choco">
                    {e.command.type}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      e.ok ? "text-success" : "text-danger",
                    )}
                  >
                    {e.ok ? "OK" : "Failed"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{e.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelChrome>
  );
}

function PluginsPanel({
  registry,
  plugins,
  onChange,
}: {
  registry: PluginRegistry;
  plugins: PluginState[];
  onChange: () => void;
}) {
  return (
    <PanelChrome
      title="Plugin SDK"
      subtitle="Enable a plugin, check its permissions, then run it. Results show under each card."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {plugins.map((p) => (
          <article
            key={p.id}
            className={cn(
              "rounded-2xl border p-4 sm:p-5 flex flex-col gap-3",
              p.enabled
                ? "border-choco/35 bg-choco/5"
                : "border-border bg-background/50",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-serif text-lg font-semibold leading-snug">
                  {p.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {p.author} · v{p.version}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  registry.toggle(p.id);
                  onChange();
                }}
                className={cn(
                  "rounded-full p-2.5 border transition-colors shrink-0",
                  p.enabled
                    ? "border-choco/40 bg-choco text-white"
                    : "border-border text-muted-foreground",
                )}
                aria-label={p.enabled ? "Disable plugin" : "Enable plugin"}
              >
                <Power className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {p.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {p.permissions.map((perm) => (
                <span
                  key={perm}
                  className="rounded-md border border-border bg-muted/60 px-2 py-1 text-xs text-muted-foreground"
                >
                  {perm}
                </span>
              ))}
            </div>
            <div className="mt-auto flex items-center justify-between gap-3 pt-2">
              <span className="text-xs text-muted-foreground truncate leading-snug">
                {p.lastEvent ?? "Not run yet"}
              </span>
              <Button
                size="sm"
                variant="secondary"
                className="h-9 gap-1.5 shrink-0"
                disabled={!p.enabled || p.status === "running"}
                onClick={async () => {
                  const msg = await registry.run(p.id);
                  onChange();
                  toast.success(msg);
                }}
              >
                {p.status === "running" ? (
                  "Running…"
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" /> Run
                  </>
                )}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </PanelChrome>
  );
}

function AiPanel({
  kernel,
  onKernelChange,
}: {
  kernel: BuilderKernel;
  onKernelChange: () => void;
}) {
  const [prompt, setPrompt] = useState("Pricing section with chocolate tokens");
  const [stream, setStream] = useState("");
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setStream("");
    const ac = new AbortController();
    abortRef.current = ac;
    kernel.dispatch({ type: "ai.plan", prompt });
    onKernelChange();
    try {
      await streamMistralPlan(prompt, setStream, ac.signal);
      kernel.dispatch({
        type: "node.add",
        parentId: "root",
        kind: "section",
        props: { label: "From AI plan" },
      });
      onKernelChange();
      toast.success("Plan finished. A new node was added to the graph.");
    } catch {
      toast.message("Stream stopped");
    } finally {
      setRunning(false);
      abortRef.current = null;
    }
  }, [prompt, running, kernel, onKernelChange]);

  return (
    <PanelChrome
      title="AI Gateway"
      subtitle="Mistral-only planning. Type a goal, stream the plan, and send a node into the kernel."
      actions={
        running ? (
          <Button
            size="sm"
            variant="danger"
            className="h-9 gap-1.5"
            onClick={() => abortRef.current?.abort()}
          >
            <Square className="h-3.5 w-3.5" />
            Stop
          </Button>
        ) : (
          <Button size="sm" className="h-9 gap-1.5" onClick={() => void start()}>
            <Sparkles className="h-3.5 w-3.5" />
            Stream plan
          </Button>
        )
      }
    >
      <div className="space-y-4 max-w-3xl">
        <label className="block space-y-2">
          <span className="text-sm font-semibold">What should we plan?</span>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-background px-3.5 text-base outline-none focus:border-choco focus:ring-1 focus:ring-choco/30"
            placeholder="e.g. Pricing section with three tiers"
          />
        </label>
        <div className="rounded-2xl border border-border bg-canvas min-h-[260px] p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3 text-xs text-white/65">
            <Cable className="h-3.5 w-3.5 text-choco shrink-0" />
            Provider: Mistral · offline demo stream
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm sm:text-[15px] leading-relaxed text-[#f0ece6]">
            {stream || "The plan will appear here when you start the stream."}
            {running && (
              <span className="inline-block w-1.5 h-4 ml-0.5 bg-choco align-middle animate-pulse" />
            )}
          </pre>
        </div>
      </div>
    </PanelChrome>
  );
}

function CanvasPanel({
  kernel,
  onChange,
}: {
  kernel: BuilderKernel;
  onChange: () => void;
}) {
  const artifacts = useMemo(() => kernel.doc.nodes, [kernel.doc.nodes, kernel.doc.revision]);

  return (
    <PanelChrome
      title="Studio Canvas"
      subtitle="Working stage on canvas grey. Drop artifacts and see them on the board."
      actions={
        <Button
          size="sm"
          className="h-9 gap-1.5"
          onClick={() => {
            kernel.dispatch({
              type: "node.add",
              parentId: "root",
              kind: "card",
              props: { label: `Artifact ${kernel.doc.nodes.length}` },
            });
            onChange();
          }}
        >
          <Boxes className="h-3.5 w-3.5" />
          Drop artifact
        </Button>
      }
    >
      <div className="rounded-2xl border border-border bg-dots-pattern min-h-[380px] relative overflow-hidden">
        {artifacts.map((n) => (
          <div
            key={n.id}
            className={cn(
              "absolute rounded-2xl border shadow-[var(--shadow-elevated)] px-3.5 py-2.5",
              n.kind === "frame"
                ? "border-choco/40 bg-choco/20 text-[#f4f1ea] min-w-[150px] min-h-[110px]"
                : "border-white/15 bg-canvas-elevated text-[#f4f1ea]",
            )}
            style={{ left: n.x, top: n.y }}
          >
            <p className="text-xs uppercase tracking-wide opacity-70">{n.kind}</p>
            <p className="text-sm font-medium mt-0.5">{n.props.label ?? n.id}</p>
          </div>
        ))}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
          <span className="rounded-lg border border-white/15 bg-black/50 backdrop-blur px-2.5 py-1.5 text-xs text-white/85">
            Canvas grey #141414
          </span>
          <span className="rounded-lg border border-white/15 bg-black/50 backdrop-blur px-2.5 py-1.5 text-xs text-white/85">
            {kernel.doc.nodes.length} pieces · version {kernel.doc.revision}
          </span>
        </div>
      </div>
    </PanelChrome>
  );
}

function PresencePanel() {
  const peers = [
    { name: "Erik", color: "#c48a5a", x: 28, y: 32 },
    { name: "Maya", color: "#4ade80", x: 58, y: 48 },
    { name: "Jules", color: "#60a5fa", x: 42, y: 62 },
  ];

  return (
    <PanelChrome
      title="Multiplayer"
      subtitle="See who else is on the canvas. This is a demo of live presence."
    >
      <div className="rounded-2xl border border-border bg-dots-pattern min-h-[380px] relative overflow-hidden">
        {peers.map((p) => (
          <div
            key={p.name}
            className="absolute flex items-center gap-2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <span
              className="h-3.5 w-3.5 rounded-full ring-2 ring-white/40 agent-pulse"
              style={{ background: p.color }}
            />
            <span
              className="rounded-md px-2 py-1 text-xs font-medium text-white shadow"
              style={{ background: p.color }}
            >
              {p.name}
            </span>
          </div>
        ))}
        <div className="absolute bottom-3 left-3 rounded-xl border border-white/15 bg-black/55 backdrop-blur px-3.5 py-2.5 text-sm text-white/90">
          <Users className="inline h-4 w-4 mr-2 text-choco align-text-bottom" />
          3 people online · Live Presence plugin
        </div>
      </div>
    </PanelChrome>
  );
}
