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

/** Wraps a preview: applies the anatomy and fill attributes, and receives the props from the parent frame. */
export function PreviewRoot({ children }: { children: ReactNode }) {
  const [values, setValues] = useState<Record<string, unknown>>({})

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return
      const data = event.data as { type?: string; anatomy?: string; fill?: boolean; values?: Record<string, unknown> } | null
      if (!data || typeof data !== "object") return
      try {
        if (data.type === "glob-ui:preview") {
          const root = document.documentElement
          root.dataset.anatomy = data.anatomy ?? "off"
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
    return () => window.removeEventListener("message", onMessage)
  }, [])

  return <PreviewPropsContext.Provider value={values}>{children}</PreviewPropsContext.Provider>
}
