<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLDialogAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { dialogVariants } from "@glob-ui/recipes"
  import DialogContentBase from "./DialogContentBase.svelte"
  import DialogCloseIcon from "./DialogCloseIcon.svelte"

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
  <div class="relative flex max-h-[calc(100dvh-2rem)] flex-col gap-4 overflow-y-auto p-6">
    {@render children?.()}
    {#if showCloseButton}<DialogCloseIcon />{/if}
  </div>
</DialogContentBase>
