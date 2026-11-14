<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLDialogAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { sheetVariants } from "@glob-ui/recipes"
  import DialogContentBase from "../dialog/DialogContentBase.svelte"
  import DialogCloseIcon from "../dialog/DialogCloseIcon.svelte"
  import { SHEET_BODY_CLASSES } from "@glob-ui/recipes"

  type Side = "left" | "right" | "top" | "bottom"
  type Size = "sm" | "md" | "lg"
  let {
    class: className,
    side = "right",
    size = "md",
    showCloseButton = true,
    children,
    ...rest
  }: HTMLDialogAttributes & { side?: Side; size?: Size; showCloseButton?: boolean; children?: Snippet } = $props()
</script>

<DialogContentBase class={cn(sheetVariants({ side, size, className }))} {...rest}>
  <div class={SHEET_BODY_CLASSES}>
    {@render children?.()}
    {#if showCloseButton}<DialogCloseIcon />{/if}
  </div>
</DialogContentBase>
