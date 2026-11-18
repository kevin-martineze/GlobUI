<script lang="ts">
  import type { HTMLLiAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { PAGINATION_ITEM_CLASSES } from "@glob-ui/recipes"

  let { class: className, children, ...rest }: HTMLLiAttributes = $props()
</script>

<li class={cn(PAGINATION_ITEM_CLASSES, className)} {...rest}>{@render children?.()}</li>
