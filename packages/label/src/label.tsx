import { forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"

const labelVariants = cva(
  "inline-flex items-center gap-1 font-medium leading-none text-glob-text peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

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
