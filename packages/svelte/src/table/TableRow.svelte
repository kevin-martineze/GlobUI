<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { TABLE_ROW_CLASSES } from "@glob-ui/recipes"

  /** A row. `data-state="selected"` shades it; hovering shades any row. */
  let { class: className, children, ...rest }: HTMLAttributes<HTMLTableRowElement> = $props()
</script>

<tr class={cn(TABLE_ROW_CLASSES, className)} {...rest}>{@render children?.()}</tr>
