export type PageItem = number | "ellipsis"

export interface PageRangeOptions {
  /** The current page, 1-based. Clamped to 1..pageCount. */
  page: number
  pageCount: number
  /** Pages shown on each side of the current page. Default 1. */
  siblings?: number
  /** Pages always shown at the start and at the end. Default 1. */
  boundaries?: number
}

/**
 * The page numbers to show, in order, with "ellipsis" where pages are hidden. The first and last `boundaries`
 * pages and the `siblings` around `page` are shown. A gap of exactly one hidden page is shown as that page
 * (an ellipsis would hide nothing), so a short gap never becomes an ellipsis.
 */
export function getPageRange({ page, pageCount, siblings = 1, boundaries = 1 }: PageRangeOptions): PageItem[] {
  if (pageCount <= 0) return []
  const current = Math.min(Math.max(Math.floor(page), 1), pageCount)
  const shown = new Set<number>()
  for (let i = 1; i <= Math.min(boundaries, pageCount); i++) shown.add(i)
  for (let i = Math.max(pageCount - boundaries + 1, 1); i <= pageCount; i++) shown.add(i)
  for (let i = current - siblings; i <= current + siblings; i++) {
    if (i >= 1 && i <= pageCount) shown.add(i)
  }

  const sorted = [...shown].sort((a, b) => a - b)
  const items: PageItem[] = []
  sorted.forEach((n, index) => {
    if (index > 0) {
      const gap = n - sorted[index - 1]
      // One hidden page is shown; two or more become an ellipsis.
      if (gap === 2) items.push(n - 1)
      else if (gap > 2) items.push("ellipsis")
    }
    items.push(n)
  })
  return items
}
