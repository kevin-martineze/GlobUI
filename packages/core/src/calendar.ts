// Month grids and keyboard moves for a date picker grid, and the text a date field shows. Pure functions over
// "YYYY-MM-DD" strings and "YYYY-MM" month keys: every framework's Calendar and DatePicker use them.

import { addDays, addMonths, daysInMonth, parseISODate } from "./date"

export interface DateRange {
  from: string | null
  to: string | null
}

export interface CalendarCell {
  iso: string
  /** False for the days of the adjacent months that fill the first and last weeks. */
  inMonth: boolean
}

/** The month of a day: "2026-11-09" -> "2026-11". */
export const monthKey = (iso: string) => iso.slice(0, 7)

/** The first day of a month: "2026-11" -> "2026-11-01". */
export const monthStart = (key: string) => `${key}-01`

/** The month `n` months after `key` (before it when negative). */
export const shiftMonth = (key: string, n: number) => monthKey(addMonths(monthStart(key), n))

/** The start of the week that contains `iso`, for a week that starts on `weekStart` (0 = Sunday). */
export function startOfWeek(iso: string, weekStart: number) {
  const offset = (parseISODate(iso).getDay() - weekStart + 7) % 7
  return addDays(iso, -offset)
}

/** The weeks of a month, as rows of seven cells. Cells from the adjacent months are marked `inMonth: false`. */
export function buildCalendarWeeks(key: string, weekStart: number): CalendarCell[][] {
  const first = monthStart(key)
  const offset = (parseISODate(first).getDay() - weekStart + 7) % 7
  const total = Math.ceil((offset + daysInMonth(key)) / 7) * 7
  const start = addDays(first, -offset)
  const cells = Array.from({ length: total }, (_, i) => {
    const iso = addDays(start, i)
    return { iso, inMonth: monthKey(iso) === key }
  })
  const weeks: CalendarCell[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

/**
 * The day a key moves focus to in a date grid (WAI-ARIA date picker): arrows by day and week, Home and End to the ends
 * of the week, PageUp and PageDown by month (by year with Shift). Null when the key does not move.
 */
export function calendarKeyTarget(key: string, iso: string, { shiftKey = false, weekStart = 0 } = {}): string | null {
  switch (key) {
    case "ArrowLeft":
      return addDays(iso, -1)
    case "ArrowRight":
      return addDays(iso, 1)
    case "ArrowUp":
      return addDays(iso, -7)
    case "ArrowDown":
      return addDays(iso, 7)
    case "Home":
      return startOfWeek(iso, weekStart)
    case "End":
      return addDays(startOfWeek(iso, weekStart), 6)
    case "PageUp":
      return addMonths(iso, shiftKey ? -12 : -1)
    case "PageDown":
      return addMonths(iso, shiftKey ? 12 : 1)
    default:
      return null
  }
}

/** The text a date field shows: "Nov 9, 2026", or "Nov 3 – 9, 2026" for a range. Null when there is no value. */
export function formatDateValue(value: string | DateRange | null, isRange: boolean, locale: string): string | null {
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
