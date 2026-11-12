import { forwardRef } from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { spinnerVariants } from "@glob-ui/recipes"

export interface SpinnerProps
  extends Omit<React.SVGProps<SVGSVGElement>, "ref">,
    VariantProps<typeof spinnerVariants> {}

const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, "aria-label": ariaLabel = "Loading", ...props }, ref) => {
    return (
      <svg
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        viewBox="0 0 24 24"
        fill="none"
        className={cn(spinnerVariants({ size, className }))}
        {...props}
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }
)
Spinner.displayName = "Spinner"

export { Spinner, spinnerVariants }
