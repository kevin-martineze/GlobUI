<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLAnchorAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { PAGINATION_LINK_ACTIVE_CLASSES, PAGINATION_LINK_CLASSES } from "@glob-ui/recipes"

  type Props = HTMLAnchorAttributes & {
    /** The current page: sets `aria-current="page"` and a bordered look. */
    isActive?: boolean
    /**
     * Renders the link through this snippet instead of an anchor (React's `asChild`), for example a router link or a
     * button. It receives the attributes to apply, and brings its own content.
     */
    child?: Snippet<[Record<string, unknown>]>
  }
  /** A page link. Use `child` for router links or buttons, so they render the element. */
  let { isActive = false, child, class: className, children, ...rest }: Props = $props()

  const attributes = $derived({
    "aria-current": isActive ? ("page" as const) : undefined,
    ...rest,
    class: cn(PAGINATION_LINK_CLASSES, isActive && PAGINATION_LINK_ACTIVE_CLASSES, className),
  })
</script>

{#if child}
  {@render child(attributes)}
{:else}
  <a {...attributes}>{@render children?.()}</a>
{/if}
