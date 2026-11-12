import { cva } from "class-variance-authority"

export const sidebarVariants = cva("hidden min-h-0 shrink-0 flex-col border-glob-border bg-glob-surface lg:flex", {
  variants: {
    side: {
      left: "border-r",
      right: "border-l",
    },
    width: {
      sm: "w-48",
      md: "w-56",
      lg: "w-64",
    },
  },
  defaultVariants: { side: "left", width: "md" },
})