import { cva } from "class-variance-authority"

export const textareaVariants = cva(
  "w-full rounded-glob-md border border-glob-border bg-glob-surface px-3 py-2 text-glob-text placeholder:text-glob-text-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-glob-danger aria-[invalid=true]:focus-visible:ring-glob-danger",
  {
    variants: {
      size: {
        sm: "min-h-16 text-xs",
        md: "min-h-20 text-sm",
        lg: "min-h-24 text-base",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        both: "resize",
      },
    },
    defaultVariants: {
      size: "md",
      resize: "vertical",
    },
  }
)