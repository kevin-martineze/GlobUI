"use client"

import { forwardRef, useEffect, useId, useRef, useState } from "react"
import { cn } from "@glob-ui/utils"
import { useControllableState } from "@glob-ui/hooks"
import { addDays, addMonths, compareISODate, daysInMonth, parseISODate, todayISODate } from "./date"
import { defaultWeekStart, useHydrated, useResolvedLocale, weekdayNames } from "./locale"

export interface DateRange {
  from: string | null
  to: string | null
}

interface CalendarBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** The first day of the week, 0 (Sunday) to 6. Default: from the locale. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /**
   * BCP 47 tag, for example "es-ES". Default: the browser's locale. Server-rendered pages show "en-US" until
   * hydration, then switch; pass `locale` to avoid the switch.
   */
  locale?: string
  /** Earliest selectable day, "YYYY-MM-DD". Days before it are disabled and navigation stops before its month. */
  min?: string
  /** Latest selectable day, "YYYY-MM-DD". Days after it are disabled and navigation stops after its month. */
  max?: string
  /** Disables more days. Disabled days can still receive focus, but cannot be selected. */
  isDateDisabled?: (iso: string) => boolean
  /** The visible month, "YYYY-MM" (controlled). */
  month?: string
  defaultMonth?: string
  onMonthChange?: (month: string) => void
  /** Shows one month, or two side by side (stacked on small screens). */
  numberOfMonths?: 1 | 2
  /** Muted days from the adjacent months. Not selectable; clicking one moves to its month. Default true. */
  showOutsideDays?: boolean
  /** Called when the user picks an enabled day, even when it is already the selected one. Used by DatePicker to close. */
  onSelectDay?: (iso: string) => void
}

export interface CalendarSingleProps extends CalendarBaseProps {
  mode?: "single"
  value?: string | null
  defaultValue?: string | null
  onChange?: (iso: string | null) => void
  /** Clicking the selected day again clears it. Default false. */
  allowDeselect?: boolean
}

export interface CalendarRangeProps extends CalendarBaseProps {
  mode: "range"
  value?: DateRange
  defaultValue?: DateRange
  onChange?: (range: DateRange) => void
}

export type CalendarProps = CalendarSingleProps | CalendarRangeProps

const monthKey = (iso: string) => iso.slice(0, 7)
const monthStart = (key: string) => `${key}-01`
const shiftMonth = (key: string, n: number) => monthKey(addMonths(monthStart(key), n))

/** Start of the week that contains `iso`. */
function startOfWeek(iso: string, weekStart: number) {
  const offset = (parseISODate(iso).getDay() - weekStart + 7) % 7
  return addDays(iso, -offset)
}

interface Cell {
  iso: string
  inMonth: boolean
}

/** The weeks of a month, as rows of seven cells. Cells from the adjacent months are marked `inMonth: false`. */
function buildWeeks(key: string, weekStart: number): Cell[][] {
  const first = monthStart(key)
  const offset = (parseISODate(first).getDay() - weekStart + 7) % 7
  const total = Math.ceil((offset + daysInMonth(key)) / 7) * 7
  const start = addDays(first, -offset)
  const cells = Array.from({ length: total }, (_, i) => {
    const iso = addDays(start, i)
    return { iso, inMonth: monthKey(iso) === key }
  })
  const weeks: Cell[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

/** Classes of one day button. Exported for DatePicker's styling of the same states. */
function dayClasses({
  selected,
  inRange,
  rangeEdge,
  today,
  disabled,
  outside,
}: {
  selected: boolean
  inRange: boolean
  rangeEdge: boolean
  today: boolean
  disabled: boolean
  outside: boolean
}) {
  return cn(
    "inline-flex size-9 items-center justify-center rounded-glob-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring motion-reduce:transition-none",
    selected
      ? "bg-glob-primary font-medium text-glob-primary-foreground hover:opacity-90"
      : inRange
        ? cn("bg-glob-primary-light text-glob-text", !rangeEdge && "rounded-none")
        : "text-glob-text hover:bg-glob-surface-hover",
    today && !selected && "font-semibold ring-1 ring-inset ring-glob-border",
    // Muted, not faded: the text stays above 4.5:1. Disabled days are struck through.
    outside && "text-glob-text-secondary",
    disabled && "cursor-not-allowed text-glob-text-secondary line-through hover:bg-transparent"
  )
}

/**
 * A month grid for picking one day, or a range of days. Values are "YYYY-MM-DD" strings.
 * Follows the WAI-ARIA date picker grid: one tab stop, arrows move by day and week, PageUp and PageDown by month.
 */
const Calendar = forwardRef<HTMLDivElement, CalendarProps>((props, ref) => {
  const {
    mode = "single",
    weekStartsOn,
    locale: localeProp,
    min,
    max,
    isDateDisabled,
    month: monthProp,
    defaultMonth,
    onMonthChange,
    numberOfMonths = 1,
    showOutsideDays = true,
    onSelectDay,
    onKeyDown,
    onPointerLeave,
    className,
    // Value props are read below, never spread onto the DOM.
    value,
    defaultValue,
    onChange,
    allowDeselect = false,
    ...rest
  } = props as CalendarProps & { allowDeselect?: boolean }
  const isRange = mode === "range"
  const [singleValue, setSingleValue] = useControllableState<string | null>(
    isRange ? undefined : (value as string | null | undefined),
    (defaultValue as string | null | undefined) ?? null,
    isRange ? undefined : (onChange as ((next: string | null) => void) | undefined)
  )
  const [rangeValue, setRangeValue] = useControllableState<DateRange>(
    isRange ? (value as DateRange | undefined) : undefined,
    (defaultValue as DateRange | undefined) ?? { from: null, to: null },
    isRange ? (onChange as ((next: DateRange) => void) | undefined) : undefined
  )

  // Locale and today depend on the browser: before hydration they match the server render (see useResolvedLocale).
  const hydrated = useHydrated()
  const locale = useResolvedLocale(localeProp)
  const weekStart = weekStartsOn ?? defaultWeekStart(locale)
  const today = hydrated ? todayISODate() : null
  const initialFocus = isRange ? (rangeValue.from ?? todayISODate()) : (singleValue ?? todayISODate())
  const baseId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const shouldFocus = useRef(false)

  const [visibleKey, setVisibleKey] = useControllableState<string>(monthProp, defaultMonth ?? monthKey(initialFocus), onMonthChange)
  const [focusISO, setFocusISO] = useState(initialFocus)
  const [hoverISO, setHoverISO] = useState<string | null>(null)

  const minKey = min ? monthKey(min) : null
  const maxKey = max ? monthKey(max) : null
  const clampKey = (key: string) => (minKey && key < minKey ? minKey : maxKey && key > maxKey ? maxKey : key)
  const months = Array.from({ length: numberOfMonths }, (_, i) => shiftMonth(visibleKey, i))
  const lastVisibleKey = months[months.length - 1]

  const inBounds = (iso: string) => (!min || iso >= min) && (!max || iso <= max)
  const isDisabledDay = (iso: string) => !inBounds(iso) || (isDateDisabled?.(iso) ?? false)

  // Keeps `iso` on screen by moving the visible month, if it is off screen.
  function showDay(iso: string) {
    const key = monthKey(iso)
    if (key < visibleKey) setVisibleKey(clampKey(key))
    else if (key > lastVisibleKey) setVisibleKey(clampKey(shiftMonth(key, -(numberOfMonths - 1))))
  }

  function moveFocus(iso: string) {
    if (!inBounds(iso)) return
    setFocusISO(iso)
    showDay(iso)
    shouldFocus.current = true
  }

  // After a keyboard move, the new day button takes DOM focus once it is rendered.
  useEffect(() => {
    if (!shouldFocus.current) return
    shouldFocus.current = false
    rootRef.current?.querySelector<HTMLElement>(`[data-iso="${focusISO}"]`)?.focus()
  })

  function pick(iso: string) {
    if (isDisabledDay(iso)) return
    if (!isRange) {
      if (iso === singleValue) {
        if (allowDeselect) setSingleValue(null)
        else onSelectDay?.(iso)
        return
      }
      setSingleValue(iso)
      onSelectDay?.(iso)
      return
    }
    const { from, to } = rangeValue
    if (from === null || to !== null) {
      setRangeValue({ from: iso, to: null })
    } else if (compareISODate(iso, from) < 0) {
      // A second pick before the first one swaps them.
      setRangeValue({ from: iso, to: from })
    } else {
      setRangeValue({ from, to: iso })
    }
    setHoverISO(null)
  }

  function onGridKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(e)
    if (e.defaultPrevented) return
    const iso = (e.target as HTMLElement).dataset.iso
    if (!iso) return
    let next: string
    switch (e.key) {
      case "ArrowLeft":
        next = addDays(iso, -1)
        break
      case "ArrowRight":
        next = addDays(iso, 1)
        break
      case "ArrowUp":
        next = addDays(iso, -7)
        break
      case "ArrowDown":
        next = addDays(iso, 7)
        break
      case "Home":
        next = startOfWeek(iso, weekStart)
        break
      case "End":
        next = addDays(startOfWeek(iso, weekStart), 6)
        break
      case "PageUp":
        next = addMonths(iso, e.shiftKey ? -12 : -1)
        break
      case "PageDown":
        next = addMonths(iso, e.shiftKey ? 12 : 1)
        break
      default:
        return
    }
    e.preventDefault()
    moveFocus(next)
  }

  // The one tab stop: the focus day when it is on screen, else the first day of the first month.
  const tabStop = months.includes(monthKey(focusISO)) ? focusISO : monthStart(months[0])

  // Range shading: the picked range, or the preview from the first pick to the hovered day.
  const previewEnd = isRange && rangeValue.from !== null && rangeValue.to === null ? (hoverISO ?? null) : null
  const shadeFrom = isRange ? rangeValue.from : null
  const shadeTo = isRange ? (rangeValue.to ?? previewEnd) : null
  const shadeStart = shadeFrom && shadeTo ? (compareISODate(shadeFrom, shadeTo) <= 0 ? shadeFrom : shadeTo) : null
  const shadeEnd = shadeFrom && shadeTo ? (compareISODate(shadeFrom, shadeTo) <= 0 ? shadeTo : shadeFrom) : null

  const dayFormat = new Intl.DateTimeFormat(locale, { dateStyle: "full" })
  const headingFormat = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" })
  const names = weekdayNames(locale, weekStart)
  const prevDisabled = minKey !== null && visibleKey <= minKey
  const nextDisabled = maxKey !== null && lastVisibleKey >= maxKey

  return (
    <div
      ref={(node) => {
        rootRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      role="group"
      className={cn("flex flex-col gap-3 text-sm text-glob-text", className)}
      onKeyDown={onGridKeyDown}
      {...rest}
      onPointerLeave={(e) => {
        onPointerLeave?.(e)
        setHoverISO(null)
      }}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          disabled={prevDisabled}
          onClick={() => setVisibleKey(clampKey(shiftMonth(visibleKey, -1)))}
          className="inline-flex size-8 items-center justify-center rounded-glob-sm text-glob-text-secondary transition-colors hover:bg-glob-surface-hover hover:text-glob-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:pointer-events-none disabled:opacity-40"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next month"
          disabled={nextDisabled}
          onClick={() => setVisibleKey(clampKey(shiftMonth(visibleKey, 1)))}
          className="inline-flex size-8 items-center justify-center rounded-glob-sm text-glob-text-secondary transition-colors hover:bg-glob-surface-hover hover:text-glob-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:pointer-events-none disabled:opacity-40"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className={cn("flex gap-4", numberOfMonths === 2 ? "flex-col sm:flex-row" : "flex-col")}>
        {months.map((key) => {
          const headingId = `${baseId}-${key}`
          const [year, monthNumber] = key.split("-").map(Number)
          const heading = headingFormat.format(new Date(year, monthNumber - 1, 1))
          return (
            <div key={key} className="flex flex-col gap-2">
              <div id={headingId} aria-live="polite" className="text-center text-sm font-semibold">
                {heading}
              </div>
              <table role="grid" aria-labelledby={headingId} className="border-separate border-spacing-0.5">
                <thead>
                  <tr role="row">
                    {names.map((name) => (
                      <th key={name.long} role="columnheader" scope="col" aria-label={name.long} className="size-9 p-0 text-center text-xs font-medium text-glob-text-secondary">
                        {name.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {buildWeeks(key, weekStart).map((week) => (
                    <tr key={week[0].iso} role="row">
                      {week.map(({ iso, inMonth }) => {
                        if (!inMonth && !showOutsideDays) {
                          return <td key={iso} role="gridcell" className="size-9 p-0" />
                        }
                        const day = Number(iso.slice(8))
                        const disabled = isDisabledDay(iso)
                        const selected = isRange ? iso === rangeValue.from || iso === rangeValue.to : iso === singleValue
                        const inShade = shadeStart !== null && shadeEnd !== null && iso >= shadeStart && iso <= shadeEnd
                        const rangeEdge = iso === shadeStart || iso === shadeEnd
                        const isStop = inMonth && iso === tabStop
                        return (
                          <td key={iso} role="gridcell" aria-selected={selected} className="p-0">
                            <button
                              type="button"
                              data-iso={iso}
                              // The tab stop is also what a DatePicker focuses when it opens.
                              data-autofocus={isStop ? "" : undefined}
                              tabIndex={inMonth && isStop ? 0 : -1}
                              aria-label={dayFormat.format(parseISODate(iso))}
                              aria-current={iso === today ? "date" : undefined}
                              aria-disabled={disabled || undefined}
                              onClick={() => {
                                if (!inMonth) {
                                  setFocusISO(iso)
                                  setVisibleKey(clampKey(monthKey(iso)))
                                  return
                                }
                                setFocusISO(iso)
                                pick(iso)
                              }}
                              onFocus={() => {
                                setFocusISO(iso)
                                if (isRange) setHoverISO(iso)
                              }}
                              onPointerEnter={() => {
                                if (isRange && rangeValue.from !== null && rangeValue.to === null) setHoverISO(iso)
                              }}
                              className={dayClasses({ selected, inRange: inShade, rangeEdge, today: iso === today, disabled, outside: !inMonth })}
                            >
                              {day}
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    </div>
  )
})
Calendar.displayName = "Calendar"

export { Calendar }
