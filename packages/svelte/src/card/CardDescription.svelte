<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { CARD_DESCRIPTION_CLASSES } from "@glob-ui/recipes"

  let { class: className, children, ...rest }: HTMLAttributes<HTMLElement> = $props()
</script>

<p class={cn(CARD_DESCRIPTION_CLASSES, className)} {...rest}>{@render children?.()}</p>
