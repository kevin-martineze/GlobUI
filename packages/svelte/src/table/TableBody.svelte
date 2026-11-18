<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { TABLE_BODY_CLASSES } from "@glob-ui/recipes"

  let { class: className, children, ...rest }: HTMLAttributes<HTMLTableSectionElement> = $props()
</script>

<tbody class={cn(TABLE_BODY_CLASSES, className)} {...rest}>{@render children?.()}</tbody>
