<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLDialogAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { ALERT_DIALOG_BODY_CLASSES, dialogVariants } from "@glob-ui/recipes"
  import DialogContentBase from "../dialog/DialogContentBase.svelte"

  let { class: className, children, ...rest }: HTMLDialogAttributes & { children?: Snippet } = $props()
</script>

<DialogContentBase role="alertdialog" class={cn(dialogVariants({ size: "sm", className }))} {...rest}>
  <div class={ALERT_DIALOG_BODY_CLASSES}>{@render children?.()}</div>
</DialogContentBase>
