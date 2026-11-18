<script lang="ts">
  import type { Snippet } from "svelte"
  import { COMMAND_DIALOG_CLASSES } from "@glob-ui/recipes"
  import Dialog from "../dialog/Dialog.svelte"
  import DialogContentBase from "../dialog/DialogContentBase.svelte"
  import DialogTitle from "../dialog/DialogTitle.svelte"
  import Command from "./Command.svelte"
  import type { CommandFilter } from "./types"

  let {
    open = $bindable(undefined),
    defaultOpen = false,
    onOpenChange,
    shortcut = "mod+k",
    closeOnSelect = true,
    label = "Command menu",
    filter,
    loop = false,
    children,
  }: {
    /** Controlled open state. Bind it with `bind:open`, or pass it with `onOpenChange`. */
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    /**
     * Keyboard shortcut that toggles the dialog, as modifiers and a key joined by "+" (for example "mod+k", "ctrl+shift+p", "/").
     * Modifiers: `mod` (Meta on macOS, Ctrl elsewhere), `meta`, `ctrl`, `shift`, `alt`; they must match exactly.
     * A shortcut without Ctrl or Meta is ignored while typing in a field. `false` disables it. Default "mod+k".
     */
    shortcut?: string | false
    /** Close the dialog after an item is selected. Default true. */
    closeOnSelect?: boolean
    label?: string
    filter?: CommandFilter
    loop?: boolean
    children?: Snippet
  } = $props()

  // svelte-ignore state_referenced_locally
  let internal = $state(defaultOpen)
  const isOpen = $derived(open ?? internal)
  function setOpen(next: boolean) {
    if (next === isOpen) return
    if (open === undefined) internal = next
    else open = next
    onOpenChange?.(next)
  }

  $effect(() => {
    if (shortcut === false) return
    const parts = shortcut.toLowerCase().split("+").map((p) => p.trim())
    const key = parts[parts.length - 1]
    const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
    // Every modifier must match exactly: "mod+k" does not fire on Ctrl+Shift+K, and "k" alone does not fire with Ctrl.
    const want = {
      meta: parts.includes("meta") || (parts.includes("mod") && isMac),
      ctrl: parts.includes("ctrl") || (parts.includes("mod") && !isMac),
      shift: parts.includes("shift"),
      alt: parts.includes("alt"),
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey !== want.meta || e.ctrlKey !== want.ctrl || e.shiftKey !== want.shift || e.altKey !== want.alt) return
      if (e.key.toLowerCase() !== key) return
      // A shortcut without Ctrl or Meta must not fire while the user types in a field.
      const target = e.target as HTMLElement | null
      if (!want.meta && !want.ctrl && target?.closest?.("input, textarea, select, [contenteditable='true']")) return
      e.preventDefault()
      setOpen(!isOpen)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  })
</script>

<!-- A Command in a modal Dialog, with a keyboard shortcut. The search resets each time it opens. -->
<Dialog bind:open={() => isOpen, setOpen}>
  <DialogContentBase class={COMMAND_DIALOG_CLASSES}>
    <DialogTitle class="sr-only">{label}</DialogTitle>
    <!-- Mounted only while open, so every opening starts with an empty search. -->
    {#if isOpen}
      <Command {label} {filter} {loop} onItemSelect={closeOnSelect ? () => setOpen(false) : undefined}>
        {@render children?.()}
      </Command>
    {/if}
  </DialogContentBase>
</Dialog>
