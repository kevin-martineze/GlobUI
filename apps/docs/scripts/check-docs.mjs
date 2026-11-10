// Verifies the docs site after `next build`:
//  1. every public package has a page (components/<pkg>.mdx, or utilities for slot and utils);
//  2. every internal link in the prerendered HTML points at a page that exists.
// Exits 1 with the list of problems.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const docs = path.resolve(here, "..")
const packagesDir = path.resolve(docs, "../../packages")
const problems = []

// 1. Coverage
const NOT_DOCUMENTED = new Set(["hooks", "utils", "all", "styles"])
const UTILITY_PAGE = { slot: "utilities/slot.mdx", utils: "utilities/cn.mdx" }
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

if (problems.length) {
  console.error("Docs check failed:\n  " + [...new Set(problems)].join("\n  "))
  process.exit(1)
}
console.log("Docs check OK.")
