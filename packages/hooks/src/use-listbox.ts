import { useEffect, useRef, useState } from "react"

export interface UseListboxOptions<T> {
  /** Base id; option ids are derived from it. */
  id: string
  /** Options currently shown (already filtered), in display order. */
  items: T[]
  getKey: (item: T) => string
  /** Text matched by typeahead. */
  getText: (item: T) => string
  isDisabled?: (item: T) => boolean
  open: boolean
}

const TYPEAHEAD_RESET_MS = 500
const PAGE_SIZE = 10

/**
 * Active-option state for a listbox driven by `aria-activedescendant` (focus stays on the
 * combobox or search input). Handles arrows, Home/End, PageUp/PageDown and typeahead, skips
 * disabled options, and keeps the active option scrolled into view.
 */
export function useListbox<T>({ id, items, getKey, getText, isDisabled, open }: UseListboxOptions<T>) {
  const [activeKeyState, setActiveKey] = useState<string | null>(null)
  const buffer = useRef("")
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const enabled = items.filter((item) => !isDisabled?.(item))
  // If the stored key is filtered out (or unset), the first enabled option is active.
  const activeItem = open ? (enabled.find((item) => getKey(item) === activeKeyState) ?? enabled[0]) : undefined
  const activeKey = activeItem === undefined ? null : getKey(activeItem)
  const optionId = (key: string) => `${id}-option-${encodeURIComponent(key)}`

  function move(to: "next" | "prev" | "first" | "last" | "pageDown" | "pageUp") {
    if (enabled.length === 0) return
    const index = activeItem === undefined ? -1 : enabled.indexOf(activeItem)
    const last = enabled.length - 1
    const next = {
      next: index < 0 ? 0 : Math.min(index + 1, last),
      prev: index < 0 ? last : Math.max(index - 1, 0),
      first: 0,
      last,
      pageDown: Math.min(Math.max(index, 0) + PAGE_SIZE, last),
      pageUp: Math.max(index - PAGE_SIZE, 0),
    }[to]
    setActiveKey(getKey(enabled[next]))
  }

  /** Jumps to the next option starting with the typed text. Repeating one letter cycles. */
  function typeahead(char: string) {
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => (buffer.current = ""), TYPEAHEAD_RESET_MS)
    buffer.current += char.toLowerCase()

    const search = buffer.current
    const isRepeat = search.length > 1 && search.split("").every((c) => c === search[0])
    const query = isRepeat ? search[0] : search
    const index = activeItem === undefined ? -1 : enabled.indexOf(activeItem)
    const start = isRepeat || search.length === 1 ? index + 1 : Math.max(index, 0)
    for (let i = 0; i < enabled.length; i++) {
      const item = enabled[(start + i) % enabled.length]
      if (getText(item).toLowerCase().startsWith(query)) {
        setActiveKey(getKey(item))
        return
      }
    }
  }

  /**
   * Handles navigation keys. Returns true when the key was used (and default prevented).
   * Pass `homeEnd: false` in text inputs, where Home/End move the caret.
   */
  function navigate(e: React.KeyboardEvent, { homeEnd = true, typeahead: allowTypeahead = false } = {}) {
    const keys: Record<string, Parameters<typeof move>[0]> = {
      ArrowDown: "next",
      ArrowUp: "prev",
      PageDown: "pageDown",
      PageUp: "pageUp",
      ...(homeEnd ? { Home: "first", End: "last" } : {}),
    }
    const target = keys[e.key]
    if (target && !e.altKey) {
      e.preventDefault()
      move(target)
      return true
    }
    if (allowTypeahead && isPrintable(e)) {
      e.preventDefault()
      typeahead(e.key)
      return true
    }
    return false
  }

  // Scroll the list itself (not the page) so the active option is visible.
  useEffect(() => {
    if (!open || activeKey === null) return
    const option = document.getElementById(optionId(activeKey))
    const list = option?.closest<HTMLElement>('[role="listbox"]')
    if (!option || !list) return
    const top = option.offsetTop
    const bottom = top + option.offsetHeight
    if (top < list.scrollTop) list.scrollTop = top
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight
    // optionId only depends on id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeKey, id])

  return {
    activeKey,
    activeItem,
    setActiveKey,
    move,
    typeahead,
    navigate,
    optionId,
    /** Value for `aria-activedescendant` on the element that has focus. */
    activeDescendant: activeKey === null ? undefined : optionId(activeKey),
  }
}

/** A single printable character without Ctrl/Meta/Alt (Space excluded). */
export function isPrintable(e: React.KeyboardEvent) {
  return e.key.length === 1 && e.key !== " " && !e.ctrlKey && !e.metaKey && !e.altKey
}
