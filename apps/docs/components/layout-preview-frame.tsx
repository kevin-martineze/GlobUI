"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export type PreviewControl =
  | { name: string; label: string; type: "text"; value: string }
  | { name: string; label: string; type: "boolean"; value: boolean }
  | { name: string; label: string; type: "select"; value: string; options: string[] }

const DEVICES = {
  mobile: { label: "Mobile", width: 375 },
  tablet: { label: "Tablet", width: 768 },
  // Real media queries need a real width. A frame wider than the page is scaled down to fit, never cut.
  desktop: { label: "Desktop", width: 1280 },
} as const
type Device = keyof typeof DEVICES

// Colours of the anatomy view. Tokens, so light and dark mode both read.
const LEGEND_LAYOUT = [
  { label: "fixed", color: "var(--glob-primary)" },
  { label: "scroll", color: "var(--glob-success)" },
]
const LEGEND_TEMPLATE = [
  { label: "fixed by the template", color: "var(--glob-info)" },
  { label: "prop (variable)", color: "var(--glob-warning)" },
  { label: "scroll region", color: "var(--glob-success)" },
]

/**
 * The parent side of a layout preview. Device, anatomy, fill and props are sent to the iframe with postMessage;
 * the iframe is never reloaded by a toggle. Full screen opens the same route in a new tab.
 */
export function LayoutPreviewFrame({ slug, kind, controls }: { slug: string; kind: "layout" | "template"; controls: PreviewControl[] }) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [device, setDevice] = useState<Device>("desktop")
  const [anatomy, setAnatomy] = useState(false)
  const [fill, setFill] = useState(false)
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    Object.fromEntries(controls.map((c) => [c.name, c.value]))
  )
  // The latest state, for the iframe's ready message (which arrives outside React's render).
  const latest = useRef({ anatomy, fill, values })
  useEffect(() => {
    latest.current = { anatomy, fill, values }
  }, [anatomy, fill, values])

  const post = useCallback(
    (state: { anatomy: boolean; fill: boolean; values: Record<string, unknown> }) => {
      const win = frameRef.current?.contentWindow
      if (!win) return
      const origin = window.location.origin
      win.postMessage(
        { type: "glob-ui:preview", anatomy: state.anatomy ? (kind === "template" ? "template" : "layout") : "off", fill: state.fill },
        origin
      )
      win.postMessage({ type: "glob-ui:props", values: state.values }, origin)
    },
    [kind]
  )

  // The iframe announces itself when its listener is ready; the state is sent then, and on every change.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source === frameRef.current?.contentWindow && (event.data as { type?: string })?.type === "glob-ui:ready") {
        post(latest.current)
      }
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [post])

  useEffect(() => {
    post({ anatomy, fill, values })
  }, [anatomy, fill, values, post])

  const legend = kind === "template" ? LEGEND_TEMPLATE : LEGEND_LAYOUT
  const width = DEVICES[device].width
  const height = 640

  // The width available for the frame. The iframe keeps its device width (so its media queries are real)
  // and is scaled down when the page is narrower.
  const stageRef = useRef<HTMLDivElement>(null)
  const [available, setAvailable] = useState<number | null>(null)
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new ResizeObserver(([entry]) => setAvailable(entry.contentRect.width))
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])
  // The 2 px are the frame border.
  const scale = available ? Math.min(1, (available - 2) / width) : 1

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Preview controls">
        <div className="flex flex-wrap gap-1 rounded-lg border border-fd-border p-1" role="group" aria-label="Device size">
          {(Object.keys(DEVICES) as Device[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={device === key}
              onClick={() => setDevice(key)}
              className="rounded-md px-2.5 py-1 text-sm aria-pressed:bg-fd-accent aria-pressed:font-medium"
            >
              {DEVICES[key].label}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-pressed={anatomy}
          onClick={() => setAnatomy((v) => !v)}
          className="rounded-lg border border-fd-border px-2.5 py-1 text-sm aria-pressed:bg-fd-accent"
        >
          Anatomy
        </button>
        <button
          type="button"
          aria-pressed={fill}
          onClick={() => setFill((v) => !v)}
          className="rounded-lg border border-fd-border px-2.5 py-1 text-sm aria-pressed:bg-fd-accent"
        >
          Fill with content
        </button>
        <a
          href={`/preview/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto rounded-lg border border-fd-border px-2.5 py-1 text-sm no-underline hover:bg-fd-accent"
        >
          Full screen
        </a>
      </div>

      {anatomy ? (
        <ul className="flex flex-wrap gap-3 text-xs" aria-label="Anatomy legend">
          {legend.map((item) => (
            <li key={item.label} className="flex items-center gap-1.5">
              <span aria-hidden="true" className="inline-block h-3 w-3 rounded-sm" style={{ background: item.color }} />
              {item.label}
            </li>
          ))}
        </ul>
      ) : null}

      <div ref={stageRef} className="max-w-full rounded-xl border border-fd-border bg-fd-background p-3">
        <div className="mx-auto box-content overflow-hidden rounded-lg border border-fd-border" style={{ width: width * scale, height: height * scale }}>
          <iframe
            ref={frameRef}
            src={`/preview/${slug}`}
            title={`Live preview: ${slug}`}
            onLoad={() => post({ anatomy, fill, values })}
            style={{ width, height, transform: scale < 1 ? `scale(${scale})` : undefined, transformOrigin: "top left" }}
            className="block bg-fd-background"
          />
        </div>
      </div>
      {scale < 1 ? (
        <p className="text-xs text-fd-muted-foreground">
          Shown at {Math.round(scale * 100)}% of {width} px. Use Full screen to see it at full size.
        </p>
      ) : null}

      {controls.length > 0 ? (
        <fieldset className="flex flex-col gap-3 rounded-xl border border-fd-border p-4">
          <legend className="px-1 text-sm font-medium">Props</legend>
          {controls.map((control) => (
            <ControlField key={control.name} control={control} value={values[control.name]} onChange={(v) => setValues((prev) => ({ ...prev, [control.name]: v }))} />
          ))}
        </fieldset>
      ) : null}
    </div>
  )
}

function ControlField({
  control,
  value,
  onChange,
}: {
  control: PreviewControl
  value: unknown
  onChange: (value: unknown) => void
}) {
  const id = `preview-control-${control.name}`
  if (control.type === "boolean") {
    return (
      <label htmlFor={id} className="flex items-center gap-2 text-sm">
        <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        {control.label}
      </label>
    )
  }
  if (control.type === "select") {
    return (
      <label htmlFor={id} className="flex flex-col gap-1 text-sm">
        {control.label}
        <select id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="rounded-md border border-fd-border bg-fd-background px-2 py-1">
          {control.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    )
  }
  return (
    <label htmlFor={id} className="flex flex-col gap-1 text-sm">
      {control.label}
      <input id={id} type="text" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="rounded-md border border-fd-border bg-fd-background px-2 py-1" />
    </label>
  )
}
