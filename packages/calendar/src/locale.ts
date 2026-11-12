import { useSyncExternalStore } from "react"
import { FALLBACK_LOCALE, resolveLocale } from "@glob-ui/core"

export { resolveLocale, defaultWeekStart, weekdayNames, FALLBACK_LOCALE } from "@glob-ui/core"

const subscribeNever = () => () => {}

/**
 * False on the server and during hydration, true after. Lets values that depend on the browser
 * (its locale, today's date) render the same HTML on both sides, then update on the client.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribeNever, () => true, () => false)
}

/**
 * The locale to render with. A passed locale is used as is. Without one, the server and the first
 * client render use `FALLBACK_LOCALE`, then the browser's locale takes over. Pass `locale` in
 * server-rendered apps to avoid that switch.
 */
export function useResolvedLocale(locale?: string): string {
  const hydrated = useHydrated()
  if (locale) return locale
  return hydrated ? resolveLocale() : FALLBACK_LOCALE
}
