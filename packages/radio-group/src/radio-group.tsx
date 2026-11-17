"use client"

import { createContext, forwardRef, useContext, useId, useState } from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { radioVariants } from "@glob-ui/recipes"
import { CONTROL_TEXT_SIZE, CHOICE_CONTROL_CLASSES, CHOICE_ROW_CLASSES, CHOICE_LABEL_CLASSES, CHOICE_LABEL_DISABLED_CLASSES, RADIO_GROUP_CLASSES, RADIO_GROUP_ORIENTATION_CLASSES, RADIO_INVALID_CLASSES, RADIO_DOT_CLASSES, RADIO_DOT_SIZE } from "@glob-ui/recipes"

type Size = "sm" | "md" | "lg"

const dotSize: Record<Size, string> = RADIO_DOT_SIZE

const labelSize: Record<Size, string> = CONTROL_TEXT_SIZE

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
            RADIO_GROUP_CLASSES,
            RADIO_GROUP_ORIENTATION_CLASSES[orientation],
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
      <span className={CHOICE_ROW_CLASSES}>
        <span className={CHOICE_CONTROL_CLASSES}>
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
              ctx.invalid && RADIO_INVALID_CLASSES,
              className
            )}
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              RADIO_DOT_CLASSES,
              dotSize[ctx.size]
            )}
          />
        </span>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              CHOICE_LABEL_CLASSES,
              labelSize[ctx.size],
              isDisabled && CHOICE_LABEL_DISABLED_CLASSES
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
