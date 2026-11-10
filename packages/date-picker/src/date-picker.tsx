"use client"

import { forwardRef, useId, useMemo, useRef, useState } from "react"
import { cn } from "@glob-ui/utils"
import { useControllableState } from "@glob-ui/hooks"
import { Calendar, parseISODate, useResolvedLocale, type DateRange } from "@glob-ui/calendar"
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

const sizeClasses = { sm: "h-8 text-xs", md: "h-10 text-sm", lg: "h-12 text-base" }
const variantClasses = {
  default: "border-glob-border bg-glob-surface",
  ghost: "border-transparent bg-transparent hover:bg-glob-surface-hover",
  outline: "border-glob-border bg-transparent hover:bg-glob-surface-hover",
}

/** The text shown in the trigger: "Nov 9, 2026", or "Nov 3 – Nov 9, 2026" for a range. */
function formatValue(value: string | DateRange | null, isRange: boolean, locale: string): string | null {
  const format = new Intl.DateTimeFormat(locale, { dateStyle: "medium" })
  if (!isRange) return typeof value === "string" ? format.format(parseISODate(value)) : null
  const range = value as DateRange | null
  if (!range?.from) return null
  const from = format.format(parseISODate(range.from))
  if (!range.to) return `${from} – …`
  const to = parseISODate(range.to)
  const fromDate = parseISODate(range.from)
  // formatRange collapses shared parts ("Nov 3 – 9, 2026"); fall back to two dates where it is missing.
  const withRange = format as Intl.DateTimeFormat & { formatRange?: (a: Date, b: Date) => string }
  return typeof withRange.formatRange === "function" ? withRange.formatRange(fromDate, to) : `${from} – ${format.format(to)}`
}

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
  const text = formatValue(current, isRange, locale)
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
    <div className="relative w-full">
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
              "flex w-full cursor-pointer items-center justify-between gap-2 rounded-glob-md border px-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:cursor-not-allowed disabled:opacity-50 data-[invalid=true]:border-glob-danger",
              sizeClasses[size],
              variantClasses[variant],
              // Room for the clear button, which sits beside the trigger (never inside it).
              hasValue && clearable && "pr-16",
              className
            )}
          >
            <span id={valueId} className={cn("truncate", text === null && "text-glob-text-secondary")}>
              {text ?? placeholder ?? (isRange ? "Pick a date range" : "Pick a date")}
            </span>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-glob-text-secondary">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
        </PopoverTrigger>

      {clearable && hasValue && !disabled && (
        <button
          type="button"
          aria-label="Clear date"
          onClick={clear}
          className="absolute right-9 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-glob-sm text-glob-text-secondary hover:bg-glob-surface-hover hover:text-glob-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}

        {/* Named explicitly: the Popover's default name points at its own trigger id, which Field may replace. */}
        <PopoverContent className="w-fit p-3" aria-labelledby={undefined} aria-label={isRange ? "Choose a date range" : "Choose a date"}>
          {open && (
            <div className="flex flex-col gap-3 sm:flex-row">
              {presets && presets.length > 0 && (
                <div role="group" aria-label="Presets" className="flex flex-wrap gap-1 sm:w-36 sm:flex-col">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="rounded-glob-sm px-2 py-1.5 text-left text-sm text-glob-text transition-colors hover:bg-glob-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring"
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
