<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import DialogFooter from "../dialog/DialogFooter.svelte"
  import { SHEET_FOOTER_CLASSES } from "@glob-ui/recipes"
  let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
</script>

<DialogFooter class={cn(SHEET_FOOTER_CLASSES, className)} {...rest}>{@render children?.()}</DialogFooter>
