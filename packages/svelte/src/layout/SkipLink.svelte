<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"

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
    "sr-only z-50 rounded-glob-md bg-glob-surface px-3 py-2 text-sm font-medium text-glob-text shadow-glob-md focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring",
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
