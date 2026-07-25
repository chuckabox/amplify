import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/*
  Docket buttons are set square, like the fields on a printed form — not the
  rounded-full pills every other product ships. Weight and fill carry the
  hierarchy instead of radius. Press gives a physical 1px drop.
*/
const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-[3px] border border-transparent text-sm font-medium whitespace-nowrap cursor-pointer transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-docket outline-none select-none active:translate-y-px disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // The workhorse: carbon ink on manila.
        default:
          "bg-ink text-paper shadow-[0_1px_2px_rgb(58_46_18_/_0.18)] hover:bg-[#22261e] hover:shadow-[0_2px_6px_rgb(58_46_18_/_0.24)] active:shadow-none",
        // Signal yellow. Reserved for the single most important action on a
        // page — if two of these are visible at once, one is wrong.
        accent:
          "bg-accent text-white shadow-[0_1px_2px_rgb(58_46_18_/_0.18)] hover:bg-accent-deep hover:shadow-[0_2px_6px_rgb(58_46_18_/_0.24)] active:shadow-none",
        outline:
          "border-rule-strong bg-paper-raised text-ink hover:border-ink hover:bg-paper-sunk",
        secondary: "bg-paper-sunk text-ink hover:bg-[#dbd0b6]",
        ghost: "text-ink-muted hover:bg-paper-sunk hover:text-ink",
        destructive:
          "border-tier-3/30 bg-tier-3-wash text-tier-3-ink hover:border-tier-3/60 hover:bg-[#e5c6bb]",
        link: "h-auto p-0 text-accent-ink underline decoration-rule-strong decoration-1 underline-offset-4 hover:decoration-ink",
      },
      size: {
        default: "h-10 gap-2 px-5",
        xs: "h-7 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3.5 text-[0.8125rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2.5 px-7 text-[0.9375rem]",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

/*
  The nested trailing icon. Sits in its own recessed tile flush with the
  button's right padding rather than floating naked beside the label, and
  translates on hover for internal kinetic tension. Pair with `group/button`.
*/
function ButtonIconWell({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "-mr-2 ml-1 flex size-6 items-center justify-center rounded-[2px] bg-current/12 transition-transform duration-200 ease-docket group-hover/button:translate-x-0.5",
        className
      )}
      aria-hidden
    >
      {children}
    </span>
  )
}

export { Button, ButtonIconWell, buttonVariants }
