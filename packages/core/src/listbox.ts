// Listbox navigation for `aria-activedescendant` widgets (focus stays on a combobox or search input).
// Framework-free: the active option is state in the adapter; these functions compute it.

export const LISTBOX_PAGE_SIZE = 10

export type ListboxMove = "next" | "prev" | "first" | "last" | "pageDown" | "pageUp"

/**
 * The index to move to. `index` is the active option among the enabled options (-1 when none is
 * active). `count` is the number of enabled options and must be at least 1.
 */
export function moveListboxIndex(index: number, count: number, move: ListboxMove): number {
  const last = count - 1
  return {
    next: index < 0 ? 0 : Math.min(index + 1, last),
    prev: index < 0 ? last : Math.max(index - 1, 0),
    first: 0,
    last,
    pageDown: Math.min(Math.max(index, 0) + LISTBOX_PAGE_SIZE, last),
    pageUp: Math.max(index - LISTBOX_PAGE_SIZE, 0),
  }[move]
}

/** The move for a key, or `null`. Home/End are skipped when `homeEnd` is false (text inputs keep the caret). */
export function listboxKeyMove(key: string, { homeEnd = true }: { homeEnd?: boolean } = {}): ListboxMove | null {
  if (key === "ArrowDown") return "next"
  if (key === "ArrowUp") return "prev"
  if (key === "PageDown") return "pageDown"
  if (key === "PageUp") return "pageUp"
  if (homeEnd && key === "Home") return "first"
  if (homeEnd && key === "End") return "last"
  return null
}

/** A single printable character without Ctrl/Meta/Alt (Space excluded). */
export function isPrintableKey(event: { key: string; ctrlKey: boolean; metaKey: boolean; altKey: boolean }): boolean {
  return event.key.length === 1 && event.key !== " " && !event.ctrlKey && !event.metaKey && !event.altKey
}

/** The DOM id of an option. The key is encoded, so any option value is a valid id part. */
export function listboxOptionId(base: string, key: string): string {
  return `${base}-option-${encodeURIComponent(key)}`
}

/**
 * Scrolls the list (not the page) so `option` is visible. Only the list's own scroll position changes.
 */
export function scrollOptionIntoView(option: HTMLElement, list: HTMLElement): void {
  const top = option.offsetTop
  const bottom = top + option.offsetHeight
  if (top < list.scrollTop) list.scrollTop = top
  else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight
}
