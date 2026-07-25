import { cn } from "@/lib/utils";

type Tier = 1 | 2 | 3;

/*
  A stamped tier mark. Square, tracked caps, a solid ink rule on the leading
  edge — the way a routing decision gets stamped onto a paper docket. The three
  printed inks (green / amber / oxide) are the only colour the product uses
  beyond the single yellow accent, so tier always means tier.
*/
const config: Record<
  Tier,
  { label: string; wash: string; ink: string; bar: string }
> = {
  1: {
    label: "Tier 1 · cleared",
    wash: "bg-tier-1-wash",
    ink: "text-tier-1-ink",
    bar: "bg-tier-1",
  },
  2: {
    label: "Tier 2 · remote",
    wash: "bg-tier-2-wash",
    ink: "text-tier-2-ink",
    bar: "bg-tier-2",
  },
  3: {
    label: "Tier 3 · in person",
    wash: "bg-tier-3-wash",
    ink: "text-tier-3-ink",
    bar: "bg-tier-3",
  },
};

export function TierBadge({
  tier,
  label,
  className,
}: {
  tier: Tier;
  label?: string;
  className?: string;
}) {
  const c = config[tier];
  return (
    <span
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-[2px]",
        className,
      )}
    >
      <span className={cn("w-[3px] shrink-0", c.bar)} aria-hidden />
      <span
        className={cn(
          "px-2 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase",
          c.wash,
          c.ink,
        )}
      >
        {label ?? c.label}
      </span>
    </span>
  );
}

const findingConfig = {
  clear: { wash: "bg-tier-1-wash", ink: "text-tier-1-ink", bar: "bg-tier-1" },
  advisory: { wash: "bg-tier-2-wash", ink: "text-tier-2-ink", bar: "bg-tier-2" },
  action: { wash: "bg-tier-3-wash", ink: "text-tier-3-ink", bar: "bg-tier-3" },
} as const;

/** Same stamp language, applied to an individual finding's status. */
export function StatusStamp({
  status,
  className,
}: {
  status: keyof typeof findingConfig;
  className?: string;
}) {
  const c = findingConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-[2px]",
        className,
      )}
    >
      <span className={cn("w-[3px] shrink-0", c.bar)} aria-hidden />
      <span
        className={cn(
          "px-2 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase",
          c.wash,
          c.ink,
        )}
      >
        {status}
      </span>
    </span>
  );
}
