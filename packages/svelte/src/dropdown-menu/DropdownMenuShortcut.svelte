<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { MENU_SHORTCUT_CLASSES } from "@glob-ui/recipes"
  let { class: className, children, ...rest }: HTMLAttributes<HTMLSpanElement> = $props()
</script>

<span class={cn(MENU_SHORTCUT_CLASSES, className)} {...rest}>{@render children?.()}</span>
