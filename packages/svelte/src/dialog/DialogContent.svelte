<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLDialogAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { dialogVariants } from "@glob-ui/recipes"
  import DialogContentBase from "./DialogContentBase.svelte"
  import DialogCloseIcon from "./DialogCloseIcon.svelte"
  import { DIALOG_BODY_CLASSES } from "@glob-ui/recipes"

  type Size = "sm" | "md" | "lg"
  let {
    class: className,
    size = "md",
    showCloseButton = true,
    children,
    ...rest
  }: HTMLDialogAttributes & { size?: Size; showCloseButton?: boolean; children?: Snippet } = $props()
</script>

<DialogContentBase class={cn(dialogVariants({ size, className }))} {...rest}>
  <div class={DIALOG_BODY_CLASSES}>
    {@render children?.()}
    {#if showCloseButton}<DialogCloseIcon />{/if}
  </div>
</DialogContentBase>
