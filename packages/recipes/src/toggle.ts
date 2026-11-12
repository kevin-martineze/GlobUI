import { cva } from "class-variance-authority"

export const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-glob-md font-medium text-glob-text transition-colors hover:bg-glob-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 motion-reduce:transition-none data-[state=on]:bg-glob-primary-light data-[state=on]:text-glob-text",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-glob-border bg-transparent data-[state=on]:border-glob-primary",
      },
      size: {
        sm: "h-8 px-2 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)