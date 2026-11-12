// Locale helpers. Pure Intl, no framework. The React hooks that depend on the render cycle stay in the adapter.

/** The locale to format with: the one passed in, else the runtime default. */
export function resolveLocale(locale?: string): string {
  return locale ?? new Intl.DateTimeFormat().resolvedOptions().locale
}

/**
 * The first day of the week for a locale, 0 (Sunday) to 6 (Saturday). From `Intl.Locale` week data
 * when the runtime has it (for example es-ES starts on Monday), otherwise Sunday.
 */
export function defaultWeekStart(locale?: string): number {
  try {
    const info = new Intl.Locale(resolveLocale(locale)) as Intl.Locale & {
      weekInfo?: { firstDay: number }
      getWeekInfo?: () => { firstDay: number }
    }
    const firstDay = info.weekInfo?.firstDay ?? info.getWeekInfo?.().firstDay
    // Intl numbers the days 1 (Monday) to 7 (Sunday).
    if (firstDay) return firstDay % 7
  } catch {
    // Unknown locale tag or no Intl.Locale: fall through to Sunday.
  }
  return 0
}

/** Short and long weekday names for the seven columns, starting at `weekStart`. */
export function weekdayNames(locale: string, weekStart: number) {
  const short = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const long = new Intl.DateTimeFormat(locale, { weekday: "long" })
  return Array.from({ length: 7 }, (_, i) => {
    // 2024-01-07 is a Sunday: its getDay() is 0, so day (weekStart + i) % 7 lands on the right column.
    const date = new Date(2024, 0, 7 + ((weekStart + i) % 7))
    return { short: short.format(date), long: long.format(date) }
  })
}

/** Locale used before hydration when none is passed, so server and client HTML match. */
export const FALLBACK_LOCALE = "en-US"
