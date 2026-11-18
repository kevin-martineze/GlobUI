<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { PAGINATION_CLASSES } from "@glob-ui/recipes"

  /** The page navigation landmark. */
  let { class: className, children, ...rest }: HTMLAttributes<HTMLElement> = $props()
</script>

<nav aria-label="Pagination" class={cn(PAGINATION_CLASSES, className)} {...rest}>{@render children?.()}</nav>
