import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-glob-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-glob-primary text-glob-primary-foreground hover:bg-glob-primary-hover",
        secondary: "bg-glob-text text-glob-surface hover:opacity-80",
        danger: "bg-glob-danger text-glob-surface hover:opacity-90",
        ghost: "text-glob-text hover:bg-glob-surface-hover",
        outline: "border border-glob-border text-glob-text hover:bg-glob-surface-hover",
        link: "text-glob-primary-text underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)