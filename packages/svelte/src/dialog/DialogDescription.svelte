<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { getDialogContext } from "../shared/context"
  import { DIALOG_DESCRIPTION_CLASSES } from "@glob-ui/recipes"
  let { class: className, children, ...rest }: HTMLAttributes<HTMLParagraphElement> = $props()
  const ctx = getDialogContext("DialogDescription")
</script>

<p id={ctx.descriptionId} class={cn(DIALOG_DESCRIPTION_CLASSES, className)} {...rest}>{@render children?.()}</p>
