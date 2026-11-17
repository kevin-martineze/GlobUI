// Shared state of the Angular components. Each piece is provided by the component that owns it, so the
// content inside it can inject it: Dialog for its parts, AppShellLayout and StackedLayout for the nav state,
// AppShellLayout for the main scroll region. This entry point is internal: the other entries import it.

import { computed, inject, Injectable, InjectionToken, PLATFORM_ID, signal, type Signal } from "@angular/core"
import { isPlatformBrowser } from "@angular/common"
import { getLayoutScroll } from "@glob-ui/core"

let idCounter = 0
/** A unique id with a prefix. Ids are only used for ARIA references, so a counter is enough. */
export function nextId(prefix: string): string {
  return `${prefix}-${++idCounter}`
}

export interface DialogContext {
  readonly isOpen: Signal<boolean>
  readonly closeOnOutsideClick: Signal<boolean>
  setOpen(open: boolean): void
  readonly contentId: string
  readonly titleId: string
  readonly descriptionId: string
}

export const DIALOG_CONTEXT = new InjectionToken<DialogContext>("GLOB_DIALOG_CONTEXT")

/** The main scroll element of a layout. AppShellLayout provides it once its main region exists. */
@Injectable()
export class LayoutScrollRegion {
  readonly element = signal<HTMLElement | null>(null)
}

/** The open state of the mobile navigation. AppShellLayout and StackedLayout provide it. */
@Injectable()
export class LayoutNavState {
  readonly open = signal(false)
  readonly panelId = nextId("glob-layout-nav")
  setOpen(open: boolean): void {
    this.open.set(open)
  }
}

/**
 * The scroll element for code inside a layout: the nearest scroll region (AppShellLayout's main), else
 * `document.scrollingElement` (StackedLayout, or no layout). Null on the server. Built on core `getLayoutScroll`.
 */
export function injectLayoutScroll(): Signal<HTMLElement | null> {
  const region = inject(LayoutScrollRegion, { optional: true })
  const browser = isPlatformBrowser(inject(PLATFORM_ID))
  return computed(() => region?.element() ?? (browser ? getLayoutScroll(null) : null))
}
