// Typeahead: typing characters jumps to the next item whose text starts with them. Framework-free.

export const TYPEAHEAD_RESET_MS = 500

/**
 * Pure matching. `search` is the typed text so far (lower case). A repeated single character
 * ("aaa") cycles through the items that start with it. Returns the matching index, or -1.
 *
 * `startIndex` is the active item. A single character searches from the item after it, so the same
 * letter moves on. Several characters search from the active item itself, so a longer prefix stays put.
 */
export function findTypeaheadIndex(texts: readonly string[], search: string, activeIndex: number): number {
  if (texts.length === 0 || search.length === 0) return -1
  const isRepeat = search.length > 1 && search.split("").every((c) => c === search[0])
  const query = isRepeat ? search[0] : search
  const start = isRepeat || search.length === 1 ? activeIndex + 1 : Math.max(activeIndex, 0)
  for (let i = 0; i < texts.length; i++) {
    const index = (start + i) % texts.length
    if (texts[index].toLowerCase().startsWith(query)) return index
  }
  return -1
}

export interface Typeahead {
  /** Adds a typed character to the buffer and returns the matching index, or -1. */
  type(char: string, texts: readonly string[], activeIndex: number): number
  /** Clears the buffer and its reset timer. Call on destroy. */
  reset(): void
}

/** A typeahead buffer that clears itself after `resetMs` of no typing. */
export function createTypeahead(resetMs: number = TYPEAHEAD_RESET_MS): Typeahead {
  let buffer = ""
  let timer: ReturnType<typeof setTimeout> | undefined
  return {
    type(char, texts, activeIndex) {
      clearTimeout(timer)
      timer = setTimeout(() => (buffer = ""), resetMs)
      buffer += char.toLowerCase()
      return findTypeaheadIndex(texts, buffer, activeIndex)
    },
    reset() {
      clearTimeout(timer)
      buffer = ""
    },
  }
}
