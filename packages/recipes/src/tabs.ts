import { cva } from "class-variance-authority"

export const listVariants = cva("flex", {
  variants: {
    variant: {
      underline: "",
      pill: "rounded-glob-md border border-glob-border bg-glob-surface-secondary p-0.5",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  compoundVariants: [
    { variant: "underline", orientation: "horizontal", className: "border-b border-glob-border" },
    { variant: "underline", orientation: "vertical", className: "border-r border-glob-border" },
    { variant: "pill", orientation: "horizontal", className: "inline-flex self-start" },
  ],
})
export const triggerVariants = cva(
  "inline-flex h-9 items-center justify-center whitespace-nowrap px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        underline:
          "border-transparent text-glob-text-secondary hover:text-glob-text data-[state=active]:border-glob-primary data-[state=active]:text-glob-text",
        pill: "rounded-glob-sm text-glob-text-secondary hover:text-glob-text data-[state=active]:bg-glob-primary data-[state=active]:text-glob-primary-foreground data-[state=active]:shadow-glob-sm",
      },
      orientation: {
        horizontal: "",
        vertical: "justify-start",
      },
    },
    compoundVariants: [
      { variant: "underline", orientation: "horizontal", className: "-mb-px border-b-2" },
      { variant: "underline", orientation: "vertical", className: "-mr-px border-r-2" },
    ],
  }
)