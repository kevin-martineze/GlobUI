// ISO "YYYY-MM-DD" helpers. Values are plain strings, so they serialize and compare without time zones.
// Every calculation uses local calendar fields (`new Date(y, m, d)`), never `toISOString` and never
// `+ 86400000`, so daylight saving changes do not shift a day.

const pad = (n: number, width = 2) => String(n).padStart(width, "0")

/** The local calendar date of `date` as "YYYY-MM-DD". */
export function toISODate(date: Date): string {
  return `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Local midnight of an ISO date. */
export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number)
  const date = new Date(2000, 0, 1)
  date.setFullYear(year, month - 1, day)
  date.setHours(0, 0, 0, 0)
  return date
}

/** The date `n` days after `iso` (negative goes back). */
export function addDays(iso: string, n: number): string {
  const d = parseISODate(iso)
  return toISODate(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n))
}

/**
 * The date `n` months after `iso`, on the same day of the month. When that day does not exist in the
 * target month it is clamped to the last day: Jan 31 + 1 month is Feb 28 (or 29 in a leap year).
 */
export function addMonths(iso: string, n: number): string {
  const d = parseISODate(iso)
  const first = new Date(d.getFullYear(), d.getMonth() + n, 1)
  const lastDay = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  return toISODate(new Date(first.getFullYear(), first.getMonth(), Math.min(d.getDate(), lastDay)))
}

/** True when both ISO dates are the same day. */
export function isSameDay(a: string, b: string): boolean {
  return a === b
}

/** -1, 0 or 1, for sorting ISO dates. */
export function compareISODate(a: string, b: string): -1 | 0 | 1 {
  return a < b ? -1 : a > b ? 1 : 0
}

/** Today's local date as "YYYY-MM-DD". */
export function todayISODate(): string {
  return toISODate(new Date())
}

/** The number of days in the month of `iso` (or of a "YYYY-MM" key). */
export function daysInMonth(key: string): number {
  const [year, month] = key.split("-").map(Number)
  return new Date(year, month, 0).getDate()
}
