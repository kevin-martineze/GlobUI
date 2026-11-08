"use client"

import { forwardRef, useState } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"

const switchVariants = cva(
  "group inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-glob-border-strong transition-colors data-[state=checked]:bg-glob-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-glob-danger",
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-13",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const thumbVariants = cva(
  "pointer-events-none block translate-x-0 rounded-full bg-white shadow-glob-sm transition-transform",
  {
    variants: {
      size: {
        sm: "h-4 w-4 group-data-[state=checked]:translate-x-4",
        md: "h-5 w-5 group-data-[state=checked]:translate-x-5",
        lg: "h-6 w-6 group-data-[state=checked]:translate-x-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "defaultValue">,
    VariantProps<typeof switchVariants> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  /** With a name, a hidden input submits `value` in forms while the switch is on. */
  name?: string
  value?: string
}

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    { checked, defaultChecked = false, onCheckedChange, name, value = "on", size, className, onClick, ...props },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked)
    const isControlled = checked !== undefined
    const isOn = isControlled ? checked : internalChecked

    return (
      <>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={isOn}
          data-state={isOn ? "checked" : "unchecked"}
          className={cn(switchVariants({ size, className }))}
          onClick={(e) => {
            onClick?.(e)
            if (e.defaultPrevented) return
            if (!isControlled) setInternalChecked(!isOn)
            onCheckedChange?.(!isOn)
          }}
          {...props}
        >
          <span className={thumbVariants({ size })} />
        </button>
        {name && isOn && <input type="hidden" name={name} value={value} />}
      </>
    )
  }
)
Switch.displayName = "Switch"

export { Switch, switchVariants }
