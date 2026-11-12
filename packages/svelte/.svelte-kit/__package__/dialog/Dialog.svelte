<script lang="ts">
  import { setContext, type Snippet } from "svelte"
  import { DIALOG_KEY, type DialogContext } from "../shared/context"

  let {
    open = $bindable(undefined),
    defaultOpen = false,
    onOpenChange,
    closeOnOutsideClick = true,
    children,
  }: {
    /** Controlled open state. Bind it with `bind:open`, or pass it with `onOpenChange`. */
    open?: boolean
    /** Initial open state when `open` is not set. */
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    closeOnOutsideClick?: boolean
    children?: Snippet
  } = $props()

  const baseId = $props.id()
  // Only the initial value of defaultOpen is wanted: later changes do not reopen the dialog.
  // svelte-ignore state_referenced_locally
  let internal = $state(defaultOpen)
  const isOpen = $derived(open ?? internal)

  const ctx: DialogContext = {
    get open() {
      return isOpen
    },
    get closeOnOutsideClick() {
      return closeOnOutsideClick
    },
    setOpen(next: boolean) {
      if (next === isOpen) return
      // Uncontrolled: keep the state here. Controlled: write through the binding (and notify).
      if (open === undefined) internal = next
      else open = next
      onOpenChange?.(next)
    },
    contentId: `${baseId}-content`,
    titleId: `${baseId}-title`,
    descriptionId: `${baseId}-description`,
  }
  setContext(DIALOG_KEY, ctx)
</script>

{@render children?.()}
