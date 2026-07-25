import { cn } from "@/lib/utils";

/**
 * Inline validation message. Direct, active voice, no "Oops!" — and never
 * window.alert(). Pair with aria-invalid + aria-describedby on the control.
 */
function FieldError({
  id,
  children,
  className,
}: {
  id?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <p
      id={id}
      role="alert"
      className={cn(
        "flex items-start gap-1.5 text-[13px] leading-snug text-tier-3-ink",
        className,
      )}
    >
      <span
        className="mt-[3px] h-2.5 w-[3px] shrink-0 bg-tier-3"
        aria-hidden
      />
      {children}
    </p>
  );
}

export { FieldError };
