// useLayoutScroll for Vue: a composable returning a computed ref to the nearest scroll region of the layout,
// or the document scrolling element outside one. Null on the server.

import { computed, inject, type ComputedRef } from "vue"
import { getLayoutScroll } from "@glob-ui/core"
import { LAYOUT_SCROLL_KEY } from "../shared/context"

export function useLayoutScroll(): ComputedRef<HTMLElement | null> {
  const scroll = inject(LAYOUT_SCROLL_KEY, null)
  return computed(() => {
    if (scroll?.element.value) return scroll.element.value
    if (typeof document === "undefined") return null
    return getLayoutScroll(null)
  })
}
