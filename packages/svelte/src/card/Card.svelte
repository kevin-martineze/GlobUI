<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { CARD_CLASSES } from "@glob-ui/recipes"

  let { class: className, children, ...rest }: HTMLAttributes<HTMLElement> = $props()
</script>

<div class={cn(CARD_CLASSES, className)} {...rest}>{@render children?.()}</div>
