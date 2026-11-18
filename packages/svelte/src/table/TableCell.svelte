<script lang="ts">
  import type { HTMLTdAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { TABLE_ALIGN_CLASSES, TABLE_CELL_CLASSES } from "@glob-ui/recipes"

  type Props = HTMLTdAttributes & { align?: "left" | "center" | "right" }
  let { class: className, align = "left", children, ...rest }: Props = $props()
</script>

<td class={cn(TABLE_CELL_CLASSES, TABLE_ALIGN_CLASSES[align], className)} {...rest}>{@render children?.()}</td>
