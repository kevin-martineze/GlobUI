import { forwardRef } from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { Spinner } from "@glob-ui/spinner"
import { Slot } from "@glob-ui/slot"
import { buttonVariants } from "@glob-ui/recipes"

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
