import { useRef } from "react"

export interface UseRovingFocusOptions {
  /** Which arrows move focus. "both" accepts all four. */
  orientation?: "horizontal" | "vertical" | "both"
  /** Wrap from last to first and back. */
  loop?: boolean
  /** Typing printable characters jumps to the next item whose text starts with them. */
  typeahead?: boolean
  /** Items to move between. Disabled ones are excluded by the default selector. */
  itemSelector?: string
  /** Runs after an item receives focus (e.g. to activate a tab). */
  onNavigate?: (item: HTMLElement) => void
}

const DEFAULT_SELECTOR = '[data-roving-item]:not([disabled]):not([aria-disabled="true"])'
const TYPEAHEAD_RESET_MS = 500

/**
 * Keyboard focus movement inside a composite widget (tablist, menu, accordion headers).
 * Spread `rootProps` on the container. Only items whose closest `[data-roving-root]` is this
 * container are used, so nested widgets do not mix.
 */
export function useRovingFocus({
  orientation = "vertical",
  loop = true,
  typeahead = false,
  itemSelector = DEFAULT_SELECTOR,
  onNavigate,
}: UseRovingFocusOptions = {}) {
  const buffer = useRef("")
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function getItems(root: HTMLElement) {
    return Array.from(root.querySelectorAll<HTMLElement>(itemSelector)).filter(
      (item) => item.closest("[data-roving-root]") === root
    )
  }

  function focusItem(item: HTMLElement | undefined) {
    if (!item) return
    item.focus()
    onNavigate?.(item)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
    const root = e.currentTarget
    const items = getItems(root)
    if (items.length === 0) return
    const index = items.indexOf(document.activeElement as HTMLElement)

    const prevKeys = orientation === "horizontal" ? ["ArrowLeft"] : orientation === "vertical" ? ["ArrowUp"] : ["ArrowLeft", "ArrowUp"]
    const nextKeys = orientation === "horizontal" ? ["ArrowRight"] : orientation === "vertical" ? ["ArrowDown"] : ["ArrowRight", "ArrowDown"]

    let target: HTMLElement | undefined
    if (e.key === "Home") target = items[0]
    else if (e.key === "End") target = items[items.length - 1]
    else if (nextKeys.includes(e.key)) {
      if (index === -1) target = items[0]
      else if (index < items.length - 1) target = items[index + 1]
      else if (loop) target = items[0]
    } else if (prevKeys.includes(e.key)) {
      if (index === -1) target = items[items.length - 1]
      else if (index > 0) target = items[index - 1]
      else if (loop) target = items[items.length - 1]
    } else if (typeahead && e.key.length === 1 && e.key !== " ") {
      target = findByTypeahead(items, index, e.key)
      if (!target) return
    } else {
      return
    }

    e.preventDefault()
    focusItem(target)
  }

  function findByTypeahead(items: HTMLElement[], index: number, key: string) {
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => (buffer.current = ""), TYPEAHEAD_RESET_MS)
    buffer.current += key.toLowerCase()

    const search = buffer.current
    // Repeating one letter cycles through items starting with it.
    const isRepeat = search.length > 1 && search.split("").every((c) => c === search[0])
    const query = isRepeat ? search[0] : search
    const start = isRepeat || search.length === 1 ? index + 1 : Math.max(index, 0)
    const text = (item: HTMLElement) => (item.dataset.textValue ?? item.textContent ?? "").trim().toLowerCase()

    for (let i = 0; i < items.length; i++) {
      const item = items[(start + i) % items.length]
      if (text(item).startsWith(query)) return item
    }
    return undefined
  }

  return {
    rootProps: { "data-roving-root": "", onKeyDown },
    onKeyDown,
  }
}
