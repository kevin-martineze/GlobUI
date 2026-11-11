import { forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { Spinner } from "@glob-ui/spinner"
import { Slot } from "@glob-ui/slot"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-glob-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-glob-primary text-glob-primary-foreground hover:bg-glob-primary-hover",
        secondary: "bg-glob-text text-glob-surface hover:opacity-80",
        danger: "bg-glob-danger text-glob-surface hover:opacity-90",
        ghost: "text-glob-text hover:bg-glob-surface-hover",
        outline: "border border-glob-border text-glob-text hover:bg-glob-surface-hover",
        link: "text-glob-primary-text underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the single child (e.g. an <a>) with the button's styles and props instead of a <button>. */
  asChild?: boolean
  /**
   * Shows a spinner over the content, disables the button and sets aria-busy. Width stays the same.
   * With asChild only aria-busy/aria-disabled are set: the child is rendered as is.
   */
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    if (asChild) {
      // Links and other elements have no disabled attribute; aria-disabled carries the state and style.
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          aria-disabled={disabled || loading || undefined}
          aria-busy={loading || undefined}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), loading && "relative")}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            {/* opacity-0 (not invisible) keeps the width and keeps the label in the accessible name. */}
            <span className="inline-flex items-center gap-2 opacity-0">{children}</span>
            <span className="absolute inset-0 flex items-center justify-center">
              <Spinner size={size === "lg" ? "md" : "sm"} />
            </span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
