<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { COMMAND_SHORTCUT_CLASSES } from "@glob-ui/recipes"

  /** A keyboard hint on the right of an item. Hidden from assistive technology: put the shortcut in the item's text if it matters. */
  let { class: className, children, ...rest }: HTMLAttributes<HTMLSpanElement> = $props()
</script>

<span aria-hidden="true" class={cn(COMMAND_SHORTCUT_CLASSES, className)} {...rest}>{@render children?.()}</span>
