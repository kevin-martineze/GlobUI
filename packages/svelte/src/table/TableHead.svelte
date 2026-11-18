<script lang="ts">
  import type { HTMLThAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { TABLE_ALIGN_CLASSES, TABLE_HEAD_CLASSES } from "@glob-ui/recipes"

  type Props = HTMLThAttributes & {
    /** Text alignment. Numbers read best right-aligned. */
    align?: "left" | "center" | "right"
  }
  let { class: className, align = "left", children, ...rest }: Props = $props()
</script>

<th class={cn(TABLE_HEAD_CLASSES, TABLE_ALIGN_CLASSES[align], className)} {...rest}>{@render children?.()}</th>
