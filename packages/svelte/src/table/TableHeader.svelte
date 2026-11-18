<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { TABLE_HEADER_CLASSES } from "@glob-ui/recipes"

  let { class: className, children, ...rest }: HTMLAttributes<HTMLTableSectionElement> = $props()
</script>

<thead class={cn(TABLE_HEADER_CLASSES, className)} {...rest}>{@render children?.()}</thead>
