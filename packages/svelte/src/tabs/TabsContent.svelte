<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { TABS_CONTENT_CLASSES } from "@glob-ui/recipes"
  import { getTabsContext } from "../shared/context"
  import { tabsId } from "./ids"

  type Props = HTMLAttributes<HTMLDivElement> & { value: string }
  let { value, class: className, children, ...rest }: Props = $props()
  const ctx = getTabsContext("TabsContent")
  const selected = $derived(ctx.value === value)
</script>

<!-- tabindex 0 lets keyboard users reach panels that have no focusable content. -->
<div
  role="tabpanel"
  id={tabsId(ctx.baseId, "panel", value)}
  aria-labelledby={tabsId(ctx.baseId, "tab", value)}
  hidden={!selected}
  tabindex="0"
  data-state={selected ? "active" : "inactive"}
  class={cn(TABS_CONTENT_CLASSES, className)}
  {...rest}
>
  {#if selected}{@render children?.()}{/if}
</div>
