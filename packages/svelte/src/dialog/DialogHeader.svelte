<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { DIALOG_HEADER_CLASSES } from "@glob-ui/recipes"
  let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
</script>

<div class={cn(DIALOG_HEADER_CLASSES, className)} {...rest}>{@render children?.()}</div>
