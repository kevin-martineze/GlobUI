import { cva } from "class-variance-authority"

export const avatarVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden bg-glob-surface-hover font-medium text-glob-text",
  {
    variants: {
      size: {
        sm: "h-8 w-8 text-xs",
        md: "h-10 w-10 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-glob-md",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
    },
  }
)