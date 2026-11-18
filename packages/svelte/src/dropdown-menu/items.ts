// Shared behaviour of every menu item type: focus on hover, select on click/Enter/Space, close.

import { getMenuContext } from "../shared/context"

export const MENU_ITEM_SELECTOR = '[data-roving-item]:not([aria-disabled="true"])'

/** The enabled items that belong to this menu (not to a nested one). */
export function getMenuItems(content: HTMLElement) {
  return Array.from(content.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)).filter(
    (item) => item.closest("[data-roving-root]") === content
  )
}

export interface MenuItemOptions {
  disabled: boolean
  /** Runs when the item is chosen with click, Enter or Space. Call `event.preventDefault()` to keep the menu open. */
  onSelect?: (event: Event) => void
  textValue?: string
  closeOnSelect: boolean
  /** Runs before onSelect: toggles a checkbox item, checks a radio item. */
  onActivate?: () => void
  onclick?: (event: MouseEvent) => void
  onkeydown?: (event: KeyboardEvent) => void
  onpointermove?: (event: PointerEvent) => void
  onpointerleave?: (event: PointerEvent) => void
}

/** Call while the item initializes. `options` is read when an event runs, so it sees the latest props. */
export function createMenuItem(options: () => MenuItemOptions) {
  const ctx = getMenuContext("DropdownMenuItem")

  function select() {
    const { disabled, onActivate, onSelect, closeOnSelect } = options()
    if (disabled) return
    onActivate?.()
    const event = new Event("glob-ui.menu.select", { cancelable: true })
    onSelect?.(event)
    if (closeOnSelect && !event.defaultPrevented) ctx.setOpen(false)
  }

  return {
    /** Attributes that follow the props (spread them through a $derived). */
    attributes(o: MenuItemOptions) {
      return {
        tabindex: -1,
        "data-roving-item": "",
        "data-text-value": o.textValue,
        "aria-disabled": o.disabled || undefined,
      }
    },
    handlers: {
      onclick: (e: MouseEvent) => {
        options().onclick?.(e)
        if (!e.defaultPrevented) select()
      },
      onkeydown: (e: KeyboardEvent) => {
        options().onkeydown?.(e)
        if (e.defaultPrevented) return
        if (e.key === "Enter" || e.key === " ") {
          // Space would scroll the page; Enter would repeat on hold.
          e.preventDefault()
          if (!e.repeat) select()
        }
      },
      // Hover highlights by moving focus, like the keyboard does.
      onpointermove: (e: PointerEvent) => {
        options().onpointermove?.(e)
        const el = e.currentTarget as HTMLElement
        if (e.pointerType === "mouse" && !options().disabled && document.activeElement !== el) {
          el.focus({ preventScroll: true })
        }
      },
      onpointerleave: (e: PointerEvent) => {
        options().onpointerleave?.(e)
        if (e.pointerType === "mouse" && document.activeElement === e.currentTarget) {
          ctx.panel.panel?.focus({ preventScroll: true })
        }
      },
    },
  }
}
