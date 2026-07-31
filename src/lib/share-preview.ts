/** Client-side share of preview HTML — prefers public /a/:id link. */
import { toast } from "sonner";
import { useStudioStore } from "@/stores/studio-store";
import { getActiveProjectId } from "@/hooks/useProjectSync";
import { trackActivation } from "@/lib/activation/client";

export type ShareResult =
  | { mode: "link"; url: string; id: string }
  | { mode: "shared" }
  | { mode: "copied" }
  | { mode: "downloaded" };

export async function createPublicShareLink(opts: {
  html: string;
  title?: string;
  promptPreview?: string;
  sourceCode?: string;
  sourceLanguage?: string;
  sourcePath?: string;
}): Promise<{ url: string; id: string; path: string } | null> {
  try {
    const state = useStudioStore.getState();
    const active = state.activeFile;
    const file = state.files[active];
    const res = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html: opts.html,
        title: opts.title ?? "Cozy preview",
        promptPreview: opts.promptPreview ?? state.lastPrompt?.slice(0, 280),
        projectId: getActiveProjectId(),
        sourceCode:
          opts.sourceCode ??
          state.pendingApproval?.modifiedCode ??
          file?.content ??
          state.modifiedCode,
        sourceLanguage:
          opts.sourceLanguage ??
          state.pendingApproval?.language ??
          file?.language ??
          state.language,
        sourcePath:
          opts.sourcePath ??
          state.pendingApproval?.affectedFiles?.[0] ??
          active,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      ok?: boolean;
      url?: string;
      id?: string;
      path?: string;
    };
    if (!data.ok || !data.url || !data.id) return null;
    try {
      useStudioStore.setState({
        lastShareUrl: data.url,
        lastShareId: data.id,
        lastShareAt: Date.now(),
      });
    } catch {
      /* ignore */
    }
    void trackActivation("share_created", { id: data.id });
    return { url: data.url, id: data.id, path: data.path ?? `/a/${data.id}` };
  } catch {
    return null;
  }
}

export async function sharePreviewHtml(
  html: string,
  opts?: {
    silent?: boolean;
    title?: string;
    promptPreview?: string;
    preferLink?: boolean;
    sourceCode?: string;
    sourceLanguage?: string;
    sourcePath?: string;
  },
): Promise<ShareResult> {
  const body =
    html?.trim() ||
    "<!doctype html><html><body><p>Empty preview</p></body></html>";

  if (opts?.preferLink !== false) {
    const link = await createPublicShareLink({
      html: body,
      title: opts?.title,
      promptPreview: opts?.promptPreview,
      sourceCode: opts?.sourceCode,
      sourceLanguage: opts?.sourceLanguage,
      sourcePath: opts?.sourcePath,
    });
    if (link) {
      try {
        await navigator.clipboard.writeText(link.url);
        if (!opts?.silent) {
          toast.success("Public link copied", {
            description: link.path,
            action: {
              label: "Open",
              onClick: () => window.open(link.url, "_blank", "noopener"),
            },
          });
        }
        return { mode: "link", url: link.url, id: link.id };
      } catch {
        if (!opts?.silent) {
          toast.success("Share link ready", {
            description: link.url,
            action: {
              label: "Open",
              onClick: () => window.open(link.url, "_blank", "noopener"),
            },
          });
        }
        return { mode: "link", url: link.url, id: link.id };
      }
    }
  }

  const blob = new Blob([body], { type: "text/html;charset=utf-8" });
  const file = new File([blob], "cozy-preview.html", { type: "text/html" });

  try {
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: opts?.title ?? "Cozy AI Studio preview",
        files: [file],
      });
      if (!opts?.silent) toast.success("Shared preview HTML");
      return { mode: "shared" };
    }
  } catch {
    /* cancelled */
  }

  try {
    await navigator.clipboard.writeText(body);
    if (!opts?.silent) {
      toast.success("Preview HTML copied", {
        description:
          "Public link unavailable — pasted full HTML. Host deploy still not live.",
      });
    }
    return { mode: "copied" };
  } catch {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cozy-preview.html";
    a.click();
    URL.revokeObjectURL(url);
    if (!opts?.silent) toast.success("Downloaded cozy-preview.html");
    return { mode: "downloaded" };
  }
}

/** Apply a public share into the current studio session (Remix). */
export async function applyShareRemix(shareId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/share?id=${encodeURIComponent(shareId)}`);
    if (!res.ok) return false;
    const data = (await res.json()) as {
      ok?: boolean;
      html?: string;
      title?: string;
      sourceCode?: string | null;
      sourceLanguage?: string | null;
      sourcePath?: string | null;
      promptPreview?: string | null;
    };
    if (!data.ok) return false;

    const path = data.sourcePath || "src/App.tsx";
    const language = data.sourceLanguage || "tsx";
    const code =
      data.sourceCode?.trim() ||
      `export default function App() {\n  return (\n    <div dangerouslySetInnerHTML={{ __html: ${JSON.stringify(data.html || "")} }} />\n  );\n}\n`;

    const state = useStudioStore.getState();
    const files = {
      ...state.files,
      [path]: { path, language, content: code },
    };
    useStudioStore.setState({
      files,
      activeFile: path,
      originalCode: code,
      modifiedCode: code,
      language,
      previewHtml: data.html || state.previewHtml,
      previewKey: state.previewKey + 1,
    });
    if (data.promptPreview) {
      try {
        sessionStorage.setItem("cozy-landing-prompt", data.promptPreview);
      } catch {
        /* ignore */
      }
    }
    toast.success("Remixed into Studio", {
      description: path,
    });
    void trackActivation("remix_opened", { shareId });
    return true;
  } catch {
    return false;
  }
}
