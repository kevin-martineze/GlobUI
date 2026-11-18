<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { createAttachmentKey } from "svelte/attachments"
  import { cn } from "@glob-ui/utils"
  import { buttonVariants } from "@glob-ui/recipes"
  import DialogClose from "../dialog/DialogClose.svelte"

  let { class: className, children, ...rest }: HTMLButtonAttributes & { children?: Snippet } = $props()

  // The safe option takes the initial focus. showModal() focuses the [autofocus] element, but Svelte's `autofocus`
  // focuses on mount instead of setting the attribute (the dialog is still closed then), so it is set here.
  const initialFocus = { [createAttachmentKey()]: (node: HTMLElement) => node.setAttribute("autofocus", "") }
</script>

<DialogClose class={cn(buttonVariants({ variant: "outline" }), className)} {...initialFocus} {...rest}>
  {@render children?.()}
</DialogClose>
