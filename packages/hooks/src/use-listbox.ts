import { useEffect, useState } from "react"
import {
  createTypeahead,
  isPrintableKey,
  listboxKeyMove,
  listboxOptionId,
  moveListboxIndex,
  scrollOptionIntoView,
} from "@glob-ui/core"

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

/**
 * Active-option state for a listbox driven by `aria-activedescendant` (focus stays on the
 * combobox or search input). Handles arrows, Home/End, PageUp/PageDown and typeahead, skips
 * disabled options, and keeps the active option scrolled into view. The rules live in `@glob-ui/core`.
 */
export function useListbox<T>({ id, items, getKey, getText, isDisabled, open }: UseListboxOptions<T>) {
  const [activeKeyState, setActiveKey] = useState<string | null>(null)
  const [typeahead] = useState(() => createTypeahead())
  useEffect(() => () => typeahead.reset(), [typeahead])

  const enabled = items.filter((item) => !isDisabled?.(item))
  // If the stored key is filtered out (or unset), the first enabled option is active.
  const activeItem = open ? (enabled.find((item) => getKey(item) === activeKeyState) ?? enabled[0]) : undefined
  const activeKey = activeItem === undefined ? null : getKey(activeItem)
  const optionId = (key: string) => listboxOptionId(id, key)

  function move(to: Parameters<typeof moveListboxIndex>[2]) {
    if (enabled.length === 0) return
    const index = activeItem === undefined ? -1 : enabled.indexOf(activeItem)
    setActiveKey(getKey(enabled[moveListboxIndex(index, enabled.length, to)]))
  }

  /** Jumps to the next option starting with the typed text. Repeating one letter cycles. */
  function typeaheadTo(char: string) {
    const index = activeItem === undefined ? -1 : enabled.indexOf(activeItem)
    const found = typeahead.type(char, enabled.map(getText), index)
    if (found !== -1) setActiveKey(getKey(enabled[found]))
  }

  /**
   * Handles navigation keys. Returns true when the key was used (and default prevented).
   * Pass `homeEnd: false` in text inputs, where Home/End move the caret.
   */
  function navigate(e: React.KeyboardEvent, { homeEnd = true, typeahead: allowTypeahead = false } = {}) {
    const to = listboxKeyMove(e.key, { homeEnd })
    if (to && !e.altKey) {
      e.preventDefault()
      move(to)
      return true
    }
    if (allowTypeahead && isPrintableKey(e)) {
      e.preventDefault()
      typeaheadTo(e.key)
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
    scrollOptionIntoView(option, list)
    // optionId only depends on id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeKey, id])

  return {
    activeKey,
    activeItem,
    setActiveKey,
    move,
    typeahead: typeaheadTo,
    navigate,
    optionId,
    /** Value for `aria-activedescendant` on the element that has focus. */
    activeDescendant: activeKey === null ? undefined : optionId(activeKey),
  }
}

/** A single printable character without Ctrl/Meta/Alt (Space excluded). */
export function isPrintable(e: React.KeyboardEvent) {
  return isPrintableKey(e)
}
