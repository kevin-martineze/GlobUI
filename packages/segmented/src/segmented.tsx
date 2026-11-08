"use client"

import { cn } from "@glob-ui/utils"
import { useControllableState, useRovingFocus } from "@glob-ui/hooks"

export interface SegmentedOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SegmentedProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, "id" | "aria-invalid" | "aria-describedby" | "aria-labelledby"> {
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

const sizeStyles = {
  sm: "h-8 text-xs px-3",
  md: "h-10 text-sm px-4",
  lg: "h-12 text-base px-5",
}

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
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
      aria-disabled={disabled || undefined}
      {...roving.rootProps}
      className={cn(
        "inline-flex rounded-glob-md border border-glob-border bg-glob-surface-secondary p-0.5",
        disabled && "opacity-50 cursor-not-allowed",
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
              "rounded-glob-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:cursor-not-allowed disabled:opacity-50",
              sizeStyles[size],
              checked
                ? "bg-glob-primary text-glob-primary-foreground shadow-sm"
                : "text-glob-text-secondary hover:text-glob-text"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
