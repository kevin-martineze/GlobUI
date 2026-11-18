<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLAnchorAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { PAGINATION_ICON_CLASSES, PAGINATION_PREVIOUS_CLASSES } from "@glob-ui/recipes"
  import PaginationLink from "./PaginationLink.svelte"

  type Props = HTMLAnchorAttributes & {
    isActive?: boolean
    /** Sets `aria-disabled` and drops `href`, so the link cannot be followed. It keeps the link role. */
    disabled?: boolean
    /** Renders through this snippet instead of an anchor (see PaginationLink). The snippet brings its own content. */
    child?: Snippet<[Record<string, unknown>]>
  }
  /** The previous-page link. `children` replaces the "Previous" text; the arrow stays. */
  let { disabled = false, href, class: className, child, children, ...rest }: Props = $props()
</script>

<PaginationLink
  aria-label="Go to previous page"
  aria-disabled={disabled || undefined}
  href={disabled ? undefined : href}
  role={child ? undefined : disabled ? "link" : undefined}
  tabindex={disabled ? -1 : undefined}
  {child}
  class={cn(PAGINATION_PREVIOUS_CLASSES, className)}
  {...rest}
>
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class={PAGINATION_ICON_CLASSES}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
  {#if children}{@render children()}{:else}<span>Previous</span>{/if}
</PaginationLink>
