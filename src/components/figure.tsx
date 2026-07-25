import { cn } from "@/lib/utils";

/**
 * A single reported number. Set in the mono face with tabular figures so that
 * a row of these aligns on the decimal, under a tracked-out field label —
 * the way a figure is reported on a printed inspection sheet.
 */
export function Figure({
  label,
  value,
  unit,
  note,
  tone = "ink",
  className,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  note?: string;
  tone?: "ink" | "tier-1" | "tier-2" | "tier-3" | "accent";
  className?: string;
}) {
  const toneClass = {
    ink: "text-ink",
    "tier-1": "text-tier-1-ink",
    "tier-2": "text-tier-2-ink",
    "tier-3": "text-tier-3-ink",
    accent: "text-accent-ink",
  }[tone];

  return (
    <div className={cn("flex flex-col", className)}>
      <span className="field-label">{label}</span>
      <span
        className={cn(
          "mt-2.5 flex items-baseline gap-1 font-mono text-[1.75rem] leading-none font-medium tabular-nums tracking-[-0.03em]",
          toneClass,
        )}
      >
        {value}
        {unit && (
          <span className="text-sm font-normal text-ink-muted">{unit}</span>
        )}
      </span>
      {note && (
        <span className="mt-2 text-xs leading-relaxed text-ink-muted">
          {note}
        </span>
      )}
    </div>
  );
}
