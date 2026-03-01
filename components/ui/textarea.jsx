import * as React from "react"

import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-full rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "min-h-16 px-3 py-2 text-base md:text-sm",
        xs: "min-h-8 rounded-md px-2 py-1 text-xs",
        sm: "min-h-10 rounded-md px-2.5 py-1.5 text-sm",
        lg: "min-h-20 rounded-md px-4 py-3 text-lg md:text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Textarea({
  className,
  size = "default",
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      data-size={size}
      className={cn(textareaVariants({ size }), className)}
      {...props} />
  );
}

export { Textarea, textareaVariants }
