// Modal dialog behaviour on the native <dialog> element: showModal (focus trap), the shared scroll lock,
// Escape, backdrop click, focus return and the title/description references. Framework-free. The open
// state stays in the adapter; this controller reports changes through `onOpenChange`.

import { lockScroll } from "./scroll"
import { rememberFocus, shouldRestoreFocus } from "./focus"

export interface ModalOptions {
  open: boolean
  /** Called when the user closes the dialog (Escape, backdrop click, a browser-initiated close). Not called for `open` changes the adapter makes. */
  onOpenChange: (open: boolean) => void
  /** Close when the backdrop is clicked. Default true. */
  closeOnOutsideClick?: boolean
  /** Id of the title. Referenced only while that element exists, so the reference never dangles. */
  labelledBy?: string
  /** Id of the description. Same rule as `labelledBy`. */
  describedBy?: string
}

export interface ModalController {
  /** Replaces the options and syncs the dialog with `open`. */
  update(options: ModalOptions): void
  /** Releases the scroll lock and removes the listeners. The dialog is not closed here. */
  destroy(): void
}

export function createModal(dialog: HTMLDialogElement, initial: ModalOptions): ModalController {
  const doc = dialog.ownerDocument
  let options = initial
  let unlock: (() => void) | undefined
  let focus: { restore(): void } | undefined
  let pointerDownOnBackdrop = false

  const release = () => {
    unlock?.()
    unlock = undefined
  }

  const applyReferences = () => {
    const set = (attr: string, id: string | undefined) => {
      if (id && doc.getElementById(id)) dialog.setAttribute(attr, id)
      else dialog.removeAttribute(attr)
    }
    set("aria-labelledby", options.labelledBy)
    set("aria-describedby", options.describedBy)
  }

  const sync = () => {
    if (!options.open) {
      if (!dialog.open) return
      release()
      const restore = shouldRestoreFocus(dialog, doc)
      dialog.close()
      if (restore) focus?.restore()
      focus = undefined
      return
    }
    if (dialog.open) return
    focus = rememberFocus(doc)
    applyReferences()
    dialog.showModal()
    unlock = lockScroll(doc)
  }

  const onCancel = (event: Event) => {
    // Escape: the adapter's state is the source of truth, so the dialog closes only when it says so.
    event.preventDefault()
    options.onOpenChange(false)
  }
  const onClose = () => {
    // Closed by the browser anyway: sync the state and clean up once.
    if (options.open) options.onOpenChange(false)
    release()
    if (shouldRestoreFocus(dialog, doc)) focus?.restore()
    focus = undefined
  }
  const onPointerDown = (event: PointerEvent) => {
    pointerDownOnBackdrop = event.target === dialog
  }
  const onClick = (event: MouseEvent) => {
    // A click lands on the <dialog> element itself only over the backdrop: its content fills it.
    if (options.closeOnOutsideClick === false) return
    if (pointerDownOnBackdrop && event.target === dialog) options.onOpenChange(false)
  }

  dialog.addEventListener("cancel", onCancel)
  dialog.addEventListener("close", onClose)
  dialog.addEventListener("pointerdown", onPointerDown)
  dialog.addEventListener("click", onClick)
  sync()

  return {
    update(next) {
      options = next
      sync()
    },
    destroy() {
      release()
      dialog.removeEventListener("cancel", onCancel)
      dialog.removeEventListener("close", onClose)
      dialog.removeEventListener("pointerdown", onPointerDown)
      dialog.removeEventListener("click", onClick)
    },
  }
}
