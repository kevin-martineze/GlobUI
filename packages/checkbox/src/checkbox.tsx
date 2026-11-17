"use client"

import { forwardRef, useEffect, useId, useImperativeHandle, useRef } from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { checkboxVariants } from "@glob-ui/recipes"
import { CONTROL_TEXT_SIZE, CHOICE_CONTROL_CLASSES, CHOICE_ROW_CLASSES, CHOICE_LABEL_CLASSES, CHOICE_LABEL_DISABLED_CLASSES, CHECKBOX_CHECK_ICON_CLASSES, CHECKBOX_DASH_ICON_CLASSES } from "@glob-ui/recipes"

const labelSize = CONTROL_TEXT_SIZE

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size">,
    VariantProps<typeof checkboxVariants> {
  /** Shows a dash instead of a check. Not a checked state; the browser clears it on click. */
  indeterminate?: boolean
  label?: React.ReactNode
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      size,
      indeterminate = false,
      label,
      id,
      disabled,
      "aria-labelledby": labelledByProp,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(ref, () => innerRef.current as HTMLInputElement)

    // `indeterminate` only exists as a DOM property, not an HTML attribute.
    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate
    }, [indeterminate])

    const autoId = useId()
    const inputId = id ?? autoId
    const labelId = `${inputId}-label`
    // aria-labelledby (e.g. from Field) replaces the native <label for> name. Append our own
    // label so the name stays "Field label + checkbox label", like several <label for> would.
    const labelledBy = labelledByProp && label ? `${labelledByProp} ${labelId}` : labelledByProp
    const s = size ?? "md"

    const control = (
      <span className={CHOICE_CONTROL_CLASSES}>
        <input
          ref={innerRef}
          type="checkbox"
          id={inputId}
          disabled={disabled}
          aria-labelledby={labelledBy}
          className={cn(checkboxVariants({ size, className }))}
          {...props}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={CHECKBOX_CHECK_ICON_CLASSES}
        >
          <path d="M5 12l5 5 9-10" />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className={CHECKBOX_DASH_ICON_CLASSES}
        >
          <path d="M6 12h12" />
        </svg>
      </span>
    )

    if (!label) return control

    return (
      <span className={CHOICE_ROW_CLASSES}>
        {control}
        <label
          id={labelId}
          htmlFor={inputId}
          className={cn(
            CHOICE_LABEL_CLASSES,
            labelSize[s],
            disabled && CHOICE_LABEL_DISABLED_CLASSES
          )}
        >
          {label}
        </label>
      </span>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox, checkboxVariants }
