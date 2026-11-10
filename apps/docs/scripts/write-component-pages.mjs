// Writes content/docs/components/*.mdx and content/docs/utilities/*.mdx from the data below.
// Every page has the same sections: preview, examples, API (generated from types), accessibility.
// Examples are files in examples/<group>/<name>.tsx; API tables read packages/<pkg>/src.
import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "content", "docs")

import { components, utilities, layouts, templates } from "./docs-data.mjs"

const pageMdx = (p) => {
  const lines = []
  lines.push("---", `title: ${JSON.stringify(p.title)}`, `description: ${JSON.stringify(p.description)}`, "---", "")
  lines.push(`<PackageInfo pkg="${p.pkg}" exports="${p.exports}" />`, "")
  lines.push(`<InstallTabs pkg="${p.pkg}" />`, "")
  lines.push("## Preview", "", `<ComponentPreview name="${p.main}" />`, "")
  if (p.examples && p.examples.length) {
    lines.push("## Examples", "")
    for (const ex of p.examples) {
      lines.push(`### ${ex.title}`, "", ex.text, "", `<ComponentPreview name="${ex.name}" />`, "")
    }
  }
  if (p.extra) lines.push(p.extra)
  if (p.api && p.api.length) {
    lines.push("## API", "")
    lines.push("Props are generated from the TypeScript types in the package source.", "")
    for (const part of p.api) {
      const label = part.label ?? part.name
      lines.push(`### ${label}`, "")
      lines.push(`<ApiTable pkg="${p.pkg}"${part.file ? ` file="${part.file}"` : ""} name="${part.name}" />`, "")
    }
  }
  if (p.a11y && p.a11y.length) {
    lines.push("## Accessibility", "", "| Key or action | Behaviour |", "| --- | --- |")
    for (const [key, action] of p.a11y) lines.push(`| ${key} | ${action} |`)
    lines.push("")
    if (p.aria) lines.push(`**ARIA.** ${p.aria}`, "")
  }
  return lines.join("\n")
}

// The layout data (grids, slots, fills) is checked first, then written to lib/layout-data.json for the SlotMap
// component. The slot tables and the maps are generated from the same data, so they cannot disagree.
const slotNames = (l) => l.slots.map(([name]) => name)
function checkLayoutData() {
  const problems = []
  const byTitle = new Map(layouts.map((l) => [l.title, l]))
  for (const l of layouts) {
    const areaNames = new Set(l.grid.areas.join(" ").split(/\s+/))
    const names = new Set(slotNames(l))
    for (const area of areaNames) if (!names.has(area)) problems.push(`${l.title}: grid area "${area}" has no slot`)
    for (const name of names) {
      if (!areaNames.has(name)) problems.push(`${l.title}: slot "${name}" is not placed in the grid`)
      if (!(name in l.grid.props)) problems.push(`${l.title}: slot "${name}" has no prop in grid.props`)
    }
  }
  const checkFill = (layoutTitle, fill, where) => {
    const layout = byTitle.get(layoutTitle)
    if (!layout) {
      problems.push(`${where}: unknown layout ${layoutTitle}`)
      return
    }
    if (!slotNames(layout).includes(fill.slot)) problems.push(`${where}: ${layoutTitle} has no slot "${fill.slot}"`)
    if (!["fixed", "prop"].includes(fill.kind)) problems.push(`${where}: kind must be fixed or prop, not "${fill.kind}"`)
    if (!fill.what) problems.push(`${where}: "what" is empty for ${layoutTitle}.${fill.slot}`)
  }
  for (const t of templates) {
    const where = `template ${t.slug}`
    if (!byTitle.has(t.layout)) problems.push(`${where}: unknown layout ${t.layout}`)
    for (const fill of t.fills) {
      if (fill.layout !== t.layout) problems.push(`${where}: fill for ${fill.layout}, but the template uses ${t.layout}`)
      checkFill(fill.layout, fill, where)
      if (fill.nested) {
        if (!byTitle.has(fill.nested.layout)) problems.push(`${where}: unknown nested layout ${fill.nested.layout}`)
        for (const inner of fill.nested.fills) checkFill(fill.nested.layout, inner, `${where} (in ${fill.nested.layout})`)
      }
    }
  }
  if (problems.length) throw new Error("layout data:\n  " + problems.join("\n  "))
}

function layoutDataJson() {
  return {
    layouts: Object.fromEntries(
      layouts.map((l) => [
        l.title,
        {
          title: l.title,
          pkg: l.pkg,
          scrollMode: l.scrollMode,
          areas: l.grid.areas,
          columns: l.grid.columns,
          rows: l.grid.rows,
          slots: l.slots.map(([name, element, scroll, note]) => ({
            name,
            element: element.replace(/`/g, ""),
            scroll,
            note,
            prop: l.grid.props[name],
          })),
        },
      ])
    ),
    templates: Object.fromEntries(
      templates.map((t) => [t.slug, { slug: t.slug, title: t.title, name: t.name, layout: t.layout, fills: t.fills }])
    ),
  }
}

// Layout pages: anatomy preview, the slot map, the slot table, props, accessibility. The methodology page
// (layouts/index.mdx) is written by hand.
const layoutPageMdx = (l) => {
  const lines = []
  lines.push("---", `title: ${JSON.stringify(l.title)}`, `description: ${JSON.stringify(l.description)}`, "---", "")
  lines.push(`<PackageInfo pkg="${l.pkg}" exports="${l.exports}" />`, "")
  lines.push(`<InstallTabs pkg="${l.pkg}" />`, "")
  lines.push("## Anatomy", "", "Each slot declares its scroll behaviour. Switch on **Anatomy** to see them, and **Fill with content** to see which region scrolls.", "")
  lines.push(`<LayoutPreview slug="${l.demo}" kind="layout" codeFiles="examples/${l.demo}.tsx" />`, "")
  lines.push("## Slots", "", "The layout is a grid of slots. A prop fills each slot, and each slot is fixed or scroll.", "")
  lines.push(`<SlotMap layout="${l.title}" />`, "")
  lines.push("| Slot | Element | Scroll | Notes |", "| --- | --- | --- | --- |")
  for (const [slot, el, scroll, note] of l.slots) lines.push(`| \`${slot}\` | ${el} | ${scroll} | ${note} |`)
  lines.push("")
  lines.push(`- **fixed**: the slot never scrolls. It stays in place, or sticks.`, `- **scroll**: the one region that scrolls for this part of the screen.`, "")
  if (l.extra) lines.push(l.extra)
  lines.push("## API", "")
  for (const part of l.api) lines.push(`### ${part.name}`, "", `<ApiTable pkg="${l.pkg}" name="${part.name}" />`, "")
  lines.push("## Accessibility", "", "| Key or action | Behaviour |", "| --- | --- |")
  for (const [key, action] of l.a11y) lines.push(`| ${key} | ${action} |`)
  lines.push("", `**ARIA.** ${l.aria}`, "")
  return lines.join("\n")
}

// Template pages: the preview with its anatomy and props panel, how the template uses its layout (the slot map and a
// table generated from the fills), the fixed parts, and the code in two files.
const templatePageMdx = (t) => {
  const layout = byTitle(t.layout)
  const lines = []
  lines.push("---", `title: ${JSON.stringify(t.title)}`, `description: ${JSON.stringify(t.description)}`, "---", "")
  lines.push(`A template renders \`${t.layout}\`, fixes part of it, and exposes props for the rest. It is copy-code: the file is yours to edit.`, "")
  lines.push("## Preview", "", "**Anatomy** names each slot and what fills it. The panel changes the props live; the fixed parts stay.", "")
  lines.push(`<LayoutPreview slug="${t.demo}" kind="template" controls={${JSON.stringify(JSON.stringify(t.controls))}} codeFiles="../../templates/${t.file},examples/${t.demo}.tsx" />`, "")
  lines.push("## How it uses the layout", "", `The template fills these slots of \`${t.layout}\`. Each slot is fixed by the template, filled by a prop, or not used.`, "")
  lines.push(`<SlotMap layout="${t.layout}" template="${t.slug}" />`, "")
  lines.push("| Layout slot | Filled with | Fixed or prop |", "| --- | --- | --- |")
  const usedTop = new Set(t.fills.map((f) => f.slot))
  for (const fill of t.fills) {
    lines.push(`| \`${fill.layout}.${fill.slot}\` | ${fill.what} | ${fill.kind} |`)
    if (fill.nested) {
      const inner = byTitle(fill.nested.layout)
      const usedInner = new Set(fill.nested.fills.map((f) => f.slot))
      for (const f of fill.nested.fills) lines.push(`| \`${fill.nested.layout}.${f.slot}\` (in \`${fill.layout}.${fill.slot}\`) | ${f.what} | ${f.kind} |`)
      for (const name of slotNames(inner)) if (!usedInner.has(name)) lines.push(`| \`${fill.nested.layout}.${name}\` (in \`${fill.layout}.${fill.slot}\`) | not used | – |`)
    }
  }
  for (const name of slotNames(layout)) if (!usedTop.has(name)) lines.push(`| \`${t.layout}.${name}\` | not used | – |`)
  lines.push("")
  lines.push("## Fixed and variable", "", "**Fixed by the template** (edit the constants at the top of the file):", "")
  for (const item of t.fixed) lines.push(`- ${item}`)
  lines.push("", "**Props** (the variable part):", "")
  for (const item of t.props) lines.push(`- ${item}`)
  lines.push("", "## Install", "", `<RegistryCommand name="${t.name}" />`, "")
  lines.push("## Code", "", "The template is one file, and a page uses it. The page sets only what varies: no heights, no overflow.", "")
  return lines.join("\n")
}

const byTitle = (title) => {
  const layout = layouts.find((l) => l.title === title)
  if (!layout) throw new Error(`unknown layout ${title}`)
  return layout
}

checkLayoutData()
mkdirSync(path.join(root, "..", "..", "lib"), { recursive: true })
writeFileSync(path.join(root, "..", "..", "lib", "layout-data.json"), JSON.stringify(layoutDataJson(), null, 2) + "\n")

mkdirSync(path.join(root, "layouts"), { recursive: true })
mkdirSync(path.join(root, "templates"), { recursive: true })
for (const l of layouts) writeFileSync(path.join(root, "layouts", `${l.slug}.mdx`), layoutPageMdx(l))
for (const t of templates) writeFileSync(path.join(root, "templates", `${t.slug}.mdx`), templatePageMdx(t))
writeFileSync(path.join(root, "layouts", "meta.json"), JSON.stringify({ title: "Layouts", pages: ["index", ...layouts.map((l) => l.slug)] }, null, 2) + "\n")
writeFileSync(path.join(root, "templates", "meta.json"), JSON.stringify({ title: "Templates", pages: templates.map((t) => t.slug) }, null, 2) + "\n")

mkdirSync(path.join(root, "components"), { recursive: true })
mkdirSync(path.join(root, "utilities"), { recursive: true })

for (const c of components) {
  writeFileSync(path.join(root, "components", `${c.slug}.mdx`), pageMdx(c))
}
for (const u of utilities) {
  writeFileSync(path.join(root, "utilities", `${u.slug}.mdx`), pageMdx(u))
}

// Sidebar: groups in the order the docs use. Separators come from the group names.
const groups = ["Forms", "Data", "Overlays", "Feedback", "Display", "Navigation"]
// A component in a group missing from this list would be left out of the sidebar and 404 in production.
for (const c of components) {
  if (!groups.includes(c.group)) throw new Error(`${c.slug}: group "${c.group}" is not in the sidebar groups (${groups.join(", ")})`)
}
const pages = groups.flatMap((g) => [`---${g}---`, ...components.filter((c) => c.group === g).map((c) => c.slug)])
writeFileSync(path.join(root, "components", "meta.json"), JSON.stringify({ title: "Components", pages }, null, 2) + "\n")
writeFileSync(
  path.join(root, "utilities", "meta.json"),
  JSON.stringify({ title: "Utilities", pages: utilities.map((u) => u.slug) }, null, 2) + "\n"
)
console.log(`wrote ${components.length} component pages, ${utilities.length} utility pages, ${layouts.length} layout and ${templates.length} template pages`)
