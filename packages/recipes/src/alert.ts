import { cva } from "class-variance-authority"

export const alertVariants = cva("relative flex w-full gap-3 rounded-glob-lg border p-4 text-sm text-glob-text", {
  variants: {
    variant: {
      default: "border-glob-border bg-glob-surface",
      info: "border-glob-info/30 bg-glob-info-light",
      success: "border-glob-success/30 bg-glob-success-light",
      warning: "border-glob-warning/30 bg-glob-warning-light",
      danger: "border-glob-danger/30 bg-glob-danger-light",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})