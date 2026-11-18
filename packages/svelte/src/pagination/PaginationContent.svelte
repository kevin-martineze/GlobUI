<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { PAGINATION_CONTENT_CLASSES } from "@glob-ui/recipes"

  let { class: className, children, ...rest }: HTMLAttributes<HTMLUListElement> = $props()
</script>

<ul class={cn(PAGINATION_CONTENT_CLASSES, className)} {...rest}>{@render children?.()}</ul>
