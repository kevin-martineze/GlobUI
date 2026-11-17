<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { getDialogContext } from "../shared/context"
  import { DIALOG_TITLE_CLASSES } from "@glob-ui/recipes"
  let { class: className, children, ...rest }: HTMLAttributes<HTMLHeadingElement> = $props()
  const ctx = getDialogContext("DialogTitle")
</script>

<h2 id={ctx.titleId} class={cn(DIALOG_TITLE_CLASSES, className)} {...rest}>{@render children?.()}</h2>
