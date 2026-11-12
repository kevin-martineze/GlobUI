import { cva } from "class-variance-authority"

export const inputVariants = cva(
  "w-full rounded-glob-md border border-glob-border bg-glob-surface px-3 py-2 text-sm text-glob-text placeholder:text-glob-text-secondary transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-glob-danger aria-[invalid=true]:focus-visible:ring-glob-danger",
  {
    variants: {
      size: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)