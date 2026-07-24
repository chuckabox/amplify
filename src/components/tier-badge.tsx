import { cn } from "@/lib/utils";

type Tier = 1 | 2 | 3;

const config: Record<
  Tier,
  { label: string; className: string; dot: string }
> = {
  1: {
    label: "Tier 1",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    dot: "bg-emerald-500",
  },
  2: {
    label: "Tier 2",
    className: "bg-amber-50 text-amber-700 ring-amber-600/15",
    dot: "bg-amber-500",
  },
  3: {
    label: "Tier 3",
    className: "bg-rose-50 text-rose-700 ring-rose-600/15",
    dot: "bg-rose-500",
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
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        c.className,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {label ?? c.label}
    </span>
  );
}
