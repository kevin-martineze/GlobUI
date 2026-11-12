// Scroll ownership and scroll lock. Framework-free: works on the DOM only.

let lockCount = 0
let savedStyles: { overflow: string; paddingRight: string } | null = null

/**
 * Stops the document from scrolling while the returned `unlock` is not called. Nested locks are
 * counted: the page unlocks when the last one is released. The scrollbar width is compensated so
 * the page does not shift sideways when the scrollbar disappears.
 */
export function lockScroll(doc: Document = document): () => void {
  const html = doc.documentElement
  const win = doc.defaultView ?? window
  if (lockCount === 0) {
    const scrollbarWidth = win.innerWidth - html.clientWidth
    savedStyles = { overflow: html.style.overflow, paddingRight: html.style.paddingRight }
    if (scrollbarWidth > 0) {
      const current = parseFloat(win.getComputedStyle(html).paddingRight) || 0
      html.style.paddingRight = `${current + scrollbarWidth}px`
    }
    html.style.overflow = "hidden"
  }
  lockCount++
  let released = false
  return () => {
    if (released) return
    released = true
    lockCount--
    if (lockCount === 0 && savedStyles) {
      html.style.overflow = savedStyles.overflow
      html.style.paddingRight = savedStyles.paddingRight
      savedStyles = null
    }
  }
}

/** Number of scroll locks currently held. Exposed for tests. */
export function scrollLockCount(): number {
  return lockCount
}

/**
 * The scroll element for the code inside a layout: the nearest `[data-scroll="scroll"]` ancestor of
 * `from` (inclusive), else `document.scrollingElement`. Layouts mark their one scroll region this way,
 * so a page calls this instead of knowing the layout's structure.
 */
export function getLayoutScroll(from: Element | null = null, doc: Document = document): HTMLElement | null {
  const region = from?.closest<HTMLElement>('[data-scroll="scroll"]')
  if (region) return region
  return (doc.scrollingElement as HTMLElement | null) ?? null
}
