import { createFileRoute, Navigate } from "@tanstack/react-router";
import { StudioShell } from "@/components/studio/StudioShell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { authEnabled } from "@/lib/auth/client";

export const Route = createFileRoute("/studio")({
  component: StudioPage,
  head: () => ({
    meta: [{ title: "Studio — CAI · Cozy AI Studio" }],
  }),
  ssr: false,
});

function StudioPage() {
  const { user, isPending } = useCurrentUserState();

  if (authEnabled) {
    if (isPending) {
      return (
        <div className="min-h-dvh grid place-items-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full border-2 border-choco/40 border-t-choco animate-spin" />
            <p className="text-sm text-muted-foreground font-mono">
              Checking session…
            </p>
          </div>
        </div>
      );
    }
    if (!user) {
      return <Navigate to="/login" search={{ redirect: "/studio" }} />;
    }
  }

  return <StudioShell />;
}
