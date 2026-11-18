// Generates the Svelte copy-code registry for the shadcn-svelte CLI: public/r/svelte/<name>.json.
// Called by build-registry.mjs after the React registry, with the same theme. Everything is read from
// packages/svelte (one item per subpath), packages/{utils,core,recipes} and templates/svelte.
//
// The format follows the shadcn-svelte registry item schema (https://shadcn-svelte.com/schema/registry-item.json).
// A file's `target` is relative to the folder of its type in the consumer's components.json: registry:ui files go
// under the `ui` alias ($lib/components/ui), registry:lib under `lib` ($lib), registry:block under `components`.
// The CLI replaces the $LIB$ and $UI$ placeholders in the content with the consumer's aliases. Import rewrites:
//   @glob-ui/utils           -> $LIB$/glob-ui/utils
//   @glob-ui/core|recipes    -> $LIB$/glob-ui/<name>/index
//   @glob-ui/svelte/<part>   -> $UI$/glob-ui/<part>/index      (templates)
// The component files keep their relative imports (../shared/context, ../button): every part is copied to
// <ui>/glob-ui/<part>/, so the folders sit side by side as in the package. registryDependencies are absolute URLs.
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(here, "../../..")
const packagesDir = path.join(repo, "packages")
const svelteSrc = path.join(packagesDir, "svelte/src")
const SCHEMA = "https://shadcn-svelte.com/schema/registry-item.json"

const readJson = (file) => JSON.parse(readFileSync(file, "utf8"))

/** Files of a folder (recursively), without tests, in a stable order. */
function filesOf(dir, pattern) {
  const out = []
  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const full = path.join(d, entry)
      if (statSync(full).isDirectory()) walk(full)
      else if (pattern.test(entry) && !/\.test\./.test(entry)) out.push(full)
    }
  }
  walk(dir)
  return out.sort()
}

function rewriteImports(source) {
  return source
    .replace(/from "@glob-ui\/utils"/g, 'from "$LIB$/glob-ui/utils"')
    .replace(/from "@glob-ui\/(core|recipes)"/g, 'from "$LIB$/glob-ui/$1/index"')
    .replace(/from "@glob-ui\/svelte\/([a-z-]+)"/g, 'from "$UI$/glob-ui/$1/index"')
}

/** The npm packages a set of sources imports (bare specifiers), with the version from the given package.json files. */
function npmDependencies(sources, manifests) {
  const versions = Object.assign({}, ...manifests.map((m) => m.dependencies ?? {}))
  const deps = new Set()
  for (const source of sources) {
    for (const [, spec] of source.matchAll(/from "([^".$][^"]*)"/g)) {
      if (spec.startsWith("@glob-ui/") || spec === "svelte" || spec.startsWith("svelte/")) continue
      const name = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]
      if (!versions[name]) throw new Error(`svelte registry: no version for the import "${spec}"`)
      deps.add(`${name}@${versions[name]}`)
    }
  }
  return [...deps].sort()
}

/** Registry URLs for what a set of sources imports from GlobUI: the lib items and the sibling parts. */
function registryDependencies(site, sources, self) {
  const url = (name) => `${site}/r/svelte/${name}.json`
  const deps = new Set([url("glob-ui-theme"), url("glob-ui-utils")])
  for (const source of sources) {
    for (const [, name] of source.matchAll(/from "@glob-ui\/(core|recipes)"/g)) deps.add(url(`glob-ui-${name}`))
    for (const [, part] of source.matchAll(/from "\.\.\/([a-z-]+)/g)) deps.add(url(part === "shared" ? "glob-ui-svelte-shared" : part))
    for (const [, part] of source.matchAll(/from "@glob-ui\/svelte\/([a-z-]+)"/g)) deps.add(url(part))
  }
  deps.delete(url(self))
  return [...deps]
}

/**
 * Writes the Svelte registry. `theme` is the React theme item (cssVars and css), so both registries install the
 * same tokens. `templates` is the docs-data list; each one has a Svelte version in templates/svelte/<slug>/.
 */
export function buildSvelteRegistry({ site, outDir, theme, templates, titles, descriptions }) {
  const svelteManifest = readJson(path.join(packagesDir, "svelte/package.json"))
  const items = []

  items.push({
    $schema: SCHEMA,
    name: "glob-ui-theme",
    type: "registry:theme",
    title: "GlobUI theme",
    description: theme.description,
    cssVars: theme.cssVars,
    ...(theme.css ? { css: theme.css } : {}),
  })

  // cn() and the framework-free packages, copied to $lib/glob-ui/.
  const utilsDir = path.join(packagesDir, "utils/src")
  const utilsFiles = filesOf(utilsDir, /\.ts$/)
  const utilsSources = utilsFiles.map((f) => readFileSync(f, "utf8"))
  items.push({
    $schema: SCHEMA,
    name: "glob-ui-utils",
    type: "registry:lib",
    title: "GlobUI utils",
    description: "cn(): class names merged with the GlobUI radius and shadow scales.",
    dependencies: npmDependencies(utilsSources, [readJson(path.join(packagesDir, "utils/package.json"))]),
    registryDependencies: [`${site}/r/svelte/glob-ui-core.json`],
    files: utilsFiles.map((file, i) => ({
      type: "registry:lib",
      target: path.basename(file) === "index.ts" ? "glob-ui/utils.ts" : `glob-ui/${path.basename(file)}`,
      content: rewriteImports(utilsSources[i]).replace(/from "\.\/([a-z-]+)"/g, 'from "$LIB$/glob-ui/$1"'),
    })),
  })
  for (const [slug, title, description] of [
    ["core", "GlobUI core", "Framework-free behaviour used by the GlobUI components: focus, keyboard, positioning and scroll lock."],
    ["recipes", "GlobUI recipes", "Class-variance-authority variants and shared class strings used by the GlobUI components."],
  ]) {
    const dir = path.join(packagesDir, slug, "src")
    const files = filesOf(dir, /\.ts$/)
    const sources = files.map((f) => readFileSync(f, "utf8"))
    const manifest = readJson(path.join(packagesDir, slug, "package.json"))
    const deps = Object.keys(manifest.dependencies ?? {})
      .filter((name) => name.startsWith("@glob-ui/"))
      .map((name) => `${site}/r/svelte/glob-ui-${name.slice("@glob-ui/".length)}.json`)
    items.push({
      $schema: SCHEMA,
      name: `glob-ui-${slug}`,
      type: "registry:lib",
      title,
      description,
      dependencies: npmDependencies(sources, [manifest]),
      registryDependencies: deps,
      files: files.map((file, i) => ({
        type: "registry:lib",
        target: `glob-ui/${slug}/${path.relative(dir, file)}`,
        content: rewriteImports(sources[i]),
      })),
    })
  }

  // The Svelte parts. `shared` (contexts, floating panel, listbox) is internal; every other folder is a subpath.
  const parts = readdirSync(svelteSrc).filter((dir) => existsSync(path.join(svelteSrc, dir, "index.ts")) || dir === "shared")
  for (const part of parts.sort()) {
    const dir = path.join(svelteSrc, part)
    const files = filesOf(dir, /\.(ts|svelte)$/)
    const sources = files.map((f) => readFileSync(f, "utf8"))
    const name = part === "shared" ? "glob-ui-svelte-shared" : part
    items.push({
      $schema: SCHEMA,
      name,
      type: "registry:ui",
      title: part === "shared" ? "GlobUI Svelte shared" : `${titles.get(part) ?? part} (Svelte)`,
      description: part === "shared" ? "Contexts, the floating panel and the listbox shared by the GlobUI Svelte components." : descriptions.get(part),
      dependencies: npmDependencies(sources, [svelteManifest]),
      registryDependencies: registryDependencies(site, sources, name),
      files: files.map((file, i) => ({
        type: "registry:ui",
        target: `glob-ui/${part}/${path.relative(dir, file)}`,
        content: rewriteImports(sources[i]),
      })),
    })
  }

  // Templates: one .svelte file each, copied to <components>/templates/<slug>/.
  for (const t of templates) {
    const dir = path.join(repo, "templates/svelte", t.slug)
    if (!existsSync(dir)) throw new Error(`svelte registry: templates/svelte/${t.slug} is missing`)
    const files = filesOf(dir, /\.svelte$/)
    const sources = files.map((f) => readFileSync(f, "utf8"))
    items.push({
      $schema: SCHEMA,
      name: t.name,
      type: "registry:block",
      title: `${t.title} (Svelte)`,
      description: t.description,
      registryDependencies: registryDependencies(site, sources, t.name),
      files: files.map((file, i) => ({
        type: "registry:block",
        target: `templates/${t.slug}/${path.basename(file)}`,
        content: rewriteImports(sources[i]),
      })),
    })
  }

  const dir = path.join(outDir, "svelte")
  mkdirSync(dir, { recursive: true })
  for (const item of items) {
    for (const key of ["dependencies", "registryDependencies"]) if (item[key] && item[key].length === 0) delete item[key]
    writeFileSync(path.join(dir, `${item.name}.json`), JSON.stringify(item, null, 2) + "\n")
  }
  // The index the CLI reads when this folder is its registry (COMPONENTS_REGISTRY_URL): every item, with the
  // address of its file relative to the index. Adding by URL works without it.
  const index = items.map((item) => {
    const entry = { name: item.name, type: item.type, title: item.title, description: item.description }
    for (const key of ["dependencies", "registryDependencies"]) if (item[key]) entry[key] = item[key]
    return { ...entry, relativeUrl: `${item.name}.json` }
  })
  writeFileSync(path.join(dir, "index.json"), JSON.stringify(index, null, 2) + "\n")
  return items.length
}
