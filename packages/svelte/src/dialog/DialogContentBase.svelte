<script lang="ts">
  import { untrack, type Snippet } from "svelte"
  import type { HTMLDialogAttributes } from "svelte/elements"
  import { createModal, type ModalController } from "@glob-ui/core"
  import { getDialogContext } from "../shared/context"

  type Props = HTMLDialogAttributes & { children?: Snippet }
  let { children, ...rest }: Props = $props()
  const ctx = getDialogContext("DialogContent")

  let dialog: HTMLDialogElement | undefined = $state()
  let modal: ModalController | undefined

  // Options read from the context. Creating the controller reads them untracked, so an open change
  // updates the existing controller instead of destroying it (which would release the scroll lock).
  const options = () => ({
    open: ctx.open,
    onOpenChange: (next: boolean) => ctx.setOpen(next),
    closeOnOutsideClick: ctx.closeOnOutsideClick,
    labelledBy: ctx.titleId,
    describedBy: ctx.descriptionId,
  })

  $effect(() => {
    if (!dialog) return
    const created = untrack(() => createModal(dialog!, options()))
    modal = created
    return () => {
      created.destroy()
      modal = undefined
    }
  })

  $effect(() => {
    const next = options()
    modal?.update(next)
  })
</script>

<dialog bind:this={dialog} id={ctx.contentId} {...rest}>
  {@render children?.()}
</dialog>
