import { cva } from "class-variance-authority"

export const dialogVariants = cva(
  [
    "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-visible rounded-glob-lg border border-glob-border bg-glob-surface p-0 text-glob-text shadow-glob-md",
    // Enter/exit. @starting-style animates the entry; allow-discrete keeps display/overlay alive
    // during the exit. Browsers without them open and close without animation.
    "scale-95 opacity-0 transition-[opacity,scale,overlay,display] transition-discrete duration-200 ease-out",
    "open:scale-100 open:opacity-100 starting:open:scale-95 starting:open:opacity-0",
    "backdrop:bg-glob-overlay backdrop:opacity-0 backdrop:transition-[opacity,overlay,display] backdrop:transition-discrete backdrop:duration-200",
    "open:backdrop:opacity-100 starting:open:backdrop:opacity-0",
    "motion-reduce:transition-none motion-reduce:backdrop:transition-none",
  ],
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)