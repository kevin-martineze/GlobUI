"use client"

import { forwardRef, useId, useMemo, useRef, useState } from "react"
import { cn } from "@glob-ui/utils"
import { useControllableState } from "@glob-ui/hooks"
import { Calendar, useResolvedLocale, type DateRange } from "@glob-ui/calendar"
import { formatDateValue } from "@glob-ui/core"
import {
  DATE_PICKER_BODY_CLASSES,
  DATE_PICKER_CLASSES,
  DATE_PICKER_CLEAR_CLASSES,
  DATE_PICKER_CLEAR_ICON_CLASSES,
  DATE_PICKER_CONTENT_CLASSES,
  DATE_PICKER_ICON_CLASSES,
  DATE_PICKER_PLACEHOLDER_CLASSES,
  DATE_PICKER_PRESET_CLASSES,
  DATE_PICKER_PRESETS_CLASSES,
  DATE_PICKER_SIZE,
  DATE_PICKER_TRIGGER_CLASSES,
  DATE_PICKER_TRIGGER_CLEARABLE_CLASSES,
  DATE_PICKER_VALUE_CLASSES,
  DATE_PICKER_VARIANT,
} from "@glob-ui/recipes"
import { Popover, PopoverContent, PopoverTrigger } from "@glob-ui/popover"
import { composeRefs } from "@glob-ui/slot"

export interface DatePickerPreset {
  label: string
  /** A single day ("YYYY-MM-DD") for single mode, or a range for range mode. */
  value: string | DateRange
}

interface DatePickerBaseProps {
  locale?: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  min?: string
  max?: string
  isDateDisabled?: (iso: string) => boolean
  /** Months shown side by side (stacked on small screens). Default 1, or 2 in range mode. */
  numberOfMonths?: 1 | 2
  /** Buttons next to the calendar (above it on small screens). Selecting one closes the picker. */
  presets?: DatePickerPreset[]
  placeholder?: string
  disabled?: boolean
  /** Shows an X that clears the value. Default true. */
  clearable?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "ghost" | "outline"
  className?: string
  id?: string
  name?: string
  "aria-invalid"?: boolean | "true" | "false"
  "aria-describedby"?: string
  "aria-labelledby"?: string
  "aria-label"?: string
}

export interface DatePickerSingleProps extends DatePickerBaseProps {
  mode?: "single"
  /** "YYYY-MM-DD", or null for none. */
  value?: string | null
  defaultValue?: string | null
  onChange?: (iso: string | null) => void
  allowDeselect?: boolean
}

export interface DatePickerRangeProps extends DatePickerBaseProps {
  mode: "range"
  value?: DateRange
  defaultValue?: DateRange
  onChange?: (range: DateRange) => void
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps

/** A date field. The value is an ISO date ("YYYY-MM-DD") or a range of them, and the calendar opens in a popover. */
const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>((props, ref) => {
  const {
    mode = "single",
    locale: localeProp,
    weekStartsOn,
    min,
    max,
    isDateDisabled,
    numberOfMonths,
    presets,
    placeholder,
    disabled = false,
    clearable = true,
    size = "md",
    variant = "default",
    className,
    id,
    name,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
    "aria-labelledby": ariaLabelledBy,
    "aria-label": ariaLabel,
    value,
    defaultValue,
    onChange,
    allowDeselect = false,
  } = props as DatePickerProps & { allowDeselect?: boolean }
  const isRange = mode === "range"
  // Same HTML on the server and during hydration; the browser locale takes over after (see useResolvedLocale).
  const locale = useResolvedLocale(localeProp)
  const baseId = useId()
  const triggerId = id ?? `${baseId}-trigger`
  const valueId = `${baseId}-value`
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const mergedRef = useMemo(() => composeRefs<HTMLButtonElement>(ref, triggerRef), [ref])

  const [single, setSingle] = useControllableState<string | null>(
    isRange ? undefined : (value as string | null | undefined),
    (defaultValue as string | null | undefined) ?? null,
    isRange ? undefined : (onChange as ((next: string | null) => void) | undefined)
  )
  const [range, setRange] = useControllableState<DateRange>(
    isRange ? (value as DateRange | undefined) : undefined,
    (defaultValue as DateRange | undefined) ?? { from: null, to: null },
    isRange ? (onChange as ((next: DateRange) => void) | undefined) : undefined
  )

  const current: string | DateRange | null = isRange ? range : single
  const text = formatDateValue(current, isRange, locale)
  const hasValue = isRange ? range.from !== null : single !== null
  const months = numberOfMonths ?? (isRange ? 2 : 1)

  /** Closes the calendar and gives focus back to the trigger. */
  function closeAndFocus() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  function applyPreset(preset: DatePickerPreset) {
    if (isRange) {
      setRange(typeof preset.value === "string" ? { from: preset.value, to: preset.value } : preset.value)
    } else {
      setSingle(typeof preset.value === "string" ? preset.value : preset.value.from)
    }
    closeAndFocus()
  }

  function clear() {
    if (isRange) setRange({ from: null, to: null })
    else setSingle(null)
    triggerRef.current?.focus()
  }

  const hiddenValue = isRange ? (range.from && range.to ? `${range.from}/${range.to}` : "") : (single ?? "")

  return (
    <div className={DATE_PICKER_CLASSES}>
      {/* One Popover for the trigger and the content: they share its context. */}
      <Popover open={open} onOpenChange={setOpen} placement="bottom-start" offset={6}>
        {/* PopoverTrigger renders the button and forwards these props (no asChild: the registry transform rewrites it). */}
        <PopoverTrigger
          ref={mergedRef}
            id={triggerId}
            type="button"
            disabled={disabled}
            data-invalid={ariaInvalid === true || ariaInvalid === "true" ? "true" : undefined}
            aria-describedby={ariaDescribedBy}
            // The name includes the shown value, so it contains the visible text (WCAG 2.5.3).
            aria-labelledby={[ariaLabelledBy, valueId].filter(Boolean).join(" ")}
            aria-label={ariaLabel}
            className={cn(
              DATE_PICKER_TRIGGER_CLASSES,
              DATE_PICKER_SIZE[size],
              DATE_PICKER_VARIANT[variant],
              hasValue && clearable && DATE_PICKER_TRIGGER_CLEARABLE_CLASSES,
              className
            )}
          >
            <span id={valueId} className={cn(DATE_PICKER_VALUE_CLASSES, text === null && DATE_PICKER_PLACEHOLDER_CLASSES)}>
              {text ?? placeholder ?? (isRange ? "Pick a date range" : "Pick a date")}
            </span>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={DATE_PICKER_ICON_CLASSES}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
        </PopoverTrigger>

      {clearable && hasValue && !disabled && (
        <button
          type="button"
          aria-label="Clear date"
          onClick={clear}
          className={DATE_PICKER_CLEAR_CLASSES}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={DATE_PICKER_CLEAR_ICON_CLASSES}>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}

        {/* Named explicitly: the Popover's default name points at its own trigger id, which Field may replace. */}
        <PopoverContent className={DATE_PICKER_CONTENT_CLASSES} aria-labelledby={undefined} aria-label={isRange ? "Choose a date range" : "Choose a date"}>
          {open && (
            <div className={DATE_PICKER_BODY_CLASSES}>
              {presets && presets.length > 0 && (
                <div role="group" aria-label="Presets" className={DATE_PICKER_PRESETS_CLASSES}>
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={DATE_PICKER_PRESET_CLASSES}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}
              {isRange ? (
                <Calendar
                  mode="range"
                  value={range}
                  onChange={(next) => {
                    setRange(next)
                    // The range is complete once `to` is set.
                    if (next.to) closeAndFocus()
                  }}
                  locale={localeProp}
                  weekStartsOn={weekStartsOn}
                  min={min}
                  max={max}
                  isDateDisabled={isDateDisabled}
                  numberOfMonths={months as 1 | 2}
                />
              ) : (
                <Calendar
                  mode="single"
                  value={single}
                  onChange={(next) => setSingle(next)}
                  onSelectDay={() => closeAndFocus()}
                  allowDeselect={allowDeselect}
                  locale={localeProp}
                  weekStartsOn={weekStartsOn}
                  min={min}
                  max={max}
                  isDateDisabled={isDateDisabled}
                  numberOfMonths={months as 1 | 2}
                />
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>

      {name !== undefined && <input type="hidden" name={name} value={hiddenValue} />}
    </div>
  )
})
DatePicker.displayName = "DatePicker"

export { DatePicker }
