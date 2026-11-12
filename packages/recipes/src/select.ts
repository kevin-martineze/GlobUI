import { cva } from "class-variance-authority"

export const selectVariants = cva(
  "flex w-full cursor-pointer items-center justify-between rounded-glob-md border bg-glob-surface px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-[invalid=true]:border-glob-danger aria-[invalid=true]:focus-visible:ring-glob-danger",
  {
    variants: {
      variant: {
        default: "border-glob-border",
        ghost: "border-transparent hover:bg-glob-surface-hover",
        outline: "border-glob-border bg-transparent hover:bg-glob-surface-hover",
      },
      size: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)