import { cva } from "class-variance-authority"

export const labelVariants = cva(
  "inline-flex items-center gap-1 font-medium leading-none text-glob-text peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)