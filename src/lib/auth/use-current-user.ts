import { useEffect, useState } from "react";
import { authClient } from "./client";
import { resolveAuthProvider, authEnabledResolved } from "./mode";
import {
  getSupabaseBrowser,
  mapSupabaseUser,
  type SupabaseAppUser,
} from "./supabase-browser";

export type AppUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  profileImageUrl: string | null;
  isDevFallback: boolean;
};

export const DEV_USER: AppUser = {
  id: "dev-user",
  displayName: "Dev User",
  primaryEmail: "dev@example.com",
  profileImageUrl: null,
  isDevFallback: true,
};

export type CurrentUserState = {
  user: AppUser | null;
  isPending: boolean;
};

export const authEnabled = authEnabledResolved("client");

export function useCurrentUserState(): CurrentUserState {
  const provider = resolveAuthProvider("client");

  if (provider === "none") {
    return { user: DEV_USER, isPending: false };
  }

  if (provider === "supabase") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSupabaseUserState();
  }

  // better-auth
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, isPending } = authClient.useSession();
  const user = data?.user;
  return {
    user: user
      ? {
          id: user.id,
          displayName: user.name ?? null,
          primaryEmail: user.email ?? null,
          profileImageUrl: user.image ?? null,
          isDevFallback: false,
        }
      : null,
    isPending,
  };
}

function useSupabaseUserState(): CurrentUserState {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isPending, setPending] = useState(true);

  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) {
      setUser(null);
      setPending(false);
      return;
    }
    let alive = true;
    sb.auth.getSession().then(({ data }) => {
      if (!alive) return;
      const u = data.session?.user;
      setUser(
        u
          ? { ...mapSupabaseUser(u), isDevFallback: false }
          : null,
      );
      setPending(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      setUser(u ? { ...mapSupabaseUser(u), isDevFallback: false } : null);
      setPending(false);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isPending };
}

export function useCurrentUser(): AppUser | null {
  return useCurrentUserState().user;
}

// re-export for typing
export type { SupabaseAppUser };
