<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { COMMAND_EMPTY_CLASSES } from "@glob-ui/recipes"
  import { getCommandContext } from "../shared/context"

  /** Shown only when no item is visible. Put it next to CommandList, not inside it. */
  let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
  const ctx = getCommandContext("CommandEmpty")
</script>

{#if ctx.listItems.length === 0}
  <div role="status" class={cn(COMMAND_EMPTY_CLASSES, className)} {...rest}>
    {#if children}{@render children()}{:else}No results.{/if}
  </div>
{/if}
