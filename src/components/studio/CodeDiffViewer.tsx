import { useEffect, useMemo, useRef, useState } from "react";
import { DiffEditor, loader } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Check, X, Code2, Loader2 } from "lucide-react";
import { useStudioStore } from "@/stores/studio-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Configure Monaco CDN loader once
loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs",
  },
});

function FallbackDiff({
  original,
  modified,
}: {
  original: string;
  modified: string;
}) {
  const lines = useMemo(() => {
    const o = original.split("\n");
    const m = modified.split("\n");
    const max = Math.max(o.length, m.length);
    const rows: { type: "same" | "add" | "del"; text: string; n: number }[] = [];
    for (let i = 0; i < max; i++) {
      const a = o[i];
      const b = m[i];
      if (a === b) {
        rows.push({ type: "same", text: b ?? a ?? "", n: i + 1 });
      } else {
        if (a !== undefined && a !== b) rows.push({ type: "del", text: a, n: i + 1 });
        if (b !== undefined && b !== a) rows.push({ type: "add", text: b, n: i + 1 });
      }
    }
    return rows;
  }, [original, modified]);

  return (
    <div className="h-full overflow-auto cosy-scroll font-mono text-[12.5px] leading-5 p-3 bg-canvas text-[#e8eaed] dark:text-[#e8eaed]">
      {lines.map((row, i) => (
        <div
          key={`${row.n}-${i}-${row.type}`}
          className={cn(
            "flex gap-3 px-2 rounded-sm",
            row.type === "add" && "diff-add",
            row.type === "del" && "diff-del",
          )}
        >
          <span className="w-8 shrink-0 text-right opacity-40 select-none tabular-nums">
            {row.n}
          </span>
          <span className="w-5 shrink-0 opacity-60 select-none">
            {row.type === "add" ? ">>" : row.type === "del" ? "<<" : "  "}
          </span>
          <pre className="flex-1 whitespace-pre-wrap break-all font-mono">{row.text || " "}</pre>
        </div>
      ))}
    </div>
  );
}

export function CodeDiffViewer() {
  const theme = useStudioStore((s) => s.theme);
  const originalCode = useStudioStore((s) => s.originalCode);
  const modifiedCode = useStudioStore((s) => s.modifiedCode);
  const language = useStudioStore((s) => s.language);
  const diffChunks = useStudioStore((s) => s.diffChunks);
  const acceptChunk = useStudioStore((s) => s.acceptChunk);
  const rejectChunk = useStudioStore((s) => s.rejectChunk);
  const acceptAllDiffs = useStudioStore((s) => s.acceptAllDiffs);
  const rejectAllDiffs = useStudioStore((s) => s.rejectAllDiffs);
  const isPipelineRunning = useStudioStore((s) => s.isPipelineRunning);
  const activeFile = useStudioStore((s) => s.activeFile);

  const [monacoReady, setMonacoReady] = useState(false);
  const [monacoFailed, setMonacoFailed] = useState(false);
  const editorRef = useRef<editor.IStandaloneDiffEditor | null>(null);

  useEffect(() => {
    let cancelled = false;
    loader
      .init()
      .then(() => {
        if (!cancelled) setMonacoReady(true);
      })
      .catch(() => {
        if (!cancelled) setMonacoFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const hasDiff = originalCode !== modifiedCode;
  const langLabel =
    language === "typescript" ? "TSX" : language === "css" ? "CSS" : language.toUpperCase();

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-glass)]">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/80 px-4 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <Code2 className="h-4 w-4 text-terracotta shrink-0" />
          <span className="font-serif text-sm font-semibold truncate">Code Diff</span>
          <span className="text-xs font-mono text-muted-foreground truncate hidden sm:inline">
            {activeFile}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isPipelineRunning && (
            <span className="flex items-center gap-1.5 text-xs text-terracotta font-medium">
              <Loader2 className="h-3 w-3 animate-spin" />
              Streaming
            </span>
          )}
          <span className="rounded-md bg-background/80 px-2 py-0.5 text-xs font-mono text-muted-foreground border border-border">
            {langLabel}
          </span>
          {hasDiff && !isPipelineRunning && (
            <>
              <Button size="sm" variant="danger" onClick={rejectAllDiffs} className="h-7 text-xs">
                Reject all
              </Button>
              <Button size="sm" onClick={acceptAllDiffs} className="h-7 text-xs">
                Accept all
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Inline chunk actions */}
      {hasDiff && diffChunks.length > 0 && !isPipelineRunning && (
        <div className="flex flex-wrap gap-1.5 border-b border-border bg-muted/40 px-3 py-2">
          {diffChunks.map((chunk) => (
            <div
              key={chunk.id}
              className={cn(
                "flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-mono",
                chunk.accepted === true && "border-success/40 bg-success-bg text-success",
                chunk.accepted === false && "border-danger/40 bg-danger-bg text-danger",
                chunk.accepted === null && "border-border bg-background text-muted-foreground",
              )}
            >
              <span>
                L{chunk.startLine}
                {chunk.endLine !== chunk.startLine ? `–${chunk.endLine}` : ""}
              </span>
              <button
                type="button"
                aria-label="Accept chunk"
                className="rounded p-0.5 hover:bg-success-bg text-success"
                onClick={() => acceptChunk(chunk.id)}
              >
                <Check className="h-3 w-3" />
              </button>
              <button
                type="button"
                aria-label="Reject chunk"
                className="rounded p-0.5 hover:bg-danger-bg text-danger"
                onClick={() => rejectChunk(chunk.id)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={cn("relative min-h-0 flex-1 bg-canvas", isPipelineRunning && "stream-caret")}>
        {monacoFailed || (!monacoReady && typeof window === "undefined") ? (
          <FallbackDiff original={originalCode} modified={modifiedCode} />
        ) : monacoReady ? (
          <DiffEditor
            height="100%"
            language={language === "typescript" ? "typescript" : language}
            original={originalCode}
            modified={modifiedCode}
            theme={theme === "dark" ? "vs-dark" : "light"}
            loading={
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading editor…
              </div>
            }
            onMount={(editor) => {
              editorRef.current = editor;
            }}
            options={{
              readOnly: true,
              renderSideBySide: false,
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: "Fira Code, ui-monospace, monospace",
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              useInlineViewWhenSpaceIsLimited: true,
              renderIndicators: true,
              originalEditable: false,
              automaticLayout: true,
              padding: { top: 12, bottom: 12 },
              lineNumbers: "on",
              glyphMargin: false,
              folding: false,
              wordWrap: "on",
            }}
          />
        ) : (
          <FallbackDiff original={originalCode} modified={modifiedCode} />
        )}
      </div>
    </div>
  );
}
