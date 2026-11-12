// Context keys and types shared by the Svelte components. A context value is an object whose fields are
// getters, so readers see the current state without re-providing it.

import { getContext } from "svelte"

export const DIALOG_KEY = Symbol("glob-ui-dialog")
export const LAYOUT_SCROLL_KEY = Symbol("glob-ui-layout-scroll")
export const LAYOUT_NAV_KEY = Symbol("glob-ui-layout-nav")

export interface DialogContext {
  readonly open: boolean
  readonly closeOnOutsideClick: boolean
  setOpen(open: boolean): void
  contentId: string
  titleId: string
  descriptionId: string
}

export interface LayoutScrollContext {
  readonly element: HTMLElement | null
}

export interface LayoutNavContext {
  readonly open: boolean
  setOpen(open: boolean): void
  panelId: string
}

/** The Dialog context, or a clear error when a part is used outside Dialog, Sheet or AlertDialog. */
export function getDialogContext(part: string): DialogContext {
  const ctx = getContext<DialogContext | undefined>(DIALOG_KEY)
  if (!ctx) throw new Error(`${part} must be used inside Dialog, Sheet or AlertDialog`)
  return ctx
}
