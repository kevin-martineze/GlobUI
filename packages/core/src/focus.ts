// Focus memory for overlays. Framework-free.

/**
 * Remembers the element that has focus now, so it can get focus back when the overlay closes.
 * Call it right before the overlay takes focus.
 */
export function rememberFocus(doc: Document = document): { restore(): void } {
  const previous = doc.activeElement as HTMLElement | null
  return {
    restore() {
      previous?.focus()
    },
  }
}

/**
 * True when focus has left the overlay without a target: nothing is focused, the body is focused, or
 * focus is still inside `container`. A click that moved focus elsewhere keeps its own focus.
 */
export function shouldRestoreFocus(container: Element | null, doc: Document = document): boolean {
  const active = doc.activeElement
  if (!active || active === doc.body) return true
  return container !== null && container.contains(active)
}
