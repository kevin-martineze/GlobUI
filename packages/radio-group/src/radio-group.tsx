"use client"

import { createContext, forwardRef, useContext, useId, useState } from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { radioVariants } from "@glob-ui/recipes"

type Size = "sm" | "md" | "lg"

const dotSize: Record<Size, string> = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
}

const labelSize: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
}

interface RadioGroupContextValue {
  name: string
  value: string | undefined
  onSelect: (value: string) => void
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  size: Size
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    VariantProps<typeof radioVariants> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Shared by every radio. Defaults to a generated id. */
  name?: string
  disabled?: boolean
  required?: boolean
  orientation?: "vertical" | "horizontal"
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      name,
      disabled,
      required,
      orientation = "vertical",
      size,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const autoName = useId()
    const [internalValue, setInternalValue] = useState(defaultValue)
    const isControlled = value !== undefined
    const current = isControlled ? value : internalValue

    function onSelect(next: string) {
      if (!isControlled) setInternalValue(next)
      onValueChange?.(next)
    }

    const invalid = props["aria-invalid"] === true || props["aria-invalid"] === "true"

    return (
      <RadioGroupContext.Provider
        value={{
          name: name ?? autoName,
          value: current,
          onSelect,
          disabled,
          required,
          invalid,
          size: size ?? "md",
        }}
      >
        <div
          ref={ref}
          role="radiogroup"
          aria-orientation={orientation}
          aria-required={required || undefined}
          aria-disabled={disabled || undefined}
          className={cn(
            "flex",
            orientation === "horizontal" ? "flex-row flex-wrap gap-4" : "flex-col gap-2",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

export interface RadioGroupItemProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "size" | "name" | "value" | "checked" | "defaultChecked" | "onChange"
  > {
  value: string
  label?: React.ReactNode
}

const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value, label, id, disabled, className, ...props }, ref) => {
    const ctx = useContext(RadioGroupContext)
    if (!ctx) throw new Error("RadioGroupItem must be used inside RadioGroup")

    const autoId = useId()
    const inputId = id ?? autoId
    const isDisabled = ctx.disabled || disabled

    return (
      <span className="inline-flex items-center gap-2">
        <span className="relative inline-flex shrink-0">
          <input
            ref={ref}
            type="radio"
            id={inputId}
            name={ctx.name}
            value={value}
            checked={ctx.value === value}
            onChange={() => ctx.onSelect(value)}
            disabled={isDisabled}
            required={ctx.required}
            className={cn(
              radioVariants({ size: ctx.size }),
              // aria-invalid is not valid on role radio; the group carries it, items only show it.
              ctx.invalid && "border-glob-danger",
              className
            )}
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 m-auto hidden rounded-full bg-glob-primary-foreground peer-checked:block",
              dotSize[ctx.size]
            )}
          />
        </span>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "cursor-pointer text-glob-text",
              labelSize[ctx.size],
              isDisabled && "cursor-not-allowed opacity-50"
            )}
          >
            {label}
          </label>
        )}
      </span>
    )
  }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem, radioVariants }
