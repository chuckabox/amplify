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
  sm: "h-[18px]",
  md: "h-[24px]",
  lg: "h-[32px]",
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
  const h = SIZES[size];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.webp"
      alt="Tonnage"
      className={cn("w-auto object-contain", h, className)}
    />
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
      aria-label="Tonnage: home"
      className={cn(
        "inline-flex rounded-[2px] transition-opacity duration-200 ease-docket hover:opacity-70",
        className,
      )}
    >
      <Wordmark size={size} tone={tone} />
    </Link>
  );
}
