"use client"

import { createContext, forwardRef, useCallback, useContext, useId, useState, useSyncExternalStore } from "react"
import { cn } from "@glob-ui/utils"
import { Sheet, SheetContent } from "@glob-ui/sheet"

// Hydration-safe: false on the server and during hydration, true afterwards.
const noopSubscribe = () => () => {}
function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false)
}

// ---------------------------------------------------------------------------------------------
// Scroll ownership
// ---------------------------------------------------------------------------------------------

interface LayoutScrollValue {
  element: HTMLElement | null
}

// Set by the nearest scroll slot. Absent in document mode, where the document is the scroller.
const LayoutScrollContext = createContext<LayoutScrollValue | null>(null)

/**
 * The scroll element for the code below a layout: the nearest scroll slot (app mode), or
 * `document.scrollingElement` (document mode). Returns `null` on the server and during hydration.
 * Use it for scroll-to-top on navigation, infinite lists and "scroll to" links.
 */
export function useLayoutScroll(): HTMLElement | null {
  const scroll = useContext(LayoutScrollContext)
  const hydrated = useHydrated()
  if (!hydrated) return null
  if (scroll) return scroll.element
  return (document.scrollingElement as HTMLElement | null) ?? null
}

const SCROLL_CLASSES =
  "min-h-0 overflow-y-auto overscroll-contain [scrollbar-gutter:stable] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-glob-ring"

export type LayoutScrollMode = "fixed" | "scroll"

export interface LayoutSlotProps extends React.HTMLAttributes<HTMLElement> {
  /** The slot name, rendered as `data-slot`. */
  name: string
  /** `fixed` never scrolls. `scroll` is the one region that scrolls for this part of the screen. */
  scroll: LayoutScrollMode
  /** The element to render. Use a landmark (`header`, `nav`, `main`, `aside`, `footer`) where it fits. */
  as?: "div" | "header" | "nav" | "main" | "aside" | "footer" | "section"
}

/**
 * A named region of a layout. It declares its scroll behaviour in the DOM (`data-scroll`), and a
 * `scroll` slot becomes the scroll element for everything inside it. Internal to the layout
 * packages, exported so that every layout uses the same rules.
 */
export const LayoutSlot = forwardRef<HTMLElement, LayoutSlotProps>(
  ({ name, scroll, as: Comp = "div", className, children, ...props }, forwardedRef) => {
    const isScroll = scroll === "scroll"
    const [element, setElement] = useState<HTMLElement | null>(null)
    // A stable callback ref: an inline one would re-run on every render and loop through state updates.
    const ref = useCallback(
      (node: HTMLElement | null) => {
        setElement(node)
        if (typeof forwardedRef === "function") forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      },
      [forwardedRef]
    )
    const Tag = Comp as "div"
    if (!isScroll) {
      return (
        <Tag ref={ref} data-slot={name} data-scroll="fixed" className={className} {...props}>
          {children}
        </Tag>
      )
    }
    return (
      // A scroll region must be reachable by keyboard (WCAG 2.1.1, axe scrollable-region-focusable), so it is a tab stop.
      <Tag ref={ref} data-slot={name} data-scroll="scroll" tabIndex={0} className={cn(SCROLL_CLASSES, className)} {...props}>
        <LayoutScrollContext.Provider value={{ element }}>{children}</LayoutScrollContext.Provider>
      </Tag>
    )
  }
)
LayoutSlot.displayName = "LayoutSlot"

// ---------------------------------------------------------------------------------------------
// Skip link
// ---------------------------------------------------------------------------------------------

export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The id of the main element to move focus to. Layouts pass the id they generate. */
  targetId: string
}

/** "Skip to content": hidden until it has focus, then moves focus to the main region. */
export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ targetId, className, children = "Skip to content", onClick, ...props }, ref) => (
    <a
      ref={ref}
      href={`#${targetId}`}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        event.preventDefault()
        document.getElementById(targetId)?.focus()
      }}
      className={cn(
        "sr-only z-50 rounded-glob-md bg-glob-surface px-3 py-2 text-sm font-medium text-glob-text shadow-glob-md focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
)
SkipLink.displayName = "SkipLink"

// ---------------------------------------------------------------------------------------------
// Mobile navigation
// ---------------------------------------------------------------------------------------------

interface LayoutNavValue {
  open: boolean
  setOpen: (open: boolean) => void
  panelId: string
}

const LayoutNavContext = createContext<LayoutNavValue | null>(null)

export interface LayoutNavProviderProps {
  children?: React.ReactNode
}

/** Holds the open state of the mobile navigation. Layouts render it; you do not need it directly. */
export function LayoutNavProvider({ children }: LayoutNavProviderProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  return <LayoutNavContext.Provider value={{ open, setOpen, panelId }}>{children}</LayoutNavContext.Provider>
}

export type LayoutNavTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>

/**
 * The button that opens the layout's mobile navigation. Put it in your header. It hides itself at
 * `lg` and up, where the navigation is shown inline. Focus returns to it when the navigation closes.
 */
export const LayoutNavTrigger = forwardRef<HTMLButtonElement, LayoutNavTriggerProps>(
  ({ className, onClick, ...props }, ref) => {
    const nav = useContext(LayoutNavContext)
    if (!nav) throw new Error("LayoutNavTrigger must be used inside a layout (AppShellLayout or StackedLayout)")
    return (
      <button
        ref={ref}
        type="button"
        aria-label="Open navigation"
        aria-expanded={nav.open}
        aria-controls={nav.panelId}
        onClick={(event) => {
          onClick?.(event)
          if (!event.defaultPrevented) nav.setOpen(true)
        }}
        className={cn(
          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-glob-md text-glob-text transition-colors hover:bg-glob-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring lg:hidden",
          className
        )}
        {...props}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    )
  }
)
LayoutNavTrigger.displayName = "LayoutNavTrigger"

export interface LayoutMobileNavProps {
  /** The accessible name of the navigation dialog. */
  label: string
  children?: React.ReactNode
}

/**
 * The mobile navigation: a Sheet from the left edge, opened by LayoutNavTrigger. A link inside it
 * closes the sheet. Layouts render this; it needs LayoutNavProvider above it.
 */
export function LayoutMobileNav({ label, children }: LayoutMobileNavProps) {
  const nav = useContext(LayoutNavContext)
  if (!nav) throw new Error("LayoutMobileNav must be used inside LayoutNavProvider")
  return (
    <Sheet open={nav.open} onOpenChange={nav.setOpen}>
      <SheetContent
        id={nav.panelId}
        side="left"
        size="sm"
        aria-label={label}
        onClick={(event) => {
          // Following a link in the navigation ends the interaction: close the sheet.
          const target = event.target as HTMLElement
          if (target.closest("a[href]")) nav.setOpen(false)
        }}
      >
        <nav aria-label={label} className="flex flex-col gap-1">
          {children}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
LayoutMobileNav.displayName = "LayoutMobileNav"

