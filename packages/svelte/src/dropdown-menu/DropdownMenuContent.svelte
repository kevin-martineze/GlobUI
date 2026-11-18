<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { createRovingFocus } from "@glob-ui/core"
  import { FLOATING_TRANSITION_CLASSES, MENU_CONTENT_CLASSES } from "@glob-ui/recipes"
  import { getMenuContext } from "../shared/context"
  import { withStyle } from "../shared/floating.svelte"
  import { MENU_ITEM_SELECTOR } from "./items"

  let { class: className, style, onkeydown, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
  const ctx = getMenuContext("DropdownMenuContent")
  const roving = createRovingFocus({ orientation: "vertical", loop: true, typeahead: true, itemSelector: MENU_ITEM_SELECTOR })
  $effect(() => () => roving.destroy())
</script>

<div
  bind:this={ctx.panel.panel}
  id={ctx.contentId}
  popover="auto"
  role="menu"
  aria-orientation="vertical"
  aria-labelledby={ctx.triggerId}
  tabindex="-1"
  data-roving-root=""
  style={withStyle(ctx.panel.style, style)}
  onkeydown={(e) => {
    onkeydown?.(e)
    // Tab leaves the menu: close it and let focus move on (no preventDefault).
    if (e.key === "Tab") {
      ctx.setOpen(false)
      return
    }
    roving.handleKeyDown(e)
  }}
  class={cn(MENU_CONTENT_CLASSES, FLOATING_TRANSITION_CLASSES, className)}
  {...rest}
>
  {@render children?.()}
</div>
