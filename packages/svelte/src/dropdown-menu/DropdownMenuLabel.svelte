<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { MENU_LABEL_CLASSES, MENU_LABEL_INSET_CLASSES } from "@glob-ui/recipes"
  let { class: className, inset, children, ...rest }: HTMLAttributes<HTMLDivElement> & { inset?: boolean } = $props()
</script>

<div class={cn(MENU_LABEL_CLASSES, inset && MENU_LABEL_INSET_CLASSES, className)} {...rest}>{@render children?.()}</div>
