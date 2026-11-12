import { cva } from "class-variance-authority"

export const radioVariants = cva(
  "peer shrink-0 cursor-pointer appearance-none rounded-full border border-glob-border-strong bg-glob-surface transition-colors checked:border-glob-primary checked:bg-glob-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)