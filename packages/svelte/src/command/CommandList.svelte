<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { COMMAND_LIST_CLASSES } from "@glob-ui/recipes"
  import { getCommandContext } from "../shared/context"

  let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
  const ctx = getCommandContext("CommandList")
</script>

<div id={ctx.listId} role="listbox" aria-label={ctx.label} class={cn(COMMAND_LIST_CLASSES, className)} {...rest}>
  {@render children?.()}
</div>
