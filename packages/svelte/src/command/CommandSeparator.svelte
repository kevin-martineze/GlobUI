<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { COMMAND_SEPARATOR_CLASSES } from "@glob-ui/recipes"
  import { getCommandContext } from "../shared/context"

  /** A rule between groups. Hidden while the user is searching. */
  let { class: className, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
  const ctx = getCommandContext("CommandSeparator")
</script>

<div role="none" hidden={ctx.search !== ""} class={cn(COMMAND_SEPARATOR_CLASSES, className)} {...rest}></div>
