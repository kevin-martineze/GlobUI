import { cva } from "class-variance-authority"

export const sheetVariants = cva(
  [
    // Pinned to its edge: the native dialog margin and max sizes are reset here, the side adds the edge.
    "m-0 h-full max-h-none w-[calc(100%-3rem)] max-w-none overflow-visible rounded-none border-glob-border bg-glob-surface p-0 text-glob-text shadow-glob-md",
    // Slide in from its edge. @starting-style sets the start; transition-discrete keeps display alive on exit.
    "transition-[translate,overlay,display] transition-discrete duration-300 ease-out",
    "backdrop:bg-glob-overlay backdrop:opacity-0 backdrop:transition-[opacity,overlay,display] backdrop:transition-discrete backdrop:duration-200",
    "open:backdrop:opacity-100 starting:open:backdrop:opacity-0",
    "motion-reduce:transition-none motion-reduce:backdrop:transition-none",
  ],
  {
    variants: {
      side: {
        right: "border-l inset-y-0 left-auto right-0 translate-x-full open:translate-x-0 starting:open:translate-x-full",
        left: "border-r inset-y-0 left-0 right-auto -translate-x-full open:translate-x-0 starting:open:-translate-x-full",
        top: "border-b inset-x-0 top-0 bottom-auto h-auto max-h-[85dvh] w-full -translate-y-full open:translate-y-0 starting:open:-translate-y-full",
        bottom: "border-t inset-x-0 top-auto bottom-0 h-auto max-h-[85dvh] w-full translate-y-full open:translate-y-0 starting:open:translate-y-full",
      },
      // Only applies to left and right (see compoundVariants): top and bottom are full width.
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    compoundVariants: [
      { side: ["left", "right"], size: "sm", className: "max-w-xs" },
      { side: ["left", "right"], size: "md", className: "max-w-sm" },
      { side: ["left", "right"], size: "lg", className: "max-w-md" },
    ],
    defaultVariants: {
      side: "right",
      size: "md",
    },
  }
)