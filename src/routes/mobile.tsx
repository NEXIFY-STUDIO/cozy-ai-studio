import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, X, Bell } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mobile")({
  component: MobileCompanionPage,
  head: () => ({
    meta: [{ title: "Mobile Companion — COSY" }],
  }),
});

interface ReviewCard {
  id: string;
  title: string;
  files: string[];
  summary: string;
}

const initial: ReviewCard[] = [
  {
    id: "1",
    title: "Pricing section with 3 tiers",
    files: ["src/App.tsx"],
    summary: "G2 audit passed. Terracotta CTAs + brutalist shadows ready for review.",
  },
  {
    id: "2",
    title: "Sticky glass navigation",
    files: ["src/App.tsx", "src/styles.css"],
    summary: "Mobile menu affordance + sticky blur header.",
  },
  {
    id: "3",
    title: "Contact form shell",
    files: ["src/App.tsx"],
    summary: "Client validation + success state. No OWASP issues.",
  },
];

function MobileCompanionPage() {
  const [cards, setCards] = useState(initial);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const top = cards[0];

  const decide = (approved: boolean) => {
    if (!top) return;
    setCards((c) => c.slice(1));
    setDragX(0);
    toast.success(approved ? `Approved: ${top.title}` : `Rejected: ${top.title}`, {
      description: "Desktop studio will sync via realtime gateway (demo)",
    });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    setStartX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragX(e.clientX - startX);
  };
  const onPointerUp = () => {
    setDragging(false);
    if (dragX > 100) decide(true);
    else if (dragX < -100) decide(false);
    else setDragX(0);
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <header className="flex items-center justify-between border-b border-border px-4 h-14">
        <Link to="/studio" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Studio
        </Link>
        <span className="font-serif font-bold text-sm">Remote Review</span>
        <button type="button" className="relative p-2 text-muted-foreground" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {cards.length > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-terracotta" />
          )}
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full">
        <p className="text-xs text-muted-foreground mb-4 text-center">
          Swipe right to approve · left to reject
        </p>

        {top ? (
          <div
            className="w-full touch-none select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <div
              className={cn(
                "rounded-2xl border-l-8 border-l-terracotta border border-border bg-card p-6 shadow-[var(--shadow-elevated)] transition-transform",
                !dragging && "duration-200",
              )}
              style={{
                transform: `translateX(${dragX}px) rotate(${dragX * 0.04}deg)`,
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-terracotta mb-2">
                Pending review · {cards.length} left
              </p>
              <h2 className="font-serif text-2xl font-bold mb-2">{top.title}</h2>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{top.summary}</p>
              <div className="rounded-xl bg-muted/60 p-3 mb-6">
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">FILES</p>
                {top.files.map((f) => (
                  <p key={f} className="font-mono text-xs text-terracotta">
                    {f}
                  </p>
                ))}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  className="flex-1 min-h-12"
                  onClick={() => decide(false)}
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
                <Button className="flex-1 min-h-12" onClick={() => decide(true)}>
                  <Check className="h-4 w-4" />
                  Approve
                </Button>
              </div>
            </div>
            <div className="flex justify-between mt-3 px-2 text-xs font-medium">
              <span
                className={cn(
                  "text-danger",
                  dragX < -40 ? "opacity-100" : "opacity-30",
                )}
              >
                ← Reject
              </span>
              <span
                className={cn(
                  "text-success",
                  dragX > 40 ? "opacity-100" : "opacity-30",
                )}
              >
                Approve →
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-serif text-2xl font-bold mb-2">Inbox clear</p>
            <p className="text-sm text-muted-foreground mb-6">
              No pending agent decisions. Push notifications will arrive via FCM when desktop
              finishes a run.
            </p>
            <Link to="/studio">
              <Button>Back to studio</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
