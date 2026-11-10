"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// The preview route (app/preview) runs inside an iframe of the docs page. The parent frame sends
// its state with postMessage, so toggling anatomy, fill or a prop never reloads the iframe.
// Messages are accepted from the same origin and from the parent window only.

const PreviewPropsContext = createContext<Record<string, unknown>>({})

/** The defaults for a demo's props, overridden by the props panel of the docs page. */
export function usePreviewProps<T extends Record<string, unknown>>(defaults: T): T {
  const values = useContext(PreviewPropsContext)
  return { ...defaults, ...values } as T
}

// The layout name of each data-layout value (set by the layout packages). Docs-only: the labels are added in the
// iframe, never in the packages.
const LAYOUT_NAMES: Record<string, string> = { "app-shell": "AppShellLayout", page: "PageLayout", stacked: "StackedLayout" }

type Tone = "layout" | "scroll" | "fixed" | "prop"

/**
 * The label of an element: its slot ("AppShellLayout.header · fixed") and the template part that fills it
 * ("fixed: BRAND, user menu", "prop: title"), joined when both are on the same element.
 */
function describe(el: HTMLElement, withParts: boolean): { text: string; tone: Tone } {
  const labels: string[] = []
  let tone: Tone = "layout"
  const slot = el.dataset.slot
  if (slot) {
    const host = el.closest<HTMLElement>("[data-layout]")
    const layout = host ? LAYOUT_NAMES[host.dataset.layout ?? ""] : undefined
    const scroll = el.dataset.scroll
    labels.push([layout ? `${layout}.${slot}` : slot, scroll].filter(Boolean).join(" · "))
    tone = scroll === "scroll" ? "scroll" : "layout"
  }
  const part = withParts ? el.dataset.templatePart : undefined
  if (part) {
    const what = el.dataset.templateName
    labels.push(what ? `${part}: ${what}` : part)
    tone = part === "prop" ? "prop" : "fixed"
  }
  return { text: labels.join(" · "), tone }
}

// Label colours: the tone's token as background, and a text colour that reads on it in light and dark mode.
const TONE_STYLE: Record<Tone, { background: string; color: string }> = {
  layout: { background: "var(--glob-primary)", color: "var(--glob-primary-foreground)" },
  scroll: { background: "var(--glob-success)", color: "var(--glob-surface)" },
  fixed: { background: "var(--glob-info)", color: "var(--glob-surface)" },
  prop: { background: "var(--glob-warning)", color: "var(--glob-surface)" },
}

/**
 * The anatomy labels, drawn on a fixed layer above the preview. They take no space in the page, so the layout being
 * shown keeps its real sizes. Each label sits at the top-left of its element (kept inside the viewport while the element
 * is visible), and moves down when it would cover a label already placed.
 */
// Layout mode labels the slots only; template mode adds what the template puts in them.
function createLabelLayer(mode: "layout" | "template") {
  const selector = mode === "template" ? "[data-slot],[data-template-part]" : "[data-slot]"
  const layer = document.createElement("div")
  layer.setAttribute("aria-hidden", "true")
  layer.dataset.anatomyLayer = ""
  Object.assign(layer.style, { position: "fixed", inset: "0", pointerEvents: "none", zIndex: "2147483647" })
  document.body.appendChild(layer)

  let frame = 0
  const draw = () => {
    frame = 0
    layer.replaceChildren()
    const placed: DOMRect[] = []
    for (const el of document.querySelectorAll<HTMLElement>(selector)) {
      if (layer.contains(el)) continue
      const rect = el.getBoundingClientRect()
      // Hidden elements (the closed Sheet copy of the sidebar) and elements out of view get no label.
      if (rect.width === 0 || rect.height === 0 || rect.bottom <= 0 || rect.top >= innerHeight || rect.right <= 0 || rect.left >= innerWidth) continue
      const { text, tone } = describe(el, mode === "template")
      const label = document.createElement("div")
      label.textContent = text
      Object.assign(label.style, {
        position: "absolute",
        left: `${Math.max(rect.left, 0)}px`,
        top: `${Math.max(rect.top, 0)}px`,
        maxWidth: `${Math.max(Math.min(rect.width, innerWidth - Math.max(rect.left, 0)), 120)}px`,
        padding: "2px 6px",
        font: "600 11px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace",
        whiteSpace: "normal",
        overflowWrap: "anywhere",
        ...TONE_STYLE[tone],
      })
      layer.appendChild(label)
      // Move down past any label it would cover.
      let box = label.getBoundingClientRect()
      for (let guard = 0; guard < 20; guard++) {
        const hit = placed.find((p) => box.left < p.right && box.right > p.left && box.top < p.bottom && box.bottom > p.top)
        if (!hit) break
        label.style.top = `${hit.bottom + 1}px`
        box = label.getBoundingClientRect()
      }
      placed.push(box)
    }
  }
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(draw)
  }

  // Redraw when anything scrolls (capture: the scroll regions are elements, not the window), resizes or re-renders.
  addEventListener("scroll", schedule, true)
  addEventListener("resize", schedule)
  const observer = new MutationObserver((records) => {
    if (records.some((r) => !layer.contains(r.target))) schedule()
  })
  observer.observe(document.body, { childList: true, subtree: true, attributes: true })
  schedule()

  return () => {
    cancelAnimationFrame(frame)
    removeEventListener("scroll", schedule, true)
    removeEventListener("resize", schedule)
    observer.disconnect()
    layer.remove()
  }
}

/** Wraps a preview: applies the anatomy and fill attributes, and receives the props from the parent frame. */
export function PreviewRoot({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<Record<string, unknown>>({})

  useEffect(() => {
    // The label layer follows the DOM and the scroll positions while anatomy is on.
    let removeLayer: (() => void) | null = null
    const setAnatomy = (mode: string) => {
      document.documentElement.dataset.anatomy = mode
      removeLayer?.()
      removeLayer = mode === "layout" || mode === "template" ? createLabelLayer(mode) : null
    }

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      const data = event.data as { type?: string; anatomy?: string; fill?: boolean; values?: Record<string, unknown> } | null
      if (!data || typeof data !== "object") return
      try {
        if (data.type === "glob-ui:preview") {
          setAnatomy(data.anatomy ?? "off")
          const root = document.documentElement
          if (data.fill) root.dataset.fill = "on"
          else delete root.dataset.fill
        }
        if (data.type === "glob-ui:props" && data.values) setValues(data.values)
      } catch {
        // A frame that cannot store attributes still renders the demo.
      }
    }
    window.addEventListener("message", onMessage)
    if (window.parent !== window) window.parent.postMessage({ type: "glob-ui:ready" }, window.location.origin)
    return () => {
      window.removeEventListener("message", onMessage)
      removeLayer?.()
    }
  }, [])

  return <PreviewPropsContext.Provider value={values}>{children}</PreviewPropsContext.Provider>
}
