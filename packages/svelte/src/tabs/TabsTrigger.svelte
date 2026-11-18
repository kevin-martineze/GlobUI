<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { triggerVariants } from "@glob-ui/recipes"
  import { getTabsContext } from "../shared/context"
  import { tabsId } from "./ids"

  type Props = Omit<HTMLButtonAttributes, "value"> & { value: string }
  let { value, class: className, disabled, onclick, children, ...rest }: Props = $props()
  const ctx = getTabsContext("TabsTrigger")
  const selected = $derived(ctx.value === value)
</script>

<button
  type="button"
  role="tab"
  id={tabsId(ctx.baseId, "tab", value)}
  aria-controls={tabsId(ctx.baseId, "panel", value)}
  aria-selected={selected}
  data-state={selected ? "active" : "inactive"}
  tabindex={selected ? 0 : -1}
  {disabled}
  class={cn(triggerVariants({ variant: ctx.variant, orientation: ctx.orientation }), className)}
  onclick={(event) => {
    onclick?.(event)
    if (!event.defaultPrevented) ctx.setValue(value)
  }}
  {...rest}
>
  {@render children?.()}
</button>
