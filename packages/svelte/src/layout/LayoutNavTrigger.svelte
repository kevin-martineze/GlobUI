<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { getContext } from "svelte"
  import { LAYOUT_NAV_KEY, type LayoutNavContext } from "../shared/context"
  import { LAYOUT_NAV_TRIGGER_CLASSES } from "@glob-ui/recipes"

  let { class: className, onclick, ...rest }: HTMLButtonAttributes = $props()
  const nav = getContext<LayoutNavContext | undefined>(LAYOUT_NAV_KEY)
  if (!nav) throw new Error("LayoutNavTrigger must be used inside a layout (AppShellLayout or StackedLayout)")
</script>

<button
  type="button"
  aria-label="Open navigation"
  aria-expanded={nav.open}
  aria-controls={nav.panelId}
  class={cn(
    LAYOUT_NAV_TRIGGER_CLASSES,
    className
  )}
  {...rest}
  onclick={(event) => {
    onclick?.(event)
    if (!event.defaultPrevented) nav.setOpen(true)
  }}
>
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>
