import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  GROK_PROVIDERS,
  getBearerToken,
  signIn,
} from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { resolveAuthProvider, authEnabledResolved } from "@/lib/auth/mode";
import { signInWithSupabaseOAuth } from "@/lib/auth/supabase-browser";
import { CozyLogo } from "@/components/brand/CozyLogo";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [{ title: "Prihlásenie — CAI · Cozy AI Studio" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    redirect:
      typeof search.redirect === "string" && search.redirect.startsWith("/")
        ? search.redirect
        : "/studio",
  }),
});

function LoginPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const provider = resolveAuthProvider("client");
  const authEnabled = authEnabledResolved("client");

  useEffect(() => {
    if (!authEnabled) return;
    if (isPending) return;
    if (user || getBearerToken()) {
      navigate({ to: redirect as "/studio" });
    }
  }, [user, isPending, redirect, navigate, authEnabled]);

  const onBetterAuth = async (providerId: string, label: string) => {
    setError(null);
    setBusyId(providerId);
    setStatus(`Otváram ${label}…`);
    try {
      await signIn(providerId, {
        callbackURL: redirect,
        errorCallbackURL: `/login?redirect=${encodeURIComponent(redirect)}`,
      });
      setStatus("Hotovo — presmerovávam…");
      navigate({ to: redirect as "/studio" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Prihlásenie zlyhalo";
      setError(msg);
      setStatus(null);
      toast.error("Prihlásenie zlyhalo", { description: msg });
    } finally {
      setBusyId(null);
    }
  };

  const onSupabase = async (p: "google" | "github") => {
    setError(null);
    setBusyId(p);
    setStatus(`Otváram ${p} cez Supabase…`);
    try {
      await signInWithSupabaseOAuth(p, redirect);
      // browser navigates to provider
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Supabase OAuth zlyhal";
      setError(msg);
      setStatus(null);
      toast.error("Prihlásenie zlyhalo", { description: msg });
      setBusyId(null);
    }
  };

  return (
    <main className="min-h-dvh grid place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-brutalist)]">
          <div className="flex flex-col items-center text-center gap-3 mb-8">
            <CozyLogo size="lg" variant="seal" />
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-[0.18em]">
                CAI
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Prihlás sa a otvor Studio
              </p>
              <p className="mt-2 text-[11px] font-mono text-muted-foreground uppercase tracking-wide">
                auth: {provider}
              </p>
            </div>
          </div>

          {authEnabled ? (
            <div className="space-y-3">
              {isPending && (
                <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Kontrolujem reláciu…
                </p>
              )}

              {provider === "supabase" ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 rounded-xl"
                    disabled={Boolean(busyId) || isPending}
                    onClick={() => void onSupabase("google")}
                  >
                    {busyId === "google" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null}
                    Continue with Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 rounded-xl"
                    disabled={Boolean(busyId) || isPending}
                    onClick={() => void onSupabase("github")}
                  >
                    {busyId === "github" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : null}
                    Continue with GitHub
                  </Button>
                  <p className="pt-2 text-center text-xs text-muted-foreground leading-relaxed">
                    Cesta A · Supabase Auth. Po Googli ťa vrátime na Studio.
                    V Supabase Dashboard zapni Google provider a Redirect URL:{" "}
                    <code className="text-[10px]">/auth/callback</code>
                  </p>
                </>
              ) : (
                <>
                  {GROK_PROVIDERS.map((p) => (
                    <Button
                      key={p.providerId}
                      type="button"
                      variant="outline"
                      className="w-full h-11 rounded-xl justify-center font-medium"
                      disabled={Boolean(busyId) || isPending}
                      onClick={() => void onBetterAuth(p.providerId, p.label)}
                    >
                      {busyId === p.providerId ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Prihlasujem…
                        </>
                      ) : (
                        <>Continue with {p.label}</>
                      )}
                    </Button>
                  ))}
                  <p className="pt-2 text-center text-xs text-muted-foreground leading-relaxed">
                    Cesta B · Better Auth (Grok broker). Pop-up na sandboxe;
                    na Verceli plný redirect.
                  </p>
                </>
              )}

              {status && (
                <p className="text-center text-sm text-choco font-medium leading-relaxed px-1">
                  {status}
                </p>
              )}
              {error && (
                <div className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger leading-relaxed">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 text-center">
              <p className="text-sm text-muted-foreground">
                Prihlásenie je vypnuté. Studio beží v dev režime.
              </p>
              <Button asChild className="w-full h-11 rounded-xl">
                <Link to="/studio">Pokračovať do Studia</Link>
              </Button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >
              ← Späť na úvod
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
