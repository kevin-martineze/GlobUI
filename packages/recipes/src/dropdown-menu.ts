import { cva } from "class-variance-authority"

export const itemVariants = cva(
  "relative flex cursor-default select-none items-center gap-2 rounded-glob-sm px-2 py-1.5 text-sm outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-glob-text focus:bg-glob-surface-hover",
        danger: "text-glob-danger focus:bg-glob-danger-light",
      },
      inset: {
        true: "pl-8",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      inset: false,
    },
  }
)