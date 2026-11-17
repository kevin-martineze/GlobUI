<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { SKIP_LINK_CLASSES } from "@glob-ui/recipes"

  let {
    targetId,
    class: className,
    children,
    onclick,
    ...rest
  }: HTMLAnchorAttributes & { targetId: string } = $props()
</script>

<a
  href={`#${targetId}`}
  class={cn(
    SKIP_LINK_CLASSES,
    className
  )}
  {...rest}
  onclick={(event) => {
    onclick?.(event)
    if (event.defaultPrevented) return
    event.preventDefault()
    document.getElementById(targetId)?.focus()
  }}
>
  {#if children}{@render children()}{:else}Skip to content{/if}
</a>
