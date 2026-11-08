"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { cn } from "@glob-ui/utils"
import { AlertIcon, alertVariants } from "@glob-ui/alert"
import { toast, toastStore, type ToastData } from "./store"

export type ToasterPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"

export interface ToasterProps {
  position?: ToasterPosition
  /** Toasts on screen at once. The rest wait in a queue. */
  max?: number
  /** Accessible name of each toast's close button. */
  closeLabel?: string
  /** Accessible name of the notification list. */
  label?: string
  className?: string
}

const positionClasses: Record<ToasterPosition, string> = {
  "top-left": "top-0 left-0",
  "top-center": "top-0 left-1/2 -translate-x-1/2",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-0 right-0",
}

const isUrgent = (t: ToastData) => t.variant === "warning" || t.variant === "danger"

function isPopoverOpen(el: HTMLElement) {
  try {
    return el.matches(":popover-open")
  } catch {
    return false
  }
}

/** Topmost open modal dialog. Everything outside it is inert, so toasts must live inside it. */
function topModalDialog() {
  const modals = document.querySelectorAll<HTMLDialogElement>("dialog:modal")
  return modals[modals.length - 1] ?? null
}

const subscribeNothing = () => () => {}

const subscribeVisibility = (cb: () => void) => {
  document.addEventListener("visibilitychange", cb)
  return () => document.removeEventListener("visibilitychange", cb)
}

function Toaster({
  position = "bottom-right",
  max = 3,
  closeLabel = "Close notification",
  label = "Notifications",
  className,
}: ToasterProps) {
  const toasts = useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot, toastStore.getServerSnapshot)
  const hidden = useSyncExternalStore(subscribeVisibility, () => document.hidden, () => false)
  // False during SSR and hydration, true after: the server HTML has no toaster markup to match.
  const hydrated = useSyncExternalStore(subscribeNothing, () => true, () => false)
  const [hovered, setHovered] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  // A host node we move between <body> and the topmost modal dialog. React only owns its children.
  // Null on the server. The portal is rendered only after hydration (see `hydrated`).
  const [host] = useState(() => {
    if (typeof document === "undefined") return null
    const el = document.createElement("div")
    el.dataset.globToaster = ""
    el.style.display = "contents"
    return el
  })
  const containerRef = useRef<HTMLElement>(null)
  const shownIds = useRef(new Set<string>())

  const visible = useMemo(() => toasts.slice(0, max), [toasts, max])
  const active = visible.length > 0
  const paused = hovered || focusWithin || hidden

  useLayoutEffect(() => {
    if (!host) return
    document.body.appendChild(host)
    return () => host.remove()
  }, [host])

  // Keep the host where it is not inert, and the container above other top-layer elements.
  // Runs when the visible toasts change; promotes the container when new ones arrive.
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!host || !container) return
    const newIds = visible.filter((t) => !shownIds.current.has(t.id))
    shownIds.current = new Set(visible.map((t) => t.id))
    placeHost(host, container, visible.length > 0, newIds.length > 0)
  }, [host, hydrated, visible])

  // Dialogs opening, closing or unmounting change where the host must be. Only watched while
  // toasts are on screen; with none, nothing observes the document.
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!host || !container || !active) return
    const observer = new MutationObserver((records) => {
      if (host.isConnected && !records.some(involvesDialog)) return
      placeHost(host, container, true, false)
    })
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open"] })
    return () => observer.disconnect()
  }, [host, hydrated, active])

  const regionText = (urgent: boolean) =>
    visible
      .filter((t) => !t.leaving && isUrgent(t) === urgent)
      .map((t) => (
        <div key={`${t.id}:${t.version}`}>
          {t.title} {t.description}
        </div>
      ))

  const content = (
    <>
      {/* Always mounted so screen readers track them before the first toast arrives. */}
      <div role="status" aria-live="polite" aria-atomic="false" className="sr-only">
        {regionText(false)}
      </div>
      <div role="alert" aria-live="assertive" aria-atomic="false" className="sr-only">
        {regionText(true)}
      </div>
      <section
        ref={containerRef}
        popover="manual"
        aria-label={label}
        className={cn(
          // Reset the UA popover box. The container itself ignores the pointer; toasts do not.
          "pointer-events-none fixed inset-auto m-0 w-full max-w-sm overflow-visible border-0 bg-transparent p-4",
          "transition-[display,overlay] transition-discrete duration-200",
          positionClasses[position],
          className
        )}
      >
        <ol
          className="pointer-events-auto flex flex-col gap-2"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocus={() => setFocusWithin(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false)
          }}
        >
          {visible.map((t) => (
            <ToastItem
              key={t.id}
              toast={t}
              paused={paused}
              closeLabel={closeLabel}
              fromTop={position.startsWith("top")}
              onFocusLost={() => setFocusWithin(false)}
            />
          ))}
        </ol>
      </section>
    </>
  )

  return host && hydrated ? createPortal(content, host) : null
}
Toaster.displayName = "Toaster"

/** Moves the host next to the topmost modal dialog (or body) and shows or hides the container. */
function placeHost(host: HTMLElement, container: HTMLElement, hasToasts: boolean, promote: boolean) {
  const target = topModalDialog() ?? document.body
  let moved = false
  if (host.parentElement !== target) {
    // Moving a shown popover out of the document hides it; it is shown again below.
    target.appendChild(host)
    moved = true
  }
  if (!hasToasts) {
    if (isPopoverOpen(container)) container.hidePopover()
    return
  }
  if (!isPopoverOpen(container)) {
    container.showPopover()
  } else if (promote && !moved && hasOtherTopLayer(container)) {
    // Showing again puts the container last in the top layer, so it paints above menus and dialogs.
    container.hidePopover()
    container.showPopover()
  }
}

const containsDialog = (node: Node) =>
  node.nodeName === "DIALOG" || (node instanceof Element && node.querySelector("dialog") !== null)

/** True when a mutation record opened/closed, added or removed a dialog. */
function involvesDialog(record: MutationRecord) {
  if (record.type === "attributes") return record.target.nodeName === "DIALOG"
  return Array.from(record.addedNodes).some(containsDialog) || Array.from(record.removedNodes).some(containsDialog)
}

function hasOtherTopLayer(container: HTMLElement) {
  if (document.querySelector("dialog:modal")) return true
  try {
    return Array.from(document.querySelectorAll(":popover-open")).some((el) => el !== container)
  } catch {
    return false
  }
}

interface ToastItemProps {
  toast: ToastData
  paused: boolean
  closeLabel: string
  fromTop: boolean
  /** The focused toast was removed and no other toast could take focus. */
  onFocusLost: () => void
}

function ToastItem({ toast: t, paused, closeLabel, fromTop, onFocusLost }: ToastItemProps) {
  const liRef = useRef<HTMLLIElement>(null)
  const remaining = useRef(t.duration)
  const onFocusLostRef = useRef(onFocusLost)
  useEffect(() => {
    onFocusLostRef.current = onFocusLost
  })

  // Removing a focused element fires no blur, so the list would stay "focused" (and paused) forever.
  // Runs before React detaches the node. Keyboard users get focus on the next toast; after a
  // mouse click focus is simply released, so the remaining toasts keep their timers.
  useLayoutEffect(() => {
    const li = liRef.current
    return () => {
      if (!li || !li.contains(document.activeElement)) return
      const keyboard = li.querySelector(":focus-visible") !== null
      const next = Array.from(li.parentElement?.children ?? []).find((el) => el !== li && !el.hasAttribute("data-leaving"))
      const target = next?.querySelector<HTMLElement>("button[aria-label]")
      if (keyboard && target) {
        target.focus()
        return
      }
      ;(document.activeElement as HTMLElement | null)?.blur()
      onFocusLostRef.current()
    }
  }, [])
  const version = useRef(t.version)

  // Auto-dismiss. Pausing keeps the time left; an update restarts it.
  useEffect(() => {
    if (version.current !== t.version) {
      version.current = t.version
      remaining.current = t.duration
    }
    if (paused || t.leaving || !Number.isFinite(t.duration)) return
    const start = Date.now()
    const timer = setTimeout(() => toast.dismiss(t.id), remaining.current)
    return () => {
      clearTimeout(timer)
      remaining.current -= Date.now() - start
    }
  }, [paused, t.id, t.version, t.duration, t.leaving])

  return (
    <li
      ref={liRef}
      data-leaving={t.leaving || undefined}
      className={cn(
        // Same colours as Alert; no role here, the live regions above announce it.
        alertVariants({ variant: t.variant }),
        "items-start pr-10 shadow-glob-md",
        "transition-[opacity,translate] transition-discrete duration-200 ease-out",
        fromTop ? "starting:-translate-y-2" : "starting:translate-y-2",
        "starting:opacity-0 data-leaving:opacity-0 motion-reduce:transition-none"
      )}
    >
      <AlertIcon variant={t.variant} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {t.title != null && <div className="font-medium leading-5">{t.title}</div>}
        {t.description != null && <div className="leading-5 text-glob-text-secondary">{t.description}</div>}
        {t.action && (
          <button
            type="button"
            onClick={(e) => {
              t.action?.onClick(e)
              if (!e.defaultPrevented) toast.dismiss(t.id)
            }}
            className="mt-1 self-start rounded-glob-sm border border-glob-border bg-glob-surface px-2 py-1 text-xs font-medium text-glob-text hover:bg-glob-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring"
          >
            {t.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        aria-label={closeLabel}
        onClick={() => toast.dismiss(t.id)}
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-glob-sm text-glob-text-secondary hover:bg-glob-surface-hover hover:text-glob-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </li>
  )
}

export { Toaster }
