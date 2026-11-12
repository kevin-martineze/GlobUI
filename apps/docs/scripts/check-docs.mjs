// Verifies the docs site after `next build`:
//  1. every public package has a page (components/<pkg>.mdx, or utilities for slot and utils);
//  2. every internal link in the prerendered HTML points at a page that exists;
//  3. layout and template demos, and the templates, leave structure and scroll to the layouts.
// Exits 1 with the list of problems.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const docs = path.resolve(here, "..")
const packagesDir = path.resolve(docs, "../../packages")
const problems = []

// 1. Coverage
// core and recipes are internal and framework-free: no site pages until the other frameworks ship (phase 10).
const NOT_DOCUMENTED = new Set(["hooks", "utils", "all", "styles", "core", "recipes"])
const UTILITY_PAGE = {
  slot: "utilities/slot.mdx",
  utils: "utilities/cn.mdx",
  // Layout packages are documented on the Layouts pages (the core layout package on the methodology page).
  layout: "layouts/index.mdx",
  "app-shell-layout": "layouts/app-shell.mdx",
  "page-layout": "layouts/page.mdx",
  "stacked-layout": "layouts/stacked.mdx",
}
const packages = readdirSync(packagesDir).filter((dir) => existsSync(path.join(packagesDir, dir, "src/index.ts")))
for (const pkg of packages) {
  if (NOT_DOCUMENTED.has(pkg)) continue
  const page = UTILITY_PAGE[pkg] ?? `components/${pkg}.mdx`
  if (!existsSync(path.join(docs, "content/docs", page))) problems.push(`no page for @glob-ui/${pkg} (expected content/docs/${page})`)
}
const documented = [...packages.filter((p) => !NOT_DOCUMENTED.has(p))]
console.log(`coverage: ${documented.length} public packages checked`)

// 2. Internal links in the built site
const out = path.join(docs, ".next/server/app")
if (!existsSync(out)) {
  problems.push("no build output: run pnpm build:docs first")
} else {
  const pages = new Set()
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry)
      if (statSync(full).isDirectory()) walk(full)
      else if (entry.endsWith(".html")) {
        const rel = path.relative(out, full).replace(/\.html$/, "").replace(/\/index$/, "")
        pages.add("/" + (rel === "index" ? "" : rel))
      }
    }
  }
  walk(out)
  let links = 0
  const check = (file) => {
    for (const entry of readdirSync(file, { withFileTypes: true })) {
      const full = path.join(file, entry.name)
      if (entry.isDirectory()) check(full)
      else if (entry.name.endsWith(".html")) {
        const html = readFileSync(full, "utf8")
        for (const [, href] of html.matchAll(/href="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) {
          if (href.startsWith("/_next") || href.startsWith("/api/")) continue
          // Preview routes are rendered on demand (not prerendered), so check that the demo exists in examples/.
          if (href.startsWith("/preview/")) {
            links++
            const demo = href.slice("/preview/".length).replace(/\/$/, "")
            if (!existsSync(path.join(docs, "examples", `${demo}.tsx`))) problems.push(`${path.relative(docs, full)}: no preview demo for ${href}`)
            continue
          }
          // Static files (icons, images) are checked against public/, not against pages.
          if (existsSync(path.join(docs, "public", href))) continue
          links++
          const normalised = href.replace(/\/$/, "") || "/"
          if (!pages.has(normalised) && !pages.has(normalised.replace(/^\//, "/"))) {
            problems.push(`${path.relative(docs, full)}: broken link ${href}`)
          }
        }
      }
    }
  }
  check(out)
  console.log(`links: ${links} internal links checked against ${pages.size} pages`)
}

// 3. Pages and templates never decide structure or scroll (the layouts methodology). The layout and template demos
// are pages, and a template's own markup sits above a page: none of them sets heights, overflow or sticky, and
// none wraps its content in an element with page padding or a height (PageLayout owns the padding).
const FORBIDDEN_CLASS = /(^|\s)(?:[a-z]+:)*(h-screen|h-dvh|h-svh|min-h-screen|min-h-dvh|overflow-(?:auto|scroll|hidden|y-auto|x-auto|y-scroll)|sticky|fixed)(?=\s|$)|100d?vh/
const WRAPPER_SPACING = /(^|\s)(?:[a-z]+:)*(?:p|px|py|pt|pb|h|min-h|max-h)-/
const methodologyFiles = [
  ...["layouts", "templates"].flatMap((dir) => tsxFiles(path.join(docs, "examples", dir))),
  ...tsxFiles(path.resolve(docs, "../../templates")).filter((f) => !/\.test\./.test(f)),
]
for (const file of methodologyFiles) {
  const source = readFileSync(file, "utf8")
  const rel = path.relative(path.resolve(docs, "../.."), file)
  for (const m of source.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
    const classes = m[1] ?? m[2]
    if (FORBIDDEN_CLASS.test(classes)) problems.push(`${rel}: "${classes}" decides height, overflow or sticky; that belongs to a layout`)
  }
  // The outer element of each exported page or template (inner helpers, like an empty state, may have spacing).
  for (const m of source.matchAll(/export (?:default )?function \w+[^]*?return \(\s*<(\w+)(?:\s+className="([^"]*)")?/g)) {
    if (m[1] === "div" && m[2] && WRAPPER_SPACING.test(m[2])) {
      problems.push(`${rel}: the page wraps its content in <div className="${m[2]}">; put the content in a layout slot (PageLayout owns the padding)`)
    }
  }
}
console.log(`methodology: ${methodologyFiles.length} demo and template files checked`)

function tsxFiles(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) return entry === "node_modules" ? [] : tsxFiles(full)
    return entry.endsWith(".tsx") ? [full] : []
  })
}

if (problems.length) {
  console.error("Docs check failed:\n  " + [...new Set(problems)].join("\n  "))
  process.exit(1)
}
console.log("Docs check OK.")
