import { cn } from "@/lib/utils";
import { CaiMonogram } from "@/components/brand/CaiMonogram";

type Props = {
  className?: string;
  /** Show wordmark next to mark */
  withWordmark?: boolean;
  /** Compact header size */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * seal — circular CAI badge (default, CIA-style)
   * word — wide CAI lettermark
   * stack — CAI + STUDIO
   * glass — legacy 3D chocolate C asset (hero only)
   */
  variant?: "seal" | "word" | "stack" | "glass" | "cai" | "mark";
  wordmarkClassName?: string;
};

/**
 * Primary brand mark: enterprise CAI monogram (CIA-style).
 * `glass` keeps the optional 3D chocolate asset for marketing hero.
 */
export function CozyLogo({
  className,
  withWordmark = false,
  size = "sm",
  variant = "seal",
  wordmarkClassName,
}: Props) {
  // map legacy glass variants
  if (variant === "glass" || variant === "cai") {
    const px = { sm: 32, md: 40, lg: 56, xl: 80 } as const;
    const box = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-14 w-14",
      xl: "h-20 w-20",
    } as const;
    return (
      <span className={cn("inline-flex items-center gap-2.5 min-w-0", className)}>
        <img
          src="/brand/cai-logo.png"
          alt="CAI — Cozy AI Studio"
          width={px[size]}
          height={px[size]}
          className={cn(box[size], "object-contain select-none drop-shadow-md")}
          draggable={false}
        />
        {withWordmark && (
          <Wordmark className={wordmarkClassName} />
        )}
      </span>
    );
  }

  if (variant === "mark") {
    return (
      <span className={cn("inline-flex items-center gap-2.5 min-w-0", className)}>
        <CaiMonogram size={size === "xl" ? "lg" : size} variant="seal" />
        {withWordmark && <Wordmark className={wordmarkClassName} />}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5 min-w-0", className)}>
      <CaiMonogram
        size={size === "xl" ? "xl" : size}
        variant={variant === "word" || variant === "stack" ? variant : "seal"}
      />
      {withWordmark && <Wordmark className={wordmarkClassName} />}
    </span>
  );
}

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("min-w-0 leading-none", className)}>
      <span className="block font-serif text-base font-bold tracking-[0.2em] truncate">
        CAI
      </span>
      <span className="mt-0.5 block text-xs text-muted-foreground font-mono">
        Cozy AI Studio
      </span>
    </span>
  );
}

/** Neon green check — matches status icons on dark UI */
export function IconCheckGreen({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-4 w-4", className)}
      aria-hidden
    >
      <path
        d="M5.5 12.5 10 17l8.5-9.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
