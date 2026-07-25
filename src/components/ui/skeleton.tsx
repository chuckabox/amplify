import { cn } from "@/lib/utils";

/**
 * Skeletons match the shape of what's loading — never a spinner in the middle
 * of an empty box. Shimmer is a slow sweep of raised stock across sunk stock.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-[2px] bg-paper-sunk",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.8s_infinite] after:bg-gradient-to-r after:from-transparent after:via-paper-raised/70 after:to-transparent",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
