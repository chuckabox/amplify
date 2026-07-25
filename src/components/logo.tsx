import Link from "next/link";
import { cn } from "@/lib/utils";

/*
  The Weighbridge wordmark.

  There is no icon. The mark is the word sitting on its deck — a signal-yellow
  plate ruled beneath the type, with the pit showing as a break at each end.
  It carries the whole metaphor typographically: the load rests on the plate,
  the plate reads it, most loads roll straight off.
*/

const SIZES = {
  sm: { text: "text-[15px]", deck: "h-[2px]", gap: "gap-[3px]" },
  md: { text: "text-[19px]", deck: "h-[2.5px]", gap: "gap-[4px]" },
  lg: { text: "text-[26px]", deck: "h-[3px]", gap: "gap-[6px]" },
} as const;

export function Wordmark({
  className,
  size = "md",
  tone = "ink",
}: {
  className?: string;
  size?: keyof typeof SIZES;
  tone?: "ink" | "paper";
}) {
  const s = SIZES[size];
  return (
    <span className={cn("inline-flex flex-col", s.gap, className)}>
      <span
        className={cn(
          "font-display leading-none",
          s.text,
          tone === "paper" ? "text-paper" : "text-ink",
        )}
        style={{
          fontVariationSettings: '"SOFT" 0, "WONK" 1, "opsz" 144',
          fontWeight: 600,
          letterSpacing: "-0.028em",
        }}
      >
        Tonnage
      </span>
      {/* the deck, broken at each end where the pit is */}
      <span className={cn("flex w-full items-stretch gap-[2px]", s.deck)} aria-hidden>
        <span className="w-[7%] bg-current opacity-25" />
        <span className="flex-1 bg-accent" />
        <span className="w-[7%] bg-current opacity-25" />
      </span>
    </span>
  );
}

export function Logo({
  className,
  href = "/",
  size = "md",
  tone = "ink",
}: {
  className?: string;
  href?: string;
  size?: keyof typeof SIZES;
  tone?: "ink" | "paper";
}) {
  return (
    <Link
      href={href}
      aria-label="Tonnage — home"
      className={cn(
        "inline-flex rounded-[2px] transition-opacity duration-200 ease-docket hover:opacity-70",
        className,
      )}
    >
      <Wordmark size={size} tone={tone} />
    </Link>
  );
}
