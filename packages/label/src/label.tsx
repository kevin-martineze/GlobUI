import { forwardRef } from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { labelVariants } from "@glob-ui/recipes"

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, size, required, children, ...props }, ref) => {
    return (
      <label ref={ref} className={cn(labelVariants({ size, className }))} {...props}>
        {children}
        {required && (
          <span aria-hidden="true" className="text-glob-primary-text">
            *
          </span>
        )}
      </label>
    )
  }
)
Label.displayName = "Label"

export { Label, labelVariants }
