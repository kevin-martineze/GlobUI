"use client"

import { cn } from "@glob-ui/utils"
import { useControllableState, useRovingFocus } from "@glob-ui/hooks"
import { SEGMENTED_CLASSES, SEGMENTED_DISABLED_CLASSES, SEGMENTED_ITEM_CLASSES, SEGMENTED_ITEM_SIZE, SEGMENTED_ITEM_CHECKED_CLASSES, SEGMENTED_ITEM_UNCHECKED_CLASSES } from "@glob-ui/recipes"

export interface SegmentedOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SegmentedProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, "id" | "aria-invalid" | "aria-describedby" | "aria-labelledby" | "aria-label"> {
  options: SegmentedOption[]
  /** Controlled value. */
  value?: string
  /** Initial value when uncontrolled. */
  defaultValue?: string
  onChange?: (value: string) => void
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  /** Submitted with native forms through a hidden input. */
  name?: string
  className?: string
}

const sizeStyles = SEGMENTED_ITEM_SIZE

/** Radio group (APG). Arrows move and select; Tab enters the group on the selected option. */
export function Segmented({
  options,
  value,
  defaultValue = "",
  onChange,
  size = "md",
  disabled,
  name,
  className,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  "aria-label": ariaLabel,
}: SegmentedProps) {
  const [current, setCurrent] = useControllableState<string>(value, defaultValue, onChange)

  const roving = useRovingFocus({
    orientation: "both",
    loop: true,
    itemSelector: "[data-roving-item]:not(:disabled)",
    onNavigate: (item) => {
      const next = item.dataset.value
      if (next !== undefined && next !== current) setCurrent(next)
    },
  })

  // The checked option is the single tab stop; with none checked, the first enabled one.
  const tabStop = options.find((o) => o.value === current && !o.disabled)?.value ?? options.find((o) => !o.disabled)?.value

  return (
    <div
      id={id}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      aria-disabled={disabled || undefined}
      {...roving.rootProps}
      className={cn(
        SEGMENTED_CLASSES,
        disabled && SEGMENTED_DISABLED_CLASSES,
        className
      )}
    >
      {name !== undefined && <input type="hidden" name={name} value={current} />}
      {options.map((option) => {
        const checked = option.value === current
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            data-roving-item=""
            data-value={option.value}
            tabIndex={option.value === tabStop ? 0 : -1}
            disabled={disabled || option.disabled}
            onClick={() => {
              if (!checked) setCurrent(option.value)
            }}
            className={cn(
              SEGMENTED_ITEM_CLASSES,
              sizeStyles[size],
              checked
                ? SEGMENTED_ITEM_CHECKED_CLASSES
                : SEGMENTED_ITEM_UNCHECKED_CLASSES
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
