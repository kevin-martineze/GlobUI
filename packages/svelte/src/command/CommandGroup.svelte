<script lang="ts">
  import { setContext, type Snippet } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { COMMAND_GROUP_CLASSES, COMMAND_GROUP_HEADING_CLASSES } from "@glob-ui/recipes"
  import { COMMAND_GROUP_KEY, getCommandContext } from "../shared/context"

  /** A labelled set of items. It is hidden while none of its items are visible. */
  let {
    heading,
    class: className,
    children,
    ...rest
  }: HTMLAttributes<HTMLDivElement> & {
    /** The group's visible name. */
    heading?: string | Snippet
  } = $props()

  const ctx = getCommandContext("CommandGroup")
  const groupId = $props.id()
  const headingId = `${groupId}-heading`
  setContext(COMMAND_GROUP_KEY, groupId)
  const anyVisible = $derived(ctx.listItems.some((item) => item.groupId === groupId))
</script>

<div role="group" aria-labelledby={heading ? headingId : undefined} hidden={!anyVisible} class={cn(COMMAND_GROUP_CLASSES, className)} {...rest}>
  {#if heading}
    <div id={headingId} class={COMMAND_GROUP_HEADING_CLASSES}>
      {#if typeof heading === "function"}{@render heading()}{:else}{heading}{/if}
    </div>
  {/if}
  <!-- Children stay mounted while hidden, so they keep registering with the root. -->
  {@render children?.()}
</div>
