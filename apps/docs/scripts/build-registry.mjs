// Generates the shadcn-compatible copy-code registry: public/r/<name>.json, one item per component,
// plus the theme (glob-ui-theme), utils (glob-ui-utils) and hooks (glob-ui-hooks) items.
// Everything is read from packages/*: sources, npm dependencies and the design tokens. Nothing is
// copied by hand. The registry format follows https://ui.shadcn.com/schema/registry-item.json.
//
// Targets use shadcn placeholders (@components/, @lib/, @hooks/), which the CLI maps to the
// consumer's components.json aliases. Import rewrites (the "@/" prefix maps the same way):
//   @glob-ui/utils    -> @/lib/glob-ui/utils
//   @glob-ui/hooks    -> @/hooks/glob-ui
//   @glob-ui/<pkg>    -> @/components/glob-ui/<pkg>
// Each item's registryDependencies are absolute URLs, because shadcn only resolves
// plain names against the registries the consumer configured.
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { components, utilities } from "./docs-data.mjs"

const here = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(here, "../../..")
const packagesDir = path.join(repo, "packages")
const outDir = path.resolve(here, "../public/r")
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")
const SCHEMA = "https://ui.shadcn.com/schema/registry-item.json"

const titles = new Map([...components, ...utilities].map((c) => [c.pkg, c.title]))
const descriptions = new Map([...components, ...utilities].map((c) => [c.pkg, c.description]))

const readJson = (file) => JSON.parse(readFileSync(file, "utf8"))

/** Source files of a package, without tests, in a stable order. */
function sourceFiles(dir) {
  const out = []
  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const full = path.join(d, entry)
      if (statSync(full).isDirectory()) walk(full)
      else if (/\.(ts|tsx)$/.test(entry) && !/\.test\./.test(entry)) out.push(full)
    }
  }
  walk(dir)
  return out.sort()
}

/** Rewrites @glob-ui/* specifiers to the consumer-side alias paths. */
function rewriteImports(source) {
  return source
    .replace(/from "@glob-ui\/utils"/g, 'from "@/lib/glob-ui/utils"')
    .replace(/from "@glob-ui\/hooks"/g, 'from "@/hooks/glob-ui"')
    // Point at index explicitly: a directory import can resolve to <name>/<name>.tsx, which does not
    // re-export helpers that live in other files of the package (for example calendar's date helpers).
    .replace(/from "@glob-ui\/([a-z-]+)"/g, 'from "@/components/glob-ui/$1/index"')
}

/** npm dependencies of a package, without the workspace packages. */
function npmDependencies(pkg) {
  return Object.entries(pkg.dependencies ?? {})
    .filter(([name]) => !name.startsWith("@glob-ui/"))
    .map(([name, range]) => `${name}@${range}`)
    .sort()
}

/** Registry URLs of the @glob-ui/* packages a package depends on. */
function workspaceRegistryDependencies(pkg, theme = true) {
  const deps = theme ? [`${SITE}/r/glob-ui-theme.json`] : []
  for (const name of Object.keys(pkg.dependencies ?? {})) {
    if (!name.startsWith("@glob-ui/")) continue
    const slug = name.slice("@glob-ui/".length)
    if (slug === "utils") deps.push(`${SITE}/r/glob-ui-utils.json`)
    else if (slug === "hooks") deps.push(`${SITE}/r/glob-ui-hooks.json`)
    else deps.push(`${SITE}/r/${slug}.json`)
  }
  return deps
}

// Design tokens, read from the one source of truth.
const tokensCss = readFileSync(path.join(repo, "packages/styles/glob-ui.css"), "utf8")
function block(css, start) {
  const m = start.exec(css)
  if (!m) throw new Error("token block not found")
  const open = m.index + m[0].length
  return css.slice(open, css.indexOf("}", open))
}
const lightBlock = block(tokensCss, /^:root\s*\{/m)
const darkBlock = block(tokensCss, /^:root\[data-theme="dark"\]\s*\{/m)
const declarations = (text) => Object.fromEntries([...text.matchAll(/--glob-([a-z-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]))
const light = declarations(lightBlock)
const dark = declarations(darkBlock)

const themeVars = {
  theme: Object.fromEntries(
    Object.keys(light).map((name) => {
      if (name.startsWith("radius-")) return [`radius-glob-${name.slice(7)}`, `var(--glob-${name})`]
      if (name.startsWith("shadow-")) return [`shadow-glob-${name.slice(7)}`, `var(--glob-${name})`]
      return [`color-glob-${name}`, `var(--glob-${name})`]
    })
  ),
  light: Object.fromEntries(Object.entries(light).map(([k, v]) => [`glob-${k}`, v])),
  // Shadcn applies `dark` under the .dark class (next-themes class mode). Radius and shadow stay the same.
  dark: Object.fromEntries(
    Object.keys(light).map((k) => [`glob-${k}`, dark[k] ?? light[k]])
  ),
}

// Animations from the @theme block (--animate-glob-*) and their @keyframes, so copied components
// that use them (Progress) animate the same way as the npm packages.
for (const m of tokensCss.matchAll(/--animate-(glob-[a-z-]+):\s*([^;]+);/g)) themeVars.theme[`animate-${m[1]}`] = m[2].trim()
const keyframesCss = {}
for (const m of tokensCss.matchAll(/@keyframes\s+(glob-[a-z-]+)\s*\{([\s\S]*?\})\s*\}/g)) {
  const frames = {}
  for (const f of m[2].matchAll(/([^{}]+?)\s*\{([^}]*)\}/g)) {
    frames[f[1].trim()] = Object.fromEntries([...f[2].matchAll(/([a-z-]+):\s*([^;]+);/g)].map((d) => [d[1], d[2].trim()]))
  }
  keyframesCss[`@keyframes ${m[1]}`] = frames
}

const items = []

items.push({
  $schema: SCHEMA,
  name: "glob-ui-theme",
  type: "registry:theme",
  title: "GlobUI theme",
  description: "GlobUI design tokens (--glob-*) in light and dark, and the Tailwind colour, radius and shadow utilities.",
  cssVars: themeVars,
  ...(Object.keys(keyframesCss).length > 0 ? { css: keyframesCss } : {}),
})

// utils, hooks: internal items, shared by the components.
const utilsDir = path.join(packagesDir, "utils")
items.push({
  $schema: SCHEMA,
  name: "glob-ui-utils",
  type: "registry:lib",
  title: "GlobUI utils",
  description: "cn(): class names merged with the GlobUI radius and shadow scales.",
  dependencies: npmDependencies(readJson(path.join(utilsDir, "package.json"))),
  registryDependencies: [`${SITE}/r/glob-ui-theme.json`],
  // index.ts is the entry (cn and the re-exports); every other file keeps its name next to it.
  files: sourceFiles(path.join(utilsDir, "src")).map((file) => ({
    path: path.relative(repo, file),
    type: "registry:lib",
    target: path.basename(file) === "index.ts" ? "@lib/glob-ui/utils.ts" : `@lib/glob-ui/${path.basename(file)}`,
    content: rewriteImports(readFileSync(file, "utf8")).replace(/from "\.\/([a-z-]+)"/g, 'from "@/lib/glob-ui/$1"'),
  })),
})

const hooksDir = path.join(packagesDir, "hooks")
items.push({
  $schema: SCHEMA,
  name: "glob-ui-hooks",
  type: "registry:hook",
  title: "GlobUI hooks",
  description: "Focus and positioning hooks used by the GlobUI overlay and menu components.",
  dependencies: npmDependencies(readJson(path.join(hooksDir, "package.json"))),
  registryDependencies: [`${SITE}/r/glob-ui-theme.json`],
  files: sourceFiles(path.join(hooksDir, "src")).map((file) => ({
    path: path.relative(repo, file),
    type: "registry:hook",
    target: `@hooks/glob-ui/${path.basename(file)}`,
    content: rewriteImports(readFileSync(file, "utf8")),
  })),
})

// Components: one item per documented package (slot included).
const componentPackages = [...components.map((c) => c.pkg), ...utilities.map((u) => u.pkg)].filter((p) => p !== "utils")
for (const pkgName of componentPackages) {
  const dir = path.join(packagesDir, pkgName)
  const pkg = readJson(path.join(dir, "package.json"))
  items.push({
    $schema: SCHEMA,
    name: pkgName,
    type: "registry:ui",
    title: titles.get(pkgName),
    description: descriptions.get(pkgName),
    dependencies: npmDependencies(pkg),
    registryDependencies: workspaceRegistryDependencies(pkg),
    files: sourceFiles(path.join(dir, "src")).map((file) => ({
      path: path.relative(repo, file),
      type: "registry:ui",
      target: `@components/glob-ui/${pkgName}/${path.basename(file)}`,
      content: rewriteImports(readFileSync(file, "utf8")),
    })),
  })
}

// Every component also needs the utils item (cn), so add it where a package has no dependency on it.
for (const item of items) {
  if (item.type !== "registry:ui") continue
  const url = `${SITE}/r/glob-ui-utils.json`
  if (!item.registryDependencies.includes(url)) item.registryDependencies.push(url)
  item.registryDependencies = [...new Set(item.registryDependencies)]
}

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })
for (const item of items) {
  // Empty arrays are dropped so the JSON only has what the schema needs.
  for (const key of ["dependencies", "registryDependencies"]) if (item[key] && item[key].length === 0) delete item[key]
  writeFileSync(path.join(outDir, `${item.name}.json`), JSON.stringify(item, null, 2) + "\n")
}
writeFileSync(
  path.join(outDir, "index.json"),
  JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry.json", name: "glob-ui", homepage: SITE, items: items.map((i) => ({ name: i.name, type: i.type, title: i.title })) }, null, 2) + "\n"
)
console.log(`registry: ${items.length} items written to public/r (site ${SITE})`)
