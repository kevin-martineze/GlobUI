<script lang="ts">
  import type { Snippet } from "svelte"
  import Dialog from "../dialog/Dialog.svelte"

  let {
    open = $bindable(undefined),
    defaultOpen = false,
    onOpenChange,
    children,
  }: {
    /** Controlled open state. Bind it with `bind:open`, or pass it with `onOpenChange`. */
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    children?: Snippet
  } = $props()
</script>

<!--
  A Dialog for a decision the user must make. The backdrop does not close it, so the user answers with Cancel or the
  action (Escape still closes it, as the WAI-ARIA alertdialog pattern allows).
-->
<Dialog bind:open {defaultOpen} {onOpenChange} closeOnOutsideClick={false}>
  {@render children?.()}
</Dialog>
