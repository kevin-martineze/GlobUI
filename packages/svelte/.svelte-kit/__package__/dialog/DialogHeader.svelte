<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
</script>

<div class={cn("flex flex-col gap-1.5 pr-8", className)} {...rest}>{@render children?.()}</div>
