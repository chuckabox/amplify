import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Square stamped labels, not pills. Tracked-out caps, as a form would set them.
const badgeVariants = cva(
  "group/badge inline-flex h-[22px] w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-[2px] border border-transparent px-2 text-[10px] font-semibold tracking-[0.1em] uppercase whitespace-nowrap transition-colors duration-200 ease-docket [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-ink text-paper",
        accent: "bg-accent text-ink",
        secondary: "bg-paper-sunk text-ink-muted",
        outline: "border-rule-strong bg-paper-raised text-ink-muted",
        destructive: "bg-tier-3-wash text-tier-3-ink",
        ghost: "text-ink-muted hover:bg-paper-sunk",
        link: "text-accent-ink underline underline-offset-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
