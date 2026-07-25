import { cn } from "@/lib/utils";

/**
 * A composed "nothing here yet" panel rather than a blank region. Always says
 * what would fill it and offers the action that does so.
 */
function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-[4px] border border-dashed border-rule-strong bg-paper-sunk/40 px-7 py-10",
        className,
      )}
    >
      {/* a blank docket, ruled but unfilled */}
      <div className="flex w-full max-w-[180px] flex-col gap-2" aria-hidden>
        <span className="h-[3px] w-full bg-rule-strong" />
        <span className="h-px w-full bg-rule" />
        <span className="h-px w-4/5 bg-rule" />
        <span className="h-px w-3/5 bg-rule" />
      </div>
      <div>
        <h3 className="text-[0.9375rem] font-semibold text-ink">{title}</h3>
        <p className="mt-1.5 max-w-[52ch] text-sm leading-relaxed text-ink-muted">
          {body}
        </p>
      </div>
      {action}
    </div>
  );
}

export { EmptyState };
