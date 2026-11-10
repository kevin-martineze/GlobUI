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

// Layout pages: anatomy preview, slot table, props, accessibility. The methodology page (layouts/index.mdx) is written by hand.
const layoutPageMdx = (l) => {
  const lines = []
  lines.push("---", `title: ${JSON.stringify(l.title)}`, `description: ${JSON.stringify(l.description)}`, "---", "")
  lines.push(`<PackageInfo pkg="${l.pkg}" exports="${l.exports}" />`, "")
  lines.push(`<InstallTabs pkg="${l.pkg}" />`, "")
  lines.push("## Anatomy", "", "Each slot declares its scroll behaviour. Switch on **Anatomy** to see them, and **Fill with content** to see which region scrolls.", "")
  lines.push(`<LayoutPreview slug="${l.demo}" kind="layout" codeFiles="examples/${l.demo}.tsx" />`, "")
  lines.push("## Slots", "", "| Slot | Element | Scroll | Notes |", "| --- | --- | --- | --- |")
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

// Template pages: preview with the three-colour anatomy and the props panel, the fixed parts, and the code in two files.
const templatePageMdx = (t) => {
  const lines = []
  lines.push("---", `title: ${JSON.stringify(t.title)}`, `description: ${JSON.stringify(t.description)}`, "---", "")
  lines.push(`A template renders \`${t.layout}\`, fixes part of it, and exposes props for the rest. It is copy-code: the file is yours to edit.`, "")
  lines.push("## Preview", "", "**Anatomy** colours the fixed parts, the props, and the scroll region. The panel changes the props live; the fixed parts stay.", "")
  lines.push(`<LayoutPreview slug="${t.demo}" kind="template" controls={${JSON.stringify(JSON.stringify(t.controls))}} codeFiles="../../templates/${t.file},examples/${t.demo}.tsx" />`, "")
  lines.push("## Fixed and variable", "", "**Fixed by the template** (edit the constants at the top of the file):", "")
  for (const item of t.fixed) lines.push(`- ${item}`)
  lines.push("", "**Props** (the variable part):", "")
  for (const item of t.props) lines.push(`- ${item}`)
  lines.push("", "## Install", "", `<RegistryCommand name="${t.name}" />`, "")
  lines.push("## Code", "", "The template is one file, and a page uses it. The page sets only what varies: no heights, no overflow.", "")
  return lines.join("\n")
}

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
