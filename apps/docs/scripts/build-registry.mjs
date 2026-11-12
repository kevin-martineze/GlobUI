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
import { components, utilities, layouts, layoutCore, templates } from "./docs-data.mjs"

const here = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(here, "../../..")
const packagesDir = path.join(repo, "packages")
const outDir = path.resolve(here, "../public/r")
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")
const SCHEMA = "https://ui.shadcn.com/schema/registry-item.json"

const titles = new Map([...components, ...utilities, ...layouts, layoutCore].map((c) => [c.pkg, c.title]))
const descriptions = new Map([...components, ...utilities, ...layouts, layoutCore].map((c) => [c.pkg, c.description]))

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
    // Framework-free packages live in lib/ next to cn(): core behaviour and recipes (cva + class strings).
    .replace(/from "@glob-ui\/core"/g, 'from "@/lib/glob-ui/core/index"')
    .replace(/from "@glob-ui\/recipes"/g, 'from "@/lib/glob-ui/recipes/index"')
    // Point at index explicitly: a directory import can resolve to <name>/<name>.tsx, which does not
    // re-export helpers that live in other files of the package (for example calendar's date helpers).
    .replace(/from "@glob-ui\/([a-z-]+)"/g, 'from "@/components/glob-ui/$1/index"')
}

// The shadcn CLI (Base UI styles, the default since shadcn 4) rewrites `<X asChild>` JSX in copied files into
// `render={...}`, which GlobUI components do not accept. Registry sources must not use asChild as a JSX attribute
// (defining the prop is fine; forward it through a spread instead).
const JSX_AS_CHILD = /<[A-Z][\w.]*(?:\s+[^<>]*?)?\sasChild(?=[\s=/>])/
function assertNoJsxAsChild(file, source) {
  if (JSX_AS_CHILD.test(source)) {
    throw new Error(`${path.relative(repo, file)}: asChild used as a JSX attribute; the shadcn CLI would rewrite it to render. Forward it through a spread.`)
  }
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
    else if (slug === "core") deps.push(`${SITE}/r/glob-ui-core.json`)
    else if (slug === "recipes") deps.push(`${SITE}/r/glob-ui-recipes.json`)
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
  // utils re-exports the text helpers that moved to core, so it pulls the core item too.
  registryDependencies: [`${SITE}/r/glob-ui-theme.json`, `${SITE}/r/glob-ui-core.json`],
  // index.ts is the entry (cn and the re-exports); every other file keeps its name next to it.
  files: sourceFiles(path.join(utilsDir, "src")).map((file) => ({
    path: path.relative(repo, file),
    type: "registry:lib",
    target: path.basename(file) === "index.ts" ? "@lib/glob-ui/utils.ts" : `@lib/glob-ui/${path.basename(file)}`,
    content: rewriteImports(readFileSync(file, "utf8")).replace(/from "\.\/([a-z-]+)"/g, 'from "@/lib/glob-ui/$1"'),
  })),
})

// core and recipes: framework-free packages copied to lib/glob-ui/<name>/. Their files keep relative imports.
for (const [slug, title, description] of [
  ["core", "GlobUI core", "Framework-free behaviour used by the GlobUI components: focus, keyboard, positioning and scroll lock."],
  ["recipes", "GlobUI recipes", "Class-variance-authority variants and shared class strings used by the GlobUI components."],
]) {
  const dir = path.join(packagesDir, slug)
  const pkg = readJson(path.join(dir, "package.json"))
  items.push({
    $schema: SCHEMA,
    name: `glob-ui-${slug}`,
    type: "registry:lib",
    title,
    description,
    dependencies: npmDependencies(pkg),
    registryDependencies: workspaceRegistryDependencies(pkg, false),
    files: sourceFiles(path.join(dir, "src")).map((file) => {
      const rel = path.relative(path.join(dir, "src"), file)
      return {
        path: path.relative(repo, file),
        type: "registry:lib",
        target: `@lib/glob-ui/${slug}/${rel}`,
        content: rewriteImports(readFileSync(file, "utf8")),
      }
    }),
  })
}

const hooksDir = path.join(packagesDir, "hooks")
items.push({
  $schema: SCHEMA,
  name: "glob-ui-hooks",
  type: "registry:hook",
  title: "GlobUI hooks",
  description: "Focus and positioning hooks used by the GlobUI overlay and menu components.",
  dependencies: npmDependencies(readJson(path.join(hooksDir, "package.json"))),
  registryDependencies: [...new Set([`${SITE}/r/glob-ui-theme.json`, ...workspaceRegistryDependencies(readJson(path.join(hooksDir, "package.json")), false)])],
  files: sourceFiles(path.join(hooksDir, "src")).map((file) => ({
    path: path.relative(repo, file),
    type: "registry:hook",
    target: `@hooks/glob-ui/${path.basename(file)}`,
    content: rewriteImports(readFileSync(file, "utf8")),
  })),
})

// Components: one item per documented package (slot included).
const componentPackages = [...components.map((c) => c.pkg), ...utilities.map((u) => u.pkg), layoutCore.pkg, ...layouts.map((l) => l.pkg)].filter((p) => p !== "utils")
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
      content: (assertNoJsxAsChild(file, readFileSync(file, "utf8")), rewriteImports(readFileSync(file, "utf8"))),
    })),
  })
}

// Templates: copy-code blocks built from GlobUI layouts and components. Their npm dependencies come from
// templates/package.json; their registry dependencies from the @glob-ui/* imports in each file.
const templatesDir = path.join(repo, "templates")
const templateNpm = npmDependencies(readJson(path.join(templatesDir, "package.json")))
for (const t of templates) {
  const dir = path.join(templatesDir, path.dirname(t.file))
  const files = sourceFiles(dir)
  const sources = files.map((file) => readFileSync(file, "utf8"))
  const deps = new Set([`${SITE}/r/glob-ui-theme.json`])
  for (const source of sources) {
    for (const [, slug] of source.matchAll(/from "@glob-ui\/([a-z-]+)"/g)) {
      deps.add(slug === "utils" ? `${SITE}/r/glob-ui-utils.json` : slug === "core" ? `${SITE}/r/glob-ui-core.json` : slug === "recipes" ? `${SITE}/r/glob-ui-recipes.json` : `${SITE}/r/${slug}.json`)
    }
  }
  items.push({
    $schema: SCHEMA,
    name: t.name,
    type: "registry:block",
    title: t.title,
    description: t.description,
    ...(templateNpm.length ? { dependencies: templateNpm } : {}),
    registryDependencies: [...deps],
    files: files.map((file, i) => {
      assertNoJsxAsChild(file, sources[i])
      return {
        path: path.relative(repo, file),
        type: "registry:block",
        target: `@components/templates/${t.slug}/${path.basename(file)}`,
        content: rewriteImports(sources[i]),
      }
    }),
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
