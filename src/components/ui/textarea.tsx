import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-[3px] border border-rule-strong bg-paper-raised px-3 py-2.5 text-base leading-relaxed text-ink shadow-press transition-[border-color,box-shadow] duration-200 ease-docket outline-none",
        "placeholder:text-ink-faint",
        "focus-visible:border-ink focus-visible:shadow-[inset_0_1px_2px_rgb(58_46_18_/_0.1)]",
        "disabled:cursor-not-allowed disabled:bg-paper-sunk disabled:opacity-55",
        "aria-invalid:border-tier-3 aria-invalid:bg-tier-3-wash/40",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
