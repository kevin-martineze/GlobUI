import { cva } from "class-variance-authority"

export const phoneInputVariants = cva(
  "flex items-center rounded-glob-md border border-glob-border bg-glob-surface transition-colors has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-glob-ring has-[input:focus-visible]:ring-offset-0 has-[[aria-disabled=true]]:opacity-50 has-[[aria-disabled=true]]:cursor-not-allowed has-[input[aria-invalid=true]]:border-glob-danger has-[input[aria-invalid=true]]:has-[input:focus-visible]:ring-glob-danger",
  {
    variants: {
      size: {
        sm: "h-8",
        md: "h-10",
        lg: "h-12",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)