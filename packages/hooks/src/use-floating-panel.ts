import { useEffect, useRef, useState } from "react"
import {
  arrow as arrowMiddleware,
  autoUpdate,
  flip,
  offset as offsetMiddleware,
  shift,
  size,
  useFloating,
  type Placement,
} from "@floating-ui/react-dom"

function isPopoverOpen(el: HTMLElement) {
  try {
    return el.matches(":popover-open")
  } catch {
    return false
  }
}

export interface UseFloatingPanelOptions {
  open: boolean
  onOpenChange: (open: boolean) => void
  placement?: Placement
  /** Gap between trigger and panel, in px. */
  offset?: number
  /** Arrow element, positioned by the arrow middleware. */
  arrow?: HTMLElement | null
  /** Constrain the panel to the space left in the viewport (max-height/max-width). */
  fitViewport?: boolean
  /** Runs right after the panel is shown. Use it to move focus. */
  onShow?: (panel: HTMLElement) => void
  /**
   * When the browser closes the panel (light dismiss, Esc), return focus to the trigger
   * if focus was inside the panel or lost. A click elsewhere keeps its own focus.
   */
  restoreFocus?: boolean
  /** Element that gets focus back, when it is not the trigger (e.g. the trigger is a wrapper). */
  restoreFocusTo?: () => HTMLElement | null
  /** Make the panel at least as wide as the trigger (listboxes). */
  matchTriggerWidth?: boolean
}

/**
 * Positions a `popover` element next to a trigger and keeps it in sync with `open`.
 * The panel element must have a `popover` attribute ("auto" or "manual").
 */
export function useFloatingPanel({
  open,
  onOpenChange,
  placement = "bottom",
  offset = 8,
  arrow = null,
  fitViewport = true,
  onShow,
  restoreFocus = true,
  restoreFocusTo,
  matchTriggerWidth = false,
}: UseFloatingPanelOptions) {
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)
  const [panel, setPanel] = useState<HTMLElement | null>(null)

  // Latest callbacks without re-running the effects.
  const onShowRef = useRef(onShow)
  const onOpenChangeRef = useRef(onOpenChange)
  const restoreFocusToRef = useRef(restoreFocusTo)
  useEffect(() => {
    onShowRef.current = onShow
    onOpenChangeRef.current = onOpenChange
    restoreFocusToRef.current = restoreFocusTo
  })

  const { floatingStyles, update, isPositioned, placement: finalPlacement, middlewareData } = useFloating({
    open,
    placement,
    // Panels live in the top layer, outside any overflow:hidden ancestor.
    strategy: "fixed",
    elements: { reference: trigger, floating: panel },
    middleware: [
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
    ],
  })

  // Show/hide the native popover; track the trigger position only while open.
  useEffect(() => {
    if (!panel || typeof panel.showPopover !== "function") return
    if (!open) {
      if (isPopoverOpen(panel)) panel.hidePopover()
      return
    }
    if (!isPopoverOpen(panel)) panel.showPopover()
    onShowRef.current?.(panel)
    return trigger ? autoUpdate(trigger, panel, update) : undefined
  }, [open, panel, trigger, update])

  // Mirror browser-initiated closes (light dismiss, Esc) into state.
  useEffect(() => {
    if (!panel) return
    const onToggle = (e: Event) => {
      if ((e as ToggleEvent).newState !== "closed") return
      onOpenChangeRef.current(false)
      if (!restoreFocus) return
      const active = document.activeElement
      if (!active || active === document.body || panel.contains(active)) {
        ;(restoreFocusToRef.current?.() ?? trigger)?.focus()
      }
    }
    panel.addEventListener("toggle", onToggle)
    return () => panel.removeEventListener("toggle", onToggle)
  }, [panel, trigger, restoreFocus])

  // Light dismiss closes the panel on pointerup, before the trigger's click runs. Remember the
  // state at pointerdown so clicking the trigger closes the panel instead of reopening it.
  const openAtPointerDown = useRef<boolean | null>(null)
  const triggerHandlers = {
    onPointerDown: () => {
      openAtPointerDown.current = open
    },
    onClick: () => {
      const wasOpen = openAtPointerDown.current ?? open
      openAtPointerDown.current = null
      onOpenChange(!wasOpen)
    },
  }

  return {
    trigger,
    setTrigger,
    panel,
    setPanel,
    // opacity (not visibility) until positioned: the panel must be focusable right after showPopover().
    floatingStyles: (isPositioned ? floatingStyles : { ...floatingStyles, opacity: 0 }) as React.CSSProperties,
    isPositioned,
    placement: finalPlacement,
    middlewareData,
    triggerHandlers,
  }
}

export type { Placement }
