import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  /** seal = circular agency badge; word = CAI caps; stack = CAI + STUDIO */
  variant?: "seal" | "word" | "stack";
  tone?: "brand" | "ink" | "on-dark";
  title?: string;
};

const sealBox = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-[4.5rem] w-[4.5rem]",
  xl: "h-28 w-28",
} as const;

const sealType = {
  sm: "text-[0.62rem] tracking-[0.14em]",
  md: "text-[0.72rem] tracking-[0.16em]",
  lg: "text-[1.05rem] tracking-[0.18em]",
  xl: "text-[1.55rem] tracking-[0.2em]",
} as const;

const wordType = {
  sm: "text-lg tracking-[0.28em]",
  md: "text-xl tracking-[0.3em]",
  lg: "text-3xl tracking-[0.32em]",
  xl: "text-5xl tracking-[0.34em]",
} as const;

/**
 * Enterprise CAI monogram — CIA / agency style lettermark.
 * CSS + HTML (reliable fonts), not a lone “C”.
 */
export function CaiMonogram({
  className,
  size = "sm",
  variant = "seal",
  tone = "brand",
  title = "CAI — Cozy AI Studio",
}: Props) {
  const ink =
    tone === "on-dark"
      ? "text-white"
      : tone === "ink"
        ? "text-charcoal dark:text-zinc-100"
        : "text-choco-dark dark:text-choco";

  const ring =
    tone === "on-dark"
      ? "border-white/50"
      : "border-choco/55 dark:border-choco/70";

  const disc =
    tone === "on-dark"
      ? "bg-white/10"
      : "bg-choco/[0.08] dark:bg-choco/15";

  if (variant === "word") {
    return (
      <span
        role="img"
        aria-label={title}
        title={title}
        className={cn(
          "inline-flex flex-col items-center justify-center select-none",
          ink,
          className,
        )}
      >
        <span
          className={cn(
            "font-serif font-bold leading-none uppercase",
            wordType[size],
          )}
        >
          CAI
        </span>
        <span
          className={cn(
            "mt-1 block h-px w-[85%] max-w-[8rem]",
            tone === "on-dark" ? "bg-white/40" : "bg-choco/40",
          )}
        />
      </span>
    );
  }

  if (variant === "stack") {
    return (
      <span
        role="img"
        aria-label={title}
        title={title}
        className={cn(
          "inline-flex flex-col items-center justify-center select-none gap-1.5",
          ink,
          className,
        )}
      >
        <span
          className={cn(
            "font-serif font-bold leading-none uppercase",
            size === "xl"
              ? "text-5xl tracking-[0.28em]"
              : size === "lg"
                ? "text-4xl tracking-[0.26em]"
                : "text-2xl tracking-[0.24em]",
          )}
        >
          CAI
        </span>
        <span
          className={cn(
            "h-px w-16 sm:w-20",
            tone === "on-dark" ? "bg-white/40" : "bg-choco/45",
          )}
        />
        <span
          className={cn(
            "font-sans font-semibold uppercase text-[0.65rem] sm:text-xs tracking-[0.42em] opacity-80",
          )}
        >
          Studio
        </span>
      </span>
    );
  }

  // Circular seal — institutional badge (CIA-inspired)
  return (
    <span
      role="img"
      aria-label={title}
      title={title}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center select-none rounded-full border-2",
        sealBox[size],
        ring,
        disc,
        "shadow-[var(--shadow-brutalist-sm)]",
        className,
      )}
    >
      {/* inner ring */}
      <span
        className={cn(
          "pointer-events-none absolute inset-[3px] rounded-full border",
          tone === "on-dark" ? "border-white/25" : "border-choco/25",
        )}
      />
      <span
        className={cn(
          "relative font-serif font-bold uppercase leading-none",
          sealType[size],
          ink,
        )}
      >
        CAI
      </span>
    </span>
  );
}

export function CaiBrandLink({
  className,
  size = "sm",
  showWord = true,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWord?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 min-w-0", className)}>
      <CaiMonogram size={size} variant="seal" />
      {showWord && (
        <span className="min-w-0 leading-none hidden sm:block">
          <span className="block font-serif text-base font-bold tracking-[0.2em] truncate">
            CAI
          </span>
          <span className="mt-0.5 block text-[11px] text-muted-foreground font-mono tracking-wide">
            Cozy AI Studio
          </span>
        </span>
      )}
    </span>
  );
}
