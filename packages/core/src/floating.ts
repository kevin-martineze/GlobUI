// Floating panels: a `popover` element positioned next to a trigger, kept in sync with `open`.
// Framework-free. The position is reported through `onPosition`; the adapter stores it.

import {
  arrow as arrowMiddleware,
  autoUpdate,
  computePosition,
  flip,
  offset as offsetMiddleware,
  shift,
  size,
  type ComputePositionReturn,
  type Middleware,
  type Placement,
} from "@floating-ui/dom"
import { shouldRestoreFocus } from "./focus"

export type { Placement }

export interface FloatingPosition {
  x: number
  y: number
  placement: Placement
  /** False until the first position is computed. */
  isPositioned: boolean
  middlewareData: ComputePositionReturn["middlewareData"]
}

export interface FloatingPanelOptions {
  open: boolean
  /** Called when the browser closes the panel (light dismiss, Esc). Not called for `open` changes the adapter makes. */
  onOpenChange: (open: boolean) => void
  placement?: Placement
  /** Gap between trigger and panel, in px. */
  offset?: number
  /** Arrow element, positioned by the arrow middleware. */
  arrow?: HTMLElement | null
  /** Constrain the panel to the space left in the viewport (max-height/max-width). */
  fitViewport?: boolean
  /** Make the panel at least as wide as the trigger (listboxes). */
  matchTriggerWidth?: boolean
  /** Runs right after the panel is shown. Use it to move focus. */
  onShow?: (panel: HTMLElement) => void
  /** When the browser closes the panel, return focus to the trigger if focus was inside the panel or lost. */
  restoreFocus?: boolean
  /** Element that gets focus back, when it is not the trigger. */
  restoreFocusTo?: () => HTMLElement | null
  /** Receives every computed position. */
  onPosition?: (position: FloatingPosition) => void
}

export interface FloatingPanelController {
  /** Replaces the options and re-syncs the panel. Cheap: call it on every render. */
  update(options: FloatingPanelOptions): void
  /** Stops tracking the trigger and removes the listeners. The panel itself is not hidden. */
  destroy(): void
}

function supportsPopover(el: HTMLElement): boolean {
  return typeof el.showPopover === "function"
}

function isPopoverOpen(el: HTMLElement): boolean {
  try {
    return el.matches(":popover-open")
  } catch {
    return false
  }
}

function geometryKey(o: FloatingPanelOptions): string {
  return [o.placement ?? "bottom", o.offset ?? 8, o.fitViewport ?? true, o.matchTriggerWidth ?? false].join("|")
}

function middlewareFor(options: FloatingPanelOptions): Middleware[] {
  const { offset = 8, fitViewport = true, matchTriggerWidth = false, arrow = null } = options
  return [
    offsetMiddleware(offset),
    flip({ padding: 8 }),
    shift({ padding: 8 }),
    ...(fitViewport
      ? [
          size({
            padding: 8,
            apply({ availableHeight, availableWidth, elements, rects }) {
              Object.assign(elements.floating.style, {
                maxHeight: `${Math.max(0, availableHeight)}px`,
                maxWidth: `${Math.max(0, availableWidth)}px`,
                ...(matchTriggerWidth ? { minWidth: `${rects.reference.width}px` } : {}),
              })
            },
          }),
        ]
      : []),
    ...(arrow ? [arrowMiddleware({ element: arrow, padding: 6 })] : []),
  ]
}

/**
 * Shows and positions `panel` next to `trigger` while `open`. The panel lives in the top layer
 * (`position: fixed`), so no overflow ancestor clips it.
 */
export function createFloatingPanel(trigger: HTMLElement, panel: HTMLElement, initial: FloatingPanelOptions): FloatingPanelController {
  let options = initial
  let stopAutoUpdate: (() => void) | undefined
  let wasOpen = false

  const compute = () => {
    const { placement = "bottom" } = options
    void computePosition(trigger, panel, { placement, strategy: "fixed", middleware: middlewareFor(options) }).then(
      ({ x, y, placement: finalPlacement, middlewareData }) => {
        options.onPosition?.({ x, y, placement: finalPlacement, isPositioned: true, middlewareData })
      }
    )
  }

  const sync = () => {
    if (!options.open) {
      stopAutoUpdate?.()
      stopAutoUpdate = undefined
      wasOpen = false
      if (supportsPopover(panel) && isPopoverOpen(panel)) panel.hidePopover()
      return
    }
    if (supportsPopover(panel)) {
      if (!isPopoverOpen(panel)) panel.showPopover()
      if (!wasOpen) options.onShow?.(panel)
    }
    wasOpen = true
    // autoUpdate runs compute at once and again on scroll, resize and layout changes.
    stopAutoUpdate ??= autoUpdate(trigger, panel, compute)
  }

  // Mirror browser-initiated closes (light dismiss, Esc) into the adapter's state.
  const onToggle = (event: Event) => {
    if ((event as ToggleEvent).newState !== "closed") return
    options.onOpenChange(false)
    if (options.restoreFocus === false) return
    if (shouldRestoreFocus(panel)) (options.restoreFocusTo?.() ?? trigger).focus()
  }
  panel.addEventListener("toggle", onToggle)

  sync()

  return {
    update(next) {
      // Only geometry changes need a new position. Position is reported back through state in the
      // adapter, so recomputing on every render would loop.
      const moved = geometryKey(next) !== geometryKey(options) || next.arrow !== options.arrow
      options = next
      sync()
      if (options.open && moved) compute()
    },
    destroy() {
      stopAutoUpdate?.()
      stopAutoUpdate = undefined
      panel.removeEventListener("toggle", onToggle)
    },
  }
}
