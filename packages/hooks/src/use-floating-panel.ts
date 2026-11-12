import { useEffect, useRef, useState } from "react"
import { createFloatingPanel, type FloatingPanelController, type FloatingPosition, type Placement } from "@glob-ui/core"

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

const INITIAL: FloatingPosition = { x: 0, y: 0, placement: "bottom", isPositioned: false, middlewareData: {} }

/**
 * Positions a `popover` element next to a trigger and keeps it in sync with `open`. The positioning and
 * the popover handling live in `@glob-ui/core`; this hook keeps the position in React state.
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
  const [position, setPosition] = useState<FloatingPosition>(INITIAL)
  const controllerRef = useRef<FloatingPanelController | null>(null)

  // Latest callbacks without re-creating the controller.
  const callbacks = useRef({ onShow, onOpenChange, restoreFocusTo })
  useEffect(() => {
    callbacks.current = { onShow, onOpenChange, restoreFocusTo }
  })

  const options = {
    open,
    placement,
    offset,
    arrow,
    fitViewport,
    matchTriggerWidth,
    restoreFocus,
    onOpenChange: (next: boolean) => callbacks.current.onOpenChange(next),
    onShow: (el: HTMLElement) => callbacks.current.onShow?.(el),
    restoreFocusTo: () => callbacks.current.restoreFocusTo?.() ?? null,
    onPosition: setPosition,
  }

  // Created once the trigger and panel are mounted; destroyed with them.
  useEffect(() => {
    if (!trigger || !panel) return
    const controller = createFloatingPanel(trigger, panel, options)
    controllerRef.current = controller
    return () => {
      controller.destroy()
      controllerRef.current = null
    }
    // `options` is passed to `update` on every render below; only the elements create the controller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, panel])

  useEffect(() => {
    controllerRef.current?.update(options)
  })

  // The position is only meaningful while the trigger and panel exist.
  // opacity (not visibility) until positioned: the panel must be focusable right after showPopover().
  const floatingStyles: React.CSSProperties = {
    position: "fixed",
    left: 0,
    top: 0,
    ...(position.isPositioned ? { transform: `translate(${position.x}px, ${position.y}px)` } : {}),
  }

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
    floatingStyles: (position.isPositioned ? floatingStyles : { ...floatingStyles, opacity: 0 }) as React.CSSProperties,
    isPositioned: position.isPositioned,
    placement: position.isPositioned ? position.placement : placement,
    middlewareData: position.middlewareData,
    triggerHandlers,
  }
}

export type { Placement }
