<script lang="ts">
  import { setContext, type Snippet } from "svelte"
  import { cn } from "@glob-ui/utils"
  import { SCROLL_CLASSES } from "@glob-ui/recipes"
  import { LAYOUT_SCROLL_KEY } from "../shared/context"

  type Tag = "div" | "header" | "nav" | "main" | "aside" | "footer" | "section"
  let {
    name,
    scroll,
    as = "div",
    class: className,
    children,
    ...rest
  }: {
    /** The slot name, rendered as `data-slot`. */
    name: string
    /** `fixed` never scrolls. `scroll` is the one region that scrolls for this part of the screen. */
    scroll: "fixed" | "scroll"
    as?: Tag
    class?: string
    children?: Snippet
    [key: string]: unknown
  } = $props()

  // Read once: whether this slot provides the scroll context is fixed for its lifetime.
  // svelte-ignore state_referenced_locally
  const isScroll = scroll === "scroll"
  let element: HTMLElement | null = $state(null)
  if (isScroll) {
    // The scroll element for everything inside this region. Provided once, read through the getter.
    setContext(LAYOUT_SCROLL_KEY, {
      get element() {
        return element
      },
    })
  }
</script>

<svelte:element
  this={as}
  bind:this={element}
  data-slot={name}
  data-scroll={scroll}
  tabindex={isScroll ? 0 : undefined}
  class={isScroll ? cn(SCROLL_CLASSES, className) : className}
  {...rest}
>
  {@render children?.()}
</svelte:element>
