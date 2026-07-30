/** Client-side share of preview HTML — prefers public /a/:id link. */
import { toast } from "sonner";

export type ShareResult =
  | { mode: "link"; url: string; id: string }
  | { mode: "shared" }
  | { mode: "copied" }
  | { mode: "downloaded" };

export async function createPublicShareLink(opts: {
  html: string;
  title?: string;
  promptPreview?: string;
}): Promise<{ url: string; id: string; path: string } | null> {
  try {
    const res = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html: opts.html,
        title: opts.title ?? "Cozy preview",
        promptPreview: opts.promptPreview ?? undefined,
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
    /** Prefer public link (default true). */
    preferLink?: boolean;
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
    /* user cancelled or unsupported */
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
