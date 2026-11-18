<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { FLOATING_TRANSITION_CLASSES, POPOVER_CONTENT_CLASSES } from "@glob-ui/recipes"
  import { getPopoverContext } from "../shared/context"
  import { withStyle } from "../shared/floating.svelte"

  let { class: className, style, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
  const ctx = getPopoverContext("PopoverContent")
</script>

<!-- Named by its trigger unless the caller passes aria-label or aria-labelledby. -->
<div
  bind:this={ctx.panel.panel}
  id={ctx.contentId}
  popover="auto"
  role="dialog"
  aria-labelledby={ctx.triggerId}
  tabindex="-1"
  style={withStyle(ctx.panel.style, style)}
  class={cn(POPOVER_CONTENT_CLASSES, FLOATING_TRANSITION_CLASSES, className)}
  {...rest}
>
  {@render children?.()}
</div>
