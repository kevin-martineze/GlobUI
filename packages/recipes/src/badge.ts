import { cva } from "class-variance-authority"

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-medium",
  {
    variants: {
      variant: {
        default: "border-glob-border bg-glob-surface-secondary text-glob-text",
        primary: "border-transparent bg-glob-primary text-glob-primary-foreground",
        secondary: "border-transparent bg-glob-text text-glob-surface",
        outline: "border-glob-border bg-transparent text-glob-text",
        success: "border-transparent bg-glob-success-light text-glob-success",
        warning: "border-transparent bg-glob-warning-light text-glob-warning",
        danger: "border-transparent bg-glob-danger-light text-glob-danger",
        info: "border-transparent bg-glob-info-light text-glob-info",
      },
      size: {
        sm: "h-5 px-2 text-xs",
        md: "h-6 px-2.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)