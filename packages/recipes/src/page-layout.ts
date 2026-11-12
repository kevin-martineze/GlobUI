import { cva } from "class-variance-authority"

export const contentVariants = cva("flex min-w-0 flex-1 flex-col gap-6", {
  variants: {
    width: {
      default: "max-w-5xl",
      wide: "max-w-7xl",
      full: "max-w-none",
    },
  },
  defaultVariants: { width: "default" },
})
export const asideVariants = cva("flex min-w-0 shrink-0 flex-col gap-4 lg:sticky lg:top-6 lg:self-start", {
  variants: {
    asideWidth: {
      sm: "lg:w-64",
      md: "lg:w-80",
    },
  },
  defaultVariants: { asideWidth: "sm" },
})