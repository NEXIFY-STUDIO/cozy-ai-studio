import { useCallback, useRef, useState } from "react";
import {
  Smartphone,
  Monitor,
  Tablet,
  RotateCw,
  MousePointer2,
  Maximize2,
} from "lucide-react";
import { useStudioStore, type DeviceType } from "@/stores/studio-store";
import { cn } from "@/lib/utils";

const devices: { id: DeviceType; icon: typeof Smartphone; label: string; w: string; h: string }[] =
  [
    { id: "mobile", icon: Smartphone, label: "iPhone", w: "w-[min(375px,100%)]", h: "h-[min(667px,100%)]" },
    { id: "tablet", icon: Tablet, label: "iPad", w: "w-[min(768px,100%)]", h: "h-[min(500px,100%)]" },
    { id: "desktop", icon: Monitor, label: "Desktop", w: "w-full", h: "h-full" },
  ];

export function LivePreview() {
  const device = useStudioStore((s) => s.device);
  const setDevice = useStudioStore((s) => s.setDevice);
  const previewHtml = useStudioStore((s) => s.previewHtml);
  const previewKey = useStudioStore((s) => s.previewKey);
  const refreshPreview = useStudioStore((s) => s.refreshPreview);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [inspectMode, setInspectMode] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshPreview();
    setTimeout(() => setIsRefreshing(false), 400);
  }, [refreshPreview]);

  const onIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentDocument) return;
    const doc = iframe.contentDocument;

    // Visual element selector via click
    const handler = (e: MouseEvent) => {
      if (!useStudioStore.getState().device) return;
      // Read inspect from store-less closure — use state via data attr
      if (!iframe.dataset.inspect) return;
      e.preventDefault();
      e.stopPropagation();
      const t = e.target as HTMLElement;
      const tag = t.tagName.toLowerCase();
      const cls = typeof t.className === "string" ? t.className.split(" ")[0] : "";
      const label = cls ? `${tag}.${cls}` : tag;
      setSelectedLabel(label);
      doc.querySelectorAll("[data-cosy-inspect]").forEach((el) => {
        (el as HTMLElement).style.outline = "";
        el.removeAttribute("data-cosy-inspect");
      });
      t.style.outline = "2px solid #6b3f24";
      t.style.outlineOffset = "2px";
      t.setAttribute("data-cosy-inspect", "1");
    };

    doc.addEventListener("click", handler, true);
  }, []);

  const toggleInspect = () => {
    setInspectMode((v) => {
      const next = !v;
      if (iframeRef.current) {
        if (next) iframeRef.current.dataset.inspect = "1";
        else {
          delete iframeRef.current.dataset.inspect;
          setSelectedLabel(null);
        }
      }
      return next;
    });
  };

  const current = devices.find((d) => d.id === device) ?? devices[0];

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-glass)]">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/80 px-3 py-2.5 sm:px-4">
        <span className="font-serif text-sm font-semibold shrink-0">Live Preview</span>
        <div className="flex items-center gap-1 rounded-xl bg-background/70 p-1 border border-border">
          {devices.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              title={label}
              onClick={() => setDevice(id)}
              className={cn(
                "rounded-lg p-1.5 transition-all",
                device === id
                  ? "bg-terracotta text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
          <div className="mx-0.5 h-4 w-px bg-border" />
          <button
            type="button"
            title="Visual element selector"
            onClick={toggleInspect}
            className={cn(
              "rounded-lg p-1.5 transition-all",
              inspectMode
                ? "bg-terracotta text-white"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <MousePointer2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Refresh"
            onClick={handleRefresh}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground"
          >
            <RotateCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </button>
        </div>
      </div>

      {selectedLabel && inspectMode && (
        <div className="border-b border-border bg-terracotta/10 px-3 py-1.5 text-xs font-mono text-terracotta">
          Selected: {selectedLabel}
        </div>
      )}

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto bg-dots-pattern p-3 sm:p-4">
        <div
          className={cn(
            "transition-all duration-300 ease-out bg-white dark:bg-canvas-elevated overflow-hidden shadow-[var(--shadow-elevated)]",
            device === "desktop"
              ? "h-full w-full rounded-xl border border-border"
              : cn(
                  "rounded-[28px] border-[5px] border-charcoal/20 dark:border-zinc-600",
                  current.w,
                  current.h,
                ),
          )}
          style={
            device === "mobile"
              ? { maxHeight: "100%", aspectRatio: "375/667" }
              : device === "tablet"
                ? { maxHeight: "100%", aspectRatio: "768/500" }
                : undefined
          }
        >
          {device !== "desktop" && (
            <div className="flex justify-center py-1.5 bg-charcoal/5 dark:bg-white/5">
              <div className="h-1 w-16 rounded-full bg-charcoal/20 dark:bg-white/20" />
            </div>
          )}
          <iframe
            key={previewKey}
            ref={iframeRef}
            title="Cozy Live Preview"
            srcDoc={previewHtml}
            onLoad={onIframeLoad}
            sandbox="allow-scripts allow-same-origin allow-forms"
            className={cn(
              "w-full border-0 bg-white",
              device === "desktop" ? "h-full" : "h-[calc(100%-14px)]",
            )}
          />
        </div>

        <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 rounded-lg border border-border bg-card/90 px-2 py-1 text-xs font-mono text-muted-foreground backdrop-blur-sm">
          <Maximize2 className="h-3 w-3" />
          {device === "mobile" ? "375×667" : device === "tablet" ? "768×500" : "1920×1080"}
        </div>
      </div>
    </div>
  );
}
