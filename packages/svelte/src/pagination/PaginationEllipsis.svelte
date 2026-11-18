<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { PAGINATION_ELLIPSIS_CLASSES, PAGINATION_ICON_CLASSES } from "@glob-ui/recipes"

  /** Stands for hidden pages. Its dots are decorative; a screen reader hears "More pages". */
  let { class: className, ...rest }: HTMLAttributes<HTMLSpanElement> = $props()
</script>

<span class={cn(PAGINATION_ELLIPSIS_CLASSES, className)} {...rest}>
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" class={PAGINATION_ICON_CLASSES}>
    <circle cx="5" cy="12" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="19" cy="12" r="1.5" />
  </svg>
  <span class="sr-only">More pages</span>
</span>
