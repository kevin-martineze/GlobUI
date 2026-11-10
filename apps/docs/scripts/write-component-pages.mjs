// Writes content/docs/components/*.mdx and content/docs/utilities/*.mdx from the data below.
// Every page has the same sections: preview, examples, API (generated from types), accessibility.
// Examples are files in examples/<group>/<name>.tsx; API tables read packages/<pkg>/src.
import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "content", "docs")

import { components, utilities } from "./docs-data.mjs"

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
console.log(`wrote ${components.length} component pages and ${utilities.length} utility pages`)
