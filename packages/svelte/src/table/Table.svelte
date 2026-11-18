<script lang="ts">
  import type { HTMLTableAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import {
    TABLE_CLASSES,
    TABLE_CONTAINER_CLASSES,
    TABLE_CONTAINER_FOCUSABLE_CLASSES,
    TABLE_DENSITY_CLASSES,
    TABLE_STICKY_HEADER_CLASSES,
    TABLE_STRIPED_CLASSES,
  } from "@glob-ui/recipes"

  type Props = HTMLTableAttributes & {
    /** Cell padding. Default "default". */
    density?: "compact" | "default" | "comfortable"
    /** Alternating row background. */
    striped?: boolean
    /**
     * Keeps the header row in view while the body scrolls. The scroll container is the table's own wrapper, so give
     * the wrapper a height (for example `containerClass="max-h-96"`).
     */
    stickyHeader?: boolean
    /**
     * Makes the wrapper a named, focusable scroll region. Use it when the table can be wider than the screen, so
     * keyboard users can scroll it with the arrow keys. Without it, the wrapper is not focusable.
     */
    scrollLabel?: string
    /** Classes for the wrapper div (the element that scrolls). */
    containerClass?: string
  }
  /** A styled table. The table owns its horizontal scroll: the page itself never scrolls sideways. */
  let {
    class: className,
    containerClass,
    density = "default",
    striped = false,
    stickyHeader = false,
    scrollLabel,
    children,
    ...rest
  }: Props = $props()
  const focusable = $derived(scrollLabel !== undefined)
</script>

<!-- A named scroll region takes focus so keyboard users can scroll it; without a name it is a plain div. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  role={focusable ? "region" : undefined}
  aria-label={scrollLabel}
  tabindex={focusable ? 0 : undefined}
  class={cn(TABLE_CONTAINER_CLASSES, focusable && TABLE_CONTAINER_FOCUSABLE_CLASSES, containerClass)}
>
  <table
    class={cn(
      TABLE_CLASSES,
      TABLE_DENSITY_CLASSES[density],
      striped && TABLE_STRIPED_CLASSES,
      stickyHeader && TABLE_STICKY_HEADER_CLASSES,
      className
    )}
    {...rest}
  >
    {@render children?.()}
  </table>
</div>
