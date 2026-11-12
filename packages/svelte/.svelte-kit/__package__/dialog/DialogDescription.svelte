<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { getDialogContext } from "../shared/context"
  let { class: className, children, ...rest }: HTMLAttributes<HTMLParagraphElement> = $props()
  const ctx = getDialogContext("DialogDescription")
</script>

<p id={ctx.descriptionId} class={cn("text-sm text-glob-text-secondary", className)} {...rest}>{@render children?.()}</p>
