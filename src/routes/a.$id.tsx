import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Copy, ExternalLink, Link2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CozyLogo } from "@/components/brand/CozyLogo";
import { getSharedPreview } from "@/lib/share/server";
import { toast } from "sonner";

export const Route = createFileRoute("/a/$id")({
  loader: async ({ params }) => {
    try {
      const row = await getSharedPreview(params.id);
      if (!row) return { notFound: true as const, id: params.id };
      return {
        notFound: false as const,
        id: row.id,
        title: row.title,
        html: row.html,
        promptPreview: row.prompt_preview,
        createdAt: row.created_at,
      };
    } catch {
      return { notFound: true as const, id: params.id, error: true as const };
    }
  },
  head: ({ loaderData }) => {
    const notFound = loaderData?.notFound;
    const title = notFound
      ? "Share not found — Cozy AI Studio"
      : `${loaderData?.title ?? "Preview"} — Cozy share`;
    const description =
      !notFound && loaderData && "promptPreview" in loaderData && loaderData.promptPreview
        ? String(loaderData.promptPreview).slice(0, 160)
        : notFound
          ? "This Cozy share link is missing or expired."
          : "Public free-tier preview from Cozy AI Studio (Brief → preview → share).";
    const path = notFound ? undefined : `/a/${loaderData?.id}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "noindex" },
        { property: "og:type", content: "website" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(path
          ? [{ property: "og:url", content: path } as const]
          : []),
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
    };
  },
  component: PublicSharePage,
});

function PublicSharePage() {
  const data = Route.useLoaderData();
  const [copied, setCopied] = useState(false);

  if (data.notFound) {
    return (
      <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-4">
        <CozyLogo size="md" variant="seal" />
        <h1 className="font-serif text-2xl font-bold mt-6">Share not found</h1>
        <p className="text-sm text-muted-foreground mt-2 text-center max-w-sm">
          This link may have expired or never existed.
        </p>
        <Link to="/studio" className="mt-6">
          <Button>Open Studio</Button>
        </Link>
      </div>
    );
  }

  const publicPath = `/a/${data.id}`;
  const copyLink = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${publicPath}`
        : publicPath;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Public link copied", { description: publicPath });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.message("Copy this URL", { description: url });
    }
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="shrink-0 border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-3 px-3 sm:px-4">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cozy</span>
            </Link>
            <div className="h-4 w-px bg-border" />
            <CozyLogo size="sm" variant="seal" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{data.title}</p>
              <p className="text-[10px] text-muted-foreground font-mono truncate">
                {publicPath}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-choco" />
              Free publish
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 gap-1.5"
              onClick={() => void copyLink()}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">Copy link</span>
              <Link2 className="h-3.5 w-3.5 sm:hidden" />
            </Button>
            <a href={`/studio?remix=${encodeURIComponent(data.id)}`}>
              <Button size="sm" className="h-8 gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Remix</span>
                <span className="sm:hidden">Remix</span>
              </Button>
            </a>
          </div>
        </div>
      </header>

      {data.promptPreview && (
        <div className="shrink-0 border-b border-border bg-muted/40 px-3 py-1.5 text-[11px] text-muted-foreground truncate">
          Brief: {data.promptPreview}
        </div>
      )}

      <div className="min-h-0 flex-1 bg-canvas p-2 sm:p-3">
        <iframe
          title={data.title}
          srcDoc={data.html}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          className="h-full w-full rounded-xl border border-border bg-white shadow-[var(--shadow-glass)]"
        />
      </div>
    </div>
  );
}
