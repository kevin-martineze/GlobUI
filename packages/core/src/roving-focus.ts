// Roving focus: arrow keys (and Home/End, typeahead) move focus between the items of a composite
// widget such as a tablist, a menu or an accordion. Framework-free.

import { createTypeahead, type Typeahead } from "./typeahead"

export type RovingOrientation = "horizontal" | "vertical" | "both"

export interface RovingFocusOptions {
  /** Which arrows move focus. "both" accepts all four. */
  orientation?: RovingOrientation
  /** Wrap from last to first and back. */
  loop?: boolean
  /** Typing printable characters jumps to the next item whose text starts with them. */
  typeahead?: boolean
  /** Items to move between. Disabled ones are excluded by the default selector. */
  itemSelector?: string
  /** Runs after an item receives focus (e.g. to activate a tab). */
  onNavigate?: (item: HTMLElement) => void
}

export const ROVING_ITEM_SELECTOR = '[data-roving-item]:not([disabled]):not([aria-disabled="true"])'

/** The keyboard event fields the controller reads. A DOM KeyboardEvent or a framework's synthetic event fits. */
export interface RovingKeyEvent {
  key: string
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  defaultPrevented: boolean
  currentTarget: EventTarget | null
  preventDefault(): void
}

/**
 * Pure movement for a navigation key, given the item count and the active index (-1 when no item has
 * focus). Returns `null` when `key` is not a navigation key, `-1` when it is one but focus has nowhere
 * to go (the end of a list without `loop`; the key is still consumed), else the index to focus.
 * Typeahead is not handled here.
 */
export function nextRovingIndex(
  key: string,
  index: number,
  count: number,
  { orientation = "vertical", loop = true }: Pick<RovingFocusOptions, "orientation" | "loop"> = {}
): number | null {
  if (count === 0) return null
  const last = count - 1
  const prevKeys = orientation === "horizontal" ? ["ArrowLeft"] : orientation === "vertical" ? ["ArrowUp"] : ["ArrowLeft", "ArrowUp"]
  const nextKeys = orientation === "horizontal" ? ["ArrowRight"] : orientation === "vertical" ? ["ArrowDown"] : ["ArrowRight", "ArrowDown"]
  if (key === "Home") return 0
  if (key === "End") return last
  if (nextKeys.includes(key)) {
    if (index === -1) return 0
    if (index < last) return index + 1
    return loop ? 0 : -1
  }
  if (prevKeys.includes(key)) {
    if (index === -1) return last
    if (index > 0) return index - 1
    return loop ? last : -1
  }
  return null
}

/** Items of `root` whose closest `[data-roving-root]` is `root`, so nested widgets do not mix. */
export function getRovingItems(root: HTMLElement, itemSelector: string = ROVING_ITEM_SELECTOR): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(itemSelector)).filter((item) => item.closest("[data-roving-root]") === root)
}

export interface RovingFocusController {
  /** Handles a keydown whose `currentTarget` is the root. Call it from the root's keydown handler. */
  handleKeyDown(event: RovingKeyEvent): void
  /** Replaces the options. Cheap: call it on every render. */
  update(options: RovingFocusOptions): void
  /** Clears the typeahead timer. */
  destroy(): void
}

/**
 * The keydown controller. Use `rootAttributes` on the root (`data-roving-root`) so nested widgets are
 * excluded, and call `handleKeyDown` from its keydown listener.
 */
export function createRovingFocus(options: RovingFocusOptions = {}): RovingFocusController {
  let current = options
  let typeahead: Typeahead | undefined

  return {
    handleKeyDown(event) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
      const root = event.currentTarget as HTMLElement | null
      if (!root) return
      const items = getRovingItems(root, current.itemSelector)
      if (items.length === 0) return
      const doc = root.ownerDocument
      const index = items.indexOf(doc.activeElement as HTMLElement)

      let targetIndex = nextRovingIndex(event.key, index, items.length, current)
      if (targetIndex === null) {
        // Not a navigation key: typeahead may still take it. No match leaves the key to the page.
        if (!current.typeahead || event.key.length !== 1 || event.key === " ") return
        typeahead ??= createTypeahead()
        targetIndex = typeahead.type(
          event.key,
          items.map((item) => (item.dataset.textValue ?? item.textContent ?? "").trim()),
          index
        )
        if (targetIndex === -1) return
      }

      // A navigation key is consumed even when focus cannot move (end of a list without loop).
      event.preventDefault()
      if (targetIndex === -1) return
      const item = items[targetIndex]
      item.focus()
      current.onNavigate?.(item)
    },
    update(next) {
      current = next
    },
    destroy() {
      typeahead?.reset()
    },
  }
}

/**
 * Vanilla DOM use: wires `createRovingFocus` to a root element's keydown and marks the root.
 * Returns a function that removes the listener.
 */
export function attachRovingFocus(root: HTMLElement, options: RovingFocusOptions = {}): () => void {
  const controller = createRovingFocus(options)
  root.setAttribute("data-roving-root", "")
  const listener = (event: KeyboardEvent) => controller.handleKeyDown(event)
  root.addEventListener("keydown", listener)
  return () => {
    root.removeEventListener("keydown", listener)
    controller.destroy()
  }
}
