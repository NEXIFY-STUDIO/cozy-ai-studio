/** Client-side share of preview HTML (no public host yet). */
import { toast } from "sonner";

export async function sharePreviewHtml(
  html: string,
  opts?: { silent?: boolean },
): Promise<"shared" | "copied" | "downloaded"> {
  const body =
    html?.trim() ||
    "<!doctype html><html><body><p>Empty preview</p></body></html>";
  const blob = new Blob([body], { type: "text/html;charset=utf-8" });
  const file = new File([blob], "cozy-preview.html", { type: "text/html" });

  try {
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: "Cozy AI Studio preview",
        files: [file],
      });
      if (!opts?.silent) toast.success("Shared preview HTML");
      return "shared";
    }
  } catch {
    /* user cancelled or unsupported */
  }

  try {
    await navigator.clipboard.writeText(body);
    if (!opts?.silent) {
      toast.success("Preview HTML copied", {
        description:
          "Paste into a file or CodePen. Public host deploy is not live yet.",
      });
    }
    return "copied";
  } catch {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cozy-preview.html";
    a.click();
    URL.revokeObjectURL(url);
    if (!opts?.silent) toast.success("Downloaded cozy-preview.html");
    return "downloaded";
  }
}
