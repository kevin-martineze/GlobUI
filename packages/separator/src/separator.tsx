import { forwardRef } from "react"
import { cn } from "@glob-ui/utils"
import { SEPARATOR_CLASSES, SEPARATOR_ORIENTATION_CLASSES } from "@glob-ui/recipes"

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  /** Visual only: hidden from assistive technology. Set `false` when the line separates content for screen readers. */
  decorative?: boolean
}

const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        SEPARATOR_CLASSES,
        SEPARATOR_ORIENTATION_CLASSES[orientation],
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = "Separator"

export { Separator }
