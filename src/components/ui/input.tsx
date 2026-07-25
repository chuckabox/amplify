import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

// A field on a printed docket: recessed stock, hairline rule, square corner.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-[3px] border border-rule-strong bg-paper-raised px-3 text-base text-ink shadow-press transition-[border-color,box-shadow] duration-200 ease-docket outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink",
        "placeholder:text-ink-faint",
        "focus-visible:border-ink focus-visible:shadow-[inset_0_1px_2px_rgb(58_46_18_/_0.1)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-paper-sunk disabled:opacity-55",
        "aria-invalid:border-tier-3 aria-invalid:bg-tier-3-wash/40",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
