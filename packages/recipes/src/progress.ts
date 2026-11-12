import { cva } from "class-variance-authority"

export const progressVariants = cva("relative w-full overflow-hidden rounded-glob-sm bg-glob-surface-hover", {
  variants: {
    size: {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
})