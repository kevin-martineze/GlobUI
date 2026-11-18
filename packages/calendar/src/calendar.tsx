"use client"

import { forwardRef, useEffect, useId, useRef, useState } from "react"
import { cn } from "@glob-ui/utils"
import { useControllableState } from "@glob-ui/hooks"
import {
  buildCalendarWeeks,
  calendarKeyTarget,
  compareISODate,
  monthKey,
  monthStart,
  parseISODate,
  shiftMonth,
  todayISODate,
  type DateRange,
} from "@glob-ui/core"
import {
  CALENDAR_CELL_CLASSES,
  CALENDAR_CLASSES,
  CALENDAR_EMPTY_CELL_CLASSES,
  CALENDAR_GRID_CLASSES,
  CALENDAR_HEADING_CLASSES,
  CALENDAR_MONTH_CLASSES,
  CALENDAR_MONTHS_CLASSES,
  CALENDAR_MONTHS_LAYOUT_CLASSES,
  CALENDAR_NAV_BUTTON_CLASSES,
  CALENDAR_NAV_CLASSES,
  CALENDAR_NAV_ICON_CLASSES,
  CALENDAR_WEEKDAY_CLASSES,
  calendarDayClasses,
} from "@glob-ui/recipes"
import { defaultWeekStart, useHydrated, useResolvedLocale, weekdayNames } from "./locale"

export type { DateRange }

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
    const next = calendarKeyTarget(e.key, iso, { shiftKey: e.shiftKey, weekStart })
    if (next === null) return
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
      className={cn(CALENDAR_CLASSES, className)}
      onKeyDown={onGridKeyDown}
      {...rest}
      onPointerLeave={(e) => {
        onPointerLeave?.(e)
        setHoverISO(null)
      }}
    >
      <div className={CALENDAR_NAV_CLASSES}>
        <button
          type="button"
          aria-label="Previous month"
          disabled={prevDisabled}
          onClick={() => setVisibleKey(clampKey(shiftMonth(visibleKey, -1)))}
          className={CALENDAR_NAV_BUTTON_CLASSES}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={CALENDAR_NAV_ICON_CLASSES}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next month"
          disabled={nextDisabled}
          onClick={() => setVisibleKey(clampKey(shiftMonth(visibleKey, 1)))}
          className={CALENDAR_NAV_BUTTON_CLASSES}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={CALENDAR_NAV_ICON_CLASSES}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className={cn(CALENDAR_MONTHS_CLASSES, CALENDAR_MONTHS_LAYOUT_CLASSES[numberOfMonths])}>
        {months.map((key) => {
          const headingId = `${baseId}-${key}`
          const [year, monthNumber] = key.split("-").map(Number)
          const heading = headingFormat.format(new Date(year, monthNumber - 1, 1))
          return (
            <div key={key} className={CALENDAR_MONTH_CLASSES}>
              <div id={headingId} aria-live="polite" className={CALENDAR_HEADING_CLASSES}>
                {heading}
              </div>
              <table role="grid" aria-labelledby={headingId} className={CALENDAR_GRID_CLASSES}>
                <thead>
                  <tr role="row">
                    {names.map((name) => (
                      <th key={name.long} role="columnheader" scope="col" aria-label={name.long} className={CALENDAR_WEEKDAY_CLASSES}>
                        {name.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {buildCalendarWeeks(key, weekStart).map((week) => (
                    <tr key={week[0].iso} role="row">
                      {week.map(({ iso, inMonth }) => {
                        if (!inMonth && !showOutsideDays) {
                          return <td key={iso} role="gridcell" className={CALENDAR_EMPTY_CELL_CLASSES} />
                        }
                        const day = Number(iso.slice(8))
                        const disabled = isDisabledDay(iso)
                        const selected = isRange ? iso === rangeValue.from || iso === rangeValue.to : iso === singleValue
                        const inShade = shadeStart !== null && shadeEnd !== null && iso >= shadeStart && iso <= shadeEnd
                        const rangeEdge = iso === shadeStart || iso === shadeEnd
                        const isStop = inMonth && iso === tabStop
                        return (
                          <td key={iso} role="gridcell" aria-selected={selected} className={CALENDAR_CELL_CLASSES}>
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
                              className={cn(...calendarDayClasses({ selected, inRange: inShade, rangeEdge, today: iso === today, disabled, outside: !inMonth }))}
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
