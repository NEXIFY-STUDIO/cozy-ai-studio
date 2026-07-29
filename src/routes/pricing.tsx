import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useStudioStore, type PlanTier } from "@/stores/studio-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [{ title: "Pricing — COSY Studio" }],
  }),
});

const tiers: {
  id: PlanTier;
  name: string;
  price: string;
  blurb: string;
  features: string[];
  highlight?: boolean;
}[] = [
  {
    id: "FREE",
    name: "Free",
    price: "$0",
    blurb: "Explore the studio",
    features: ["100 AI prompts / month", "G0 Planner only", "Community showcase", "Mobile companion"],
  },
  {
    id: "PRO",
    name: "Pro",
    price: "$29",
    blurb: "For serious builders",
    features: [
      "Unlimited prompts (fair use)",
      "Full G0 → G1 → G2 pipeline",
      "Claude / GPT-4o class models",
      "Live multi-device preview",
      "1-click publish",
    ],
    highlight: true,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    price: "$49",
    blurb: "Per seat / month",
    features: [
      "Everything in Pro",
      "Priority GPU queue",
      "Team real-time CRDTs",
      "SSO & audit logs",
      "Custom fine-tunes",
    ],
  },
];

function PricingPage() {
  const planTier = useStudioStore((s) => s.planTier);
  const setPlanTier = useStudioStore((s) => s.setPlanTier);

  const select = (tier: PlanTier) => {
    setPlanTier(tier);
    toast.success(`Plan set to ${tier}`, {
      description:
        tier === "FREE"
          ? "Stripe checkout skipped in demo mode"
          : "Demo: subscription activated without Stripe charge",
    });
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <p className="text-xs font-semibold tracking-wide text-terracotta uppercase mb-2">
          Monetization
        </p>
        <h1 className="font-serif text-4xl font-bold mb-2">Simple plans. Honest compute.</h1>
        <p className="text-muted-foreground mb-10 max-w-lg">
          Current plan:{" "}
          <span className="font-semibold text-foreground font-mono">{planTier}</span>
          . Stripe webhooks are simulated for this demo.
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {tiers.map((tier) => (
            <article
              key={tier.id}
              className={cn(
                "flex flex-col rounded-2xl border bg-card p-6",
                tier.highlight
                  ? "border-terracotta border-2 shadow-[var(--shadow-brutalist)]"
                  : "border-border shadow-sm",
              )}
            >
              {tier.highlight && (
                <span className="mb-3 inline-block w-fit rounded-full bg-terracotta/15 px-2.5 py-0.5 text-xs font-semibold text-terracotta">
                  Recommended
                </span>
              )}
              <h2 className="font-serif text-xl font-bold">{tier.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{tier.blurb}</p>
              <p className="mt-4 mb-6">
                <span className="font-serif text-4xl font-bold">{tier.price}</span>
                <span className="text-sm text-muted-foreground"> / mo</span>
              </p>
              <ul className="space-y-2.5 text-sm mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="h-4 w-4 text-terracotta shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={tier.highlight ? "default" : "outline"}
                className="w-full"
                onClick={() => select(tier.id)}
                disabled={planTier === tier.id}
              >
                {planTier === tier.id ? "Current plan" : `Choose ${tier.name}`}
              </Button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
