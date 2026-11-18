<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { TABLE_FOOTER_CLASSES } from "@glob-ui/recipes"

  let { class: className, children, ...rest }: HTMLAttributes<HTMLTableSectionElement> = $props()
</script>

<tfoot class={cn(TABLE_FOOTER_CLASSES, className)} {...rest}>{@render children?.()}</tfoot>
