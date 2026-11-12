import { cva } from "class-variance-authority"

export const spinnerVariants = cva("shrink-0 animate-spin", {
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
})