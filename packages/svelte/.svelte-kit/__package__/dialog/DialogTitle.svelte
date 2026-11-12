<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { getDialogContext } from "../shared/context"
  let { class: className, children, ...rest }: HTMLAttributes<HTMLHeadingElement> = $props()
  const ctx = getDialogContext("DialogTitle")
</script>

<h2 id={ctx.titleId} class={cn("text-lg font-semibold leading-none tracking-tight", className)} {...rest}>{@render children?.()}</h2>
