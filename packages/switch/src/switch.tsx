"use client"

import { forwardRef, useState } from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { switchVariants, thumbVariants } from "@glob-ui/recipes"

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
