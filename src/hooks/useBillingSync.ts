import { useEffect, useState } from "react";
import { useStudioStore, type PlanTier } from "@/stores/studio-store";
import { authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyBilling } from "@/lib/billing/functions";

/**
 * Hydrate planTier + promptsUsed from server (subscriptions + usage_monthly).
 * Client zustand is a cache — server is source of truth when signed in.
 */
export function useBillingSync() {
  const { user, isPending } = useCurrentUserState();
  const setPlanTier = useStudioStore((s) => s.setPlanTier);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripeConfigured, setStripeConfigured] = useState(false);

  useEffect(() => {
    if (!authEnabled) return;
    if (isPending) return;
    if (!user) return;

    let cancelled = false;
    setLoading(true);
    void getMyBilling()
      .then((snap) => {
        if (cancelled) return;
        setPlanTier(snap.planTier as PlanTier);
        useStudioStore.setState({
          promptsUsed: snap.promptsUsed,
          promptLimit: snap.promptLimit,
        });
        setStripeConfigured(snap.stripeConfigured);
        setError(null);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, isPending, setPlanTier]);

  return { loading, error, stripeConfigured };
}

export async function refreshBillingFromServer() {
  const snap = await getMyBilling();
  useStudioStore.setState({
    planTier: snap.planTier as PlanTier,
    promptsUsed: snap.promptsUsed,
    promptLimit: snap.promptLimit,
  });
  return snap;
}
