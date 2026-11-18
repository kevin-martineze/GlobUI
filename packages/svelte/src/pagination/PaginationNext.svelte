<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLAnchorAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { PAGINATION_ICON_CLASSES, PAGINATION_NEXT_CLASSES } from "@glob-ui/recipes"
  import PaginationLink from "./PaginationLink.svelte"

  type Props = HTMLAnchorAttributes & {
    isActive?: boolean
    /** Sets `aria-disabled` and drops `href`, so the link cannot be followed. It keeps the link role. */
    disabled?: boolean
    /** Renders through this snippet instead of an anchor (see PaginationLink). The snippet brings its own content. */
    child?: Snippet<[Record<string, unknown>]>
  }
  /** The next-page link. `children` replaces the "Next" text; the arrow stays. */
  let { disabled = false, href, class: className, child, children, ...rest }: Props = $props()
</script>

<PaginationLink
  aria-label="Go to next page"
  aria-disabled={disabled || undefined}
  href={disabled ? undefined : href}
  role={child ? undefined : disabled ? "link" : undefined}
  tabindex={disabled ? -1 : undefined}
  {child}
  class={cn(PAGINATION_NEXT_CLASSES, className)}
  {...rest}
>
  {#if children}{@render children()}{:else}<span>Next</span>{/if}
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class={PAGINATION_ICON_CLASSES}>
    <path d="M9 18l6-6-6-6" />
  </svg>
</PaginationLink>
