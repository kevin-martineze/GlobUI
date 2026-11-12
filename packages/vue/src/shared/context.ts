// Injection keys and types shared by the Vue components. Values are objects with getters or refs, so
// injectors read the current state.

import { inject, type InjectionKey, type Ref } from "vue"

export interface DialogContext {
  readonly open: boolean
  readonly closeOnOutsideClick: boolean
  setOpen(open: boolean): void
  readonly contentId: string
  readonly titleId: string
  readonly descriptionId: string
}

export interface LayoutScrollContext {
  readonly element: Ref<HTMLElement | null>
}

export interface LayoutNavContext {
  readonly open: boolean
  setOpen(open: boolean): void
  readonly panelId: string
}

export const DIALOG_KEY: InjectionKey<DialogContext> = Symbol("glob-ui-dialog")
export const LAYOUT_SCROLL_KEY: InjectionKey<LayoutScrollContext> = Symbol("glob-ui-layout-scroll")
export const LAYOUT_NAV_KEY: InjectionKey<LayoutNavContext> = Symbol("glob-ui-layout-nav")

/** The Dialog context, or a clear error when a part is used outside Dialog, Sheet or AlertDialog. */
export function useDialogContext(part: string): DialogContext {
  const ctx = inject(DIALOG_KEY, null)
  if (!ctx) throw new Error(`${part} must be used inside Dialog, Sheet or AlertDialog`)
  return ctx
}

/** The layout navigation context, or a clear error when a part is used outside a layout. */
export function useLayoutNav(part: string): LayoutNavContext {
  const nav = inject(LAYOUT_NAV_KEY, null)
  if (!nav) throw new Error(`${part} must be used inside a layout (AppShellLayout or StackedLayout)`)
  return nav
}
