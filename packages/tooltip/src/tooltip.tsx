"use client"

import { Children, isValidElement, useCallback, useEffect, useId, useRef, useState } from "react"
import { cn } from "@glob-ui/utils"
import { Slot } from "@glob-ui/slot"
import { useFloatingPanel, type Placement } from "@glob-ui/hooks"

const oppositeSide = { top: "bottom", right: "left", bottom: "top", left: "right" } as const

export interface TooltipProps {
  content: React.ReactNode
  /** One element that can hold a ref and receive focus (usually a button). */
  children: React.ReactElement
  placement?: Placement
  /** Hover delay before opening, in ms. Keyboard focus opens immediately. */
  delayDuration?: number
  /**
   * Delay before closing after the pointer leaves, in ms. Moving onto the tooltip within this
   * time keeps it open (WCAG 1.4.13, hoverable).
   */
  closeDelay?: number
  /** Gap between trigger and tooltip, in px. */
  offset?: number
  arrow?: boolean
  className?: string
}

function Tooltip({
  content,
  children,
  placement = "top",
  delayDuration = 500,
  closeDelay = 150,
  offset = 6,
  arrow = false,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false)
  const [arrowEl, setArrowEl] = useState<HTMLDivElement | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const id = useId()

  // Destructured: the compiler would treat a whole object passed to `ref=` as a ref.
  const { setTrigger, setPanel, floatingStyles, placement: finalPlacement, middlewareData } = useFloatingPanel({
    open,
    onOpenChange: setOpen,
    placement,
    offset: offset + (arrow ? 4 : 0),
    arrow: arrow ? arrowEl : null,
    fitViewport: false,
    restoreFocus: false,
  })

  const show = useCallback((delay: number) => {
    clearTimeout(timer.current)
    if (delay <= 0) setOpen(true)
    else timer.current = setTimeout(() => setOpen(true), delay)
  }, [])
  const hide = useCallback((delay: number) => {
    clearTimeout(timer.current)
    if (delay <= 0) setOpen(false)
    else timer.current = setTimeout(() => setOpen(false), delay)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  // popover="manual" has no Esc handling of its own.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide(0)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, hide])

  const child = Children.only(children)
  const childDescribedBy = isValidElement<{ "aria-describedby"?: string }>(child)
    ? child.props["aria-describedby"]
    : undefined
  const side = finalPlacement.split("-")[0] as keyof typeof oppositeSide
  const arrowData = middlewareData.arrow

  return (
    <>
      <Slot
        ref={setTrigger}
        aria-describedby={[childDescribedBy, id].filter(Boolean).join(" ")}
        onPointerEnter={(e: React.PointerEvent) => {
          if (e.pointerType !== "touch") show(delayDuration)
        }}
        onPointerLeave={(e: React.PointerEvent) => {
          if (e.pointerType !== "touch") hide(closeDelay)
        }}
        onPointerDown={() => hide(0)}
        onFocus={(e: React.FocusEvent<HTMLElement>) => {
          // Keyboard focus only: a tap or click also focuses, but is not :focus-visible.
          if (e.currentTarget.matches(":focus-visible")) show(0)
        }}
        onBlur={() => hide(0)}
      >
        {child}
      </Slot>
      <div
        ref={setPanel}
        id={id}
        role="tooltip"
        popover="manual"
        style={floatingStyles}
        // Hoverable: entering the tooltip cancels the pending close, leaving starts it again.
        onPointerEnter={() => clearTimeout(timer.current)}
        onPointerLeave={() => hide(closeDelay)}
        className={cn(
          "m-0 overflow-visible rounded-glob-sm border-0 bg-glob-text px-2 py-1 text-xs text-glob-surface shadow-glob-md",
          "opacity-0 transition-[opacity,overlay,display] transition-discrete duration-100 open:opacity-100 starting:open:opacity-0 motion-reduce:transition-none",
          className
        )}
      >
        {content}
        {arrow && (
          <div
            ref={setArrowEl}
            aria-hidden="true"
            className="absolute h-2 w-2 rotate-45 bg-glob-text"
            style={{
              left: arrowData?.x != null ? `${arrowData.x}px` : undefined,
              top: arrowData?.y != null ? `${arrowData.y}px` : undefined,
              [oppositeSide[side]]: "-4px",
            }}
          />
        )}
      </div>
    </>
  )
}
Tooltip.displayName = "Tooltip"

export { Tooltip }
