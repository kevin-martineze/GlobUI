import { forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"

const progressVariants = cva("relative w-full overflow-hidden rounded-glob-sm bg-glob-surface-hover", {
  variants: {
    size: {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const fillTone = {
  primary: "bg-glob-primary",
  success: "bg-glob-success",
  warning: "bg-glob-warning",
  danger: "bg-glob-danger",
} as const

export interface ProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "role">,
    VariantProps<typeof progressVariants> {
  /** Current value from 0 to `max`. `null` (or omitted) shows an indeterminate bar. Values outside the range are clamped. */
  value?: number | null
  /** The value that means complete. Default 100. */
  max?: number
  tone?: keyof typeof fillTone
  /** The text screen readers read instead of the number. Default: the percentage, for example "40%". */
  getValueLabel?: (value: number, max: number) => string
}

/**
 * A progress bar. It needs a name: pass `aria-label` or `aria-labelledby` (for example a Label's id).
 */
const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, size, tone = "primary", getValueLabel, ...props }, ref) => {
    const indeterminate = value === null || value === undefined
    const safeMax = max > 0 ? max : 100
    const clamped = indeterminate ? 0 : Math.min(Math.max(value, 0), safeMax)
    const percent = (clamped / safeMax) * 100

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-valuetext={indeterminate ? undefined : getValueLabel ? getValueLabel(clamped, safeMax) : `${Math.round(percent)}%`}
        className={cn(progressVariants({ size, className }))}
        {...props}
      >
        {indeterminate ? (
          // Slides across the track; with reduced motion it becomes a static full bar that pulses.
          <div
            className={cn(
              "h-full w-2/5 animate-glob-indeterminate rounded-glob-sm motion-reduce:w-full motion-reduce:animate-pulse",
              fillTone[tone]
            )}
          />
        ) : (
          <div
            className={cn("h-full w-full rounded-glob-sm transition-transform duration-300 ease-out motion-reduce:transition-none", fillTone[tone])}
            style={{ transform: `translateX(-${100 - percent}%)` }}
          />
        )}
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress, progressVariants }
