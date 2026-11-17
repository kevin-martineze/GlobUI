<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { ALERT_TITLE_CLASSES } from "@glob-ui/recipes"

  let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
</script>

<div class={cn(ALERT_TITLE_CLASSES, className)} {...rest}>{@render children?.()}</div>
