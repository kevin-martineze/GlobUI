<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { TABLE_CAPTION_CLASSES } from "@glob-ui/recipes"

  let { class: className, children, ...rest }: HTMLAttributes<HTMLElement> = $props()
</script>

<caption class={cn(TABLE_CAPTION_CLASSES, className)} {...rest}>{@render children?.()}</caption>
