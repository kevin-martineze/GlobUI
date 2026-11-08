"use client"

import { createContext, forwardRef, useContext, useId, useMemo } from "react"
import { cn } from "@glob-ui/utils"
import { Slot, composeRefs } from "@glob-ui/slot"
import { useControllableState, useFloatingPanel, type Placement } from "@glob-ui/hooks"

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

type Panel = ReturnType<typeof useFloatingPanel>

interface PopoverContextValue {
  open: boolean
  contentId: string
  panel: Panel
}

const PopoverContext = createContext<PopoverContextValue | null>(null)

function usePopoverContext(part: string) {
  const ctx = useContext(PopoverContext)
  if (!ctx) throw new Error(`${part} must be used inside Popover`)
  return ctx
}

export interface PopoverProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Preferred side. Flips to the opposite side when it does not fit. */
  placement?: Placement
  /** Gap between trigger and content, in px. */
  offset?: number
  children?: React.ReactNode
}

function Popover({ open, defaultOpen = false, onOpenChange, placement = "bottom", offset = 8, children }: PopoverProps) {
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange)
  const contentId = useId()
  const panel = useFloatingPanel({
    open: isOpen,
    onOpenChange: setOpen,
    placement,
    offset,
    // Non-modal: move focus in, but do not trap it.
    onShow: (el) => (el.querySelector<HTMLElement>(FOCUSABLE) ?? el).focus({ preventScroll: true }),
  })

  return <PopoverContext.Provider value={{ open: isOpen, contentId, panel }}>{children}</PopoverContext.Provider>
}
Popover.displayName = "Popover"

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ asChild = false, onClick, onPointerDown, ...props }, ref) => {
    const { open, contentId, panel } = usePopoverContext("PopoverTrigger")
    const { setTrigger, triggerHandlers } = panel
    const mergedRef = useMemo(() => composeRefs<HTMLButtonElement>(ref, setTrigger), [ref, setTrigger])
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={mergedRef}
        type={asChild ? undefined : "button"}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={contentId}
        onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) => {
          onPointerDown?.(e)
          triggerHandlers.onPointerDown()
        }}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(e)
          if (!e.defaultPrevented) triggerHandlers.onClick()
        }}
        {...props}
      />
    )
  }
)
PopoverTrigger.displayName = "PopoverTrigger"

export type PopoverContentProps = React.HTMLAttributes<HTMLDivElement>

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, style, children, ...props }, ref) => {
    const { contentId, panel } = usePopoverContext("PopoverContent")
    const { setPanel, floatingStyles } = panel
    const mergedRef = useMemo(() => composeRefs<HTMLDivElement>(ref, setPanel), [ref, setPanel])

    return (
      <div
        ref={mergedRef}
        id={contentId}
        popover="auto"
        role="dialog"
        tabIndex={-1}
        style={{ ...floatingStyles, ...style }}
        className={cn(
          // Reset the UA popover box (inset:0 + margin:auto would center it).
          "m-0 overflow-auto rounded-glob-md border border-glob-border bg-glob-surface p-4 text-sm text-glob-text shadow-glob-md outline-none",
          "opacity-0 transition-[opacity,overlay,display] transition-discrete duration-150 open:opacity-100 starting:open:opacity-0 motion-reduce:transition-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
