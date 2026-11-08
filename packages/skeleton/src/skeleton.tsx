import { forwardRef } from "react"
import { cn } from "@glob-ui/utils"

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

/** Placeholder block. Set its shape with className (e.g. "h-4 w-32" or "h-10 w-10 rounded-full"). */
const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "animate-pulse rounded-glob-md bg-glob-surface-hover motion-reduce:animate-none",
      className
    )}
    {...props}
  />
))
Skeleton.displayName = "Skeleton"

export { Skeleton }
