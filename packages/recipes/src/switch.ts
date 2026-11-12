import { cva } from "class-variance-authority"

export const switchVariants = cva(
  "group inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-glob-border-strong transition-colors data-[state=checked]:bg-glob-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-glob-danger",
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-13",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)
export const thumbVariants = cva(
  "pointer-events-none block translate-x-0 rounded-full bg-white shadow-glob-sm transition-transform",
  {
    variants: {
      size: {
        sm: "h-4 w-4 group-data-[state=checked]:translate-x-4",
        md: "h-5 w-5 group-data-[state=checked]:translate-x-5",
        lg: "h-6 w-6 group-data-[state=checked]:translate-x-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)