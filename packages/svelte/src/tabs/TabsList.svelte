<script lang="ts">
  import { onDestroy } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { createRovingFocus } from "@glob-ui/core"
  import { listVariants } from "@glob-ui/recipes"
  import { getTabsContext } from "../shared/context"

  let { class: className, onkeydown, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
  const ctx = getTabsContext("TabsList")
  let list = $state<HTMLDivElement>()

  // Roving focus with automatic activation: moving focus selects the tab.
  const roving = createRovingFocus()
  $effect.pre(() => {
    roving.update({ orientation: ctx.orientation, loop: true, itemSelector: '[role="tab"]:not([disabled])', onNavigate: (tab) => tab.click() })
  })
  onDestroy(() => roving.destroy())

  // Exactly one tab stop: the selected enabled tab, or the first enabled tab when `value` matches none (or only a
  // disabled one). Runs after the triggers have updated their own tabindex.
  $effect(() => {
    void ctx.value
    if (!list) return
    const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]')).filter(
      (tab) => tab.closest('[role="tablist"]') === list
    )
    const enabled = tabs.filter((tab) => !tab.disabled)
    const stop = enabled.find((tab) => tab.getAttribute("aria-selected") === "true") ?? enabled[0]
    for (const tab of tabs) tab.tabIndex = tab === stop ? 0 : -1
  })
</script>

<!-- The tabs take focus (one tab stop, arrows move between them); the list itself is not focusable. -->
<div
  bind:this={list}
  role="tablist"
  aria-orientation={ctx.orientation}
  class={cn(listVariants({ variant: ctx.variant, orientation: ctx.orientation }), className)}
  data-roving-root=""
  onkeydown={(event) => {
    onkeydown?.(event)
    roving.handleKeyDown(event)
  }}
  {...rest}
>
  {@render children?.()}
</div>
