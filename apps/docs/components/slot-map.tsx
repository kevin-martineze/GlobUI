import type { CSSProperties, ReactNode } from "react"
import data from "@/lib/layout-data.json"

// A schematic of a layout's slots, drawn as a CSS grid from the same data as the slot tables (lib/layout-data.json,
// written by scripts/write-component-pages.mjs). Server-rendered, no client code.

type Fill = { slot: string; kind: "fixed" | "prop"; what: string; nested?: { layout: string; fills: Fill[] } }
type Slot = { name: string; element: string; scroll: "fixed" | "scroll"; note: string; prop: string }
type LayoutMap = { title: string; areas: string[]; columns: string; rows: string; slots: Slot[] }
type TemplateData = { slug: string; title: string; name: string; layout: string; fills: Fill[] }

const layouts = data.layouts as unknown as Record<string, LayoutMap>
const templates = data.templates as unknown as Record<string, TemplateData>

function layoutOrThrow(name: string): LayoutMap {
  const layout = layouts[name]
  if (!layout) throw new Error(`SlotMap: unknown layout "${name}"`)
  return layout
}

/**
 * The slots of a layout as a grid. With `template`, the same grid shows what the template puts in each slot:
 * fixed by the template (info), a prop (warning), the scroll region (success), and nested layouts inside their slot.
 */
export function SlotMap({ layout, template }: { layout: string; template?: string }) {
  const map = layoutOrThrow(layout)
  if (!template) {
    const label = `${map.title}: ${map.slots.map((s) => `${s.name} ${s.scroll}, filled by the ${s.prop} prop`).join("; ")}.`
    return (
      <Figure caption={`${map.title}: each slot is fixed or scroll. A prop fills it.`} label={label} legend={LEGEND_LAYOUT}>
        <Grid layout={layout} fills={[]} mode="layout" />
      </Figure>
    )
  }
  const t = templates[template]
  if (!t) throw new Error(`SlotMap: unknown template "${template}"`)
  if (t.layout !== layout) throw new Error(`SlotMap: template "${template}" uses ${t.layout}, not ${layout}`)
  return (
    <Figure caption={`${t.title} in ${layout}: what the template fills, and what comes in as props.`} label={summarize(t.title, map, t.fills)} legend={LEGEND_TEMPLATE}>
      <Grid layout={layout} fills={t.fills} mode="template" />
    </Figure>
  )
}

type LegendItem = { label: string; color: string; background: string; dashed: boolean }
const LEGEND_LAYOUT: LegendItem[] = [
  { label: "fixed slot", color: "var(--glob-border-strong)", background: "var(--glob-surface)", dashed: false },
  { label: "scroll slot", color: "var(--glob-success)", background: "var(--glob-success-light)", dashed: true },
]
const LEGEND_TEMPLATE: LegendItem[] = [
  { label: "fixed by the template", color: "var(--glob-info)", background: "var(--glob-info-light)", dashed: true },
  { label: "prop (changes per page)", color: "var(--glob-warning)", background: "var(--glob-warning-light)", dashed: true },
  { label: "scroll region", color: "var(--glob-success)", background: "var(--glob-success-light)", dashed: true },
  { label: "not used", color: "var(--glob-border-strong)", background: "transparent", dashed: true },
]

function Figure({ caption, label, legend, children }: { caption: string; label: string; legend: LegendItem[]; children: ReactNode }) {
  return (
    <figure className="not-prose my-6 flex flex-col gap-3 rounded-xl border border-fd-border bg-fd-background p-4">
      {/* The legend is decorative: the figure's aria-label and the table below say the same in words. */}
      <ul aria-hidden="true" className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-fd-muted-foreground">
        {legend.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-sm border-2"
              style={{ borderColor: item.color, borderStyle: item.dashed ? "dashed" : "solid", background: item.background }}
            />
            {item.label}
          </li>
        ))}
      </ul>
      <div role="img" aria-label={label}>
        {children}
      </div>
      <figcaption className="text-sm text-fd-muted-foreground">{caption}</figcaption>
    </figure>
  )
}

function Grid({ layout, fills, mode, depth = 0 }: { layout: string; fills: Fill[]; mode: "layout" | "template"; depth?: number }) {
  const map = layoutOrThrow(layout)
  return (
    <div
      className="slot-map grid w-full min-w-0 gap-2"
      style={
        {
          // Desktop grid. global.css stacks the slots in one column below 30rem, in the order of the slot table, which is
          // the order the layout stacks them on phones (PageLayout: header, content, aside).
          "--slot-areas": map.areas.map((row) => `"${row}"`).join(" "),
          "--slot-areas-mobile": map.slots.map((slot) => `"${slot.name}"`).join(" "),
          "--slot-columns": map.columns,
          "--slot-rows": map.rows,
        } as CSSProperties
      }
    >
      {map.slots.map((slot) => (
        <SlotBox key={slot.name} slot={slot} entries={fills.filter((f) => f.slot === slot.name)} mode={mode} depth={depth} />
      ))}
    </div>
  )
}

function SlotBox({ slot, entries, mode, depth }: { slot: Slot; entries: Fill[]; mode: "layout" | "template"; depth: number }) {
  const used = mode === "layout" || entries.length > 0
  // Layout mode: fixed slots are neutral, the scroll slot is the success region. Template mode: the scroll region is
  // success, a prop is warning, and what the template fixes is info.
  const tone =
    mode === "layout"
      ? slot.scroll === "scroll" ? "success" : "neutral"
      : slot.scroll === "scroll" ? "success" : entries.length === 0 ? "neutral" : entries[0].kind === "prop" ? "warning" : "info"
  const color = tone === "neutral" ? "var(--glob-border-strong)" : `var(--glob-${tone})`
  const background = !used ? "transparent" : tone === "neutral" ? "var(--glob-surface)" : `var(--glob-${tone}-light)`
  const dashed = mode === "template" || slot.scroll === "scroll"

  return (
    <div
      aria-hidden="true"
      className="flex min-w-0 flex-col gap-1 break-words rounded-lg border-2 p-2 text-xs text-fd-foreground"
      style={{
        gridArea: slot.name,
        borderColor: color,
        borderStyle: dashed || !used ? "dashed" : "solid",
        background,
      }}
    >
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-mono font-semibold">{slot.name}</span>
        <span className="text-fd-muted-foreground">
          {slot.element} · {slot.scroll}
        </span>
      </div>
      {mode === "layout" ? (
        <div className="text-fd-muted-foreground">
          prop: <span className="font-mono">{slot.prop}</span>
        </div>
      ) : used ? (
        entries.map((entry) => (
          <div key={`${entry.kind}-${entry.what}`} className="flex flex-col gap-1">
            <div>
              {/* Each entry is coloured by its own kind: a box can hold a fixed part and a prop. */}
              <span className="font-semibold" style={{ color: entry.kind === "prop" ? "var(--glob-warning)" : "var(--glob-info)" }}>
                {entry.kind}
              </span>
              : {entry.what}
            </div>
            {entry.nested && depth < 3 ? (
              <div className="mt-1">
                <Grid layout={entry.nested.layout} fills={entry.nested.fills} mode="template" depth={depth + 1} />
              </div>
            ) : null}
          </div>
        ))
      ) : (
        <div className="text-fd-muted-foreground">not used</div>
      )}
    </div>
  )
}

function summarize(title: string, map: LayoutMap, fills: Fill[]): string {
  const parts = map.slots.map((slot) => {
    const entries = fills.filter((f) => f.slot === slot.name)
    if (entries.length === 0) return `${slot.name} not used`
    const described = entries.map((e) => `${e.kind} ${e.what}${e.nested ? ` (holds ${e.nested.layout})` : ""}`).join(", ")
    return `${slot.name} ${described}`
  })
  return `${title} in ${map.title}: ${parts.join("; ")}.`
}
