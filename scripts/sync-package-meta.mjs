// Sets the release metadata of every @glob-ui/* package, copies the root LICENSE into it, and
// writes its README from the docs table. Run it after editing the table, and check it with
// `pnpm check:packages` (the check fails if a copy has drifted).
//
// Why copies and not a prepack script: pnpm, npm and changesets all pack the package folder as
// it is on disk. A committed copy needs no lifecycle hook, so `pnpm pack` and CI behave the same.
import { readFileSync, readdirSync, writeFileSync, copyFileSync, existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { components, utilities, layouts, layoutCore } from "../apps/docs/scripts/docs-data.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const REPO = "https://github.com/kevin-martineze/GlobUI"
const DOCS = `${REPO}/tree/main/apps/docs/content/docs`

// Docs entry for each package: components/<slug>.mdx, or a utility page.
const docEntry = new Map()
for (const c of components) docEntry.set(c.pkg, { title: c.title, description: c.description, page: `components/${c.slug}.mdx` })
for (const u of utilities) docEntry.set(u.pkg, { title: u.title, description: u.description, page: `utilities/${u.slug}.mdx` })
for (const l of layouts) docEntry.set(l.pkg, { title: l.title, description: l.description, page: `layouts/${l.slug}.mdx` })
docEntry.set(layoutCore.pkg, { title: layoutCore.title, description: layoutCore.description, page: `layouts/${layoutCore.slug}.mdx` })

const extra = {
  all: { description: "Every GlobUI component in one package.", keywords: ["bundle"] },
  styles: { description: "GlobUI design tokens (CSS custom properties) and the Tailwind theme mapping.", keywords: ["tokens", "tailwind", "theme"] },
  hooks: { description: "Internal hooks used by GlobUI components.", internal: true },
  utils: { description: "Internal class-name helper used by GlobUI components.", internal: true },
  // Framework-free packages: no React in their keywords. Core is behaviour over the DOM; recipes are class strings.
  core: { description: "Internal framework-free behaviour (focus, keyboard, positioning, scroll) used by GlobUI components.", keywords: ["behaviour", "focus", "keyboard"], internal: true, frameworkFree: true },
  // Framework packages: ESM, one subpath per component family (their exports are written by hand, see below).
  svelte: { description: "Svelte 5 components for GlobUI: dialog, sheet and layouts, with the same API and behaviour as the React packages.", keywords: ["svelte", "components", "accessible", "tailwind"], framework: "Svelte", esm: true },
  vue: { description: "Vue 3 components for GlobUI: dialog, sheet and layouts, with the same API and behaviour as the React packages.", keywords: ["vue", "components", "accessible", "tailwind"], framework: "Vue", esm: true },
  recipes: { description: "Internal class-variance-authority recipes and shared class strings used by GlobUI components.", keywords: ["recipes", "tailwind"], internal: true, frameworkFree: true },
}

const packagesDir = path.join(root, "packages")
for (const dir of readdirSync(packagesDir)) {
  const pkgPath = path.join(packagesDir, dir, "package.json")
  if (!existsSync(pkgPath)) continue
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
  const name = dir
  const doc = docEntry.get(name)
  const info = extra[name] ?? {}
  const description = doc?.description ?? info.description
  const isStyles = name === "styles"
  const isInternal = Boolean(info.internal)
  const frameworkFree = Boolean(info.frameworkFree)
  const keywords = frameworkFree || info.esm
    ? ["glob-ui", ...(info.keywords ?? []), name]
    : ["react", "glob-ui", ...(isStyles ? ["tokens", "tailwind"] : ["components", "accessible", "tailwind"]), ...(info.keywords ?? []), name]

  delete pkg.private
  pkg.description = description
  pkg.keywords = [...new Set(keywords)]
  pkg.license = "MIT"
  pkg.author = "Kevin Martínez E"
  pkg.repository = { type: "git", url: "git+https://github.com/kevin-martineze/GlobUI.git", directory: `packages/${name}` }
  pkg.homepage = `${REPO}#readme`
  pkg.bugs = { url: `${REPO}/issues` }
  pkg.publishConfig = { access: "public", provenance: true }
  pkg.sideEffects = isStyles ? ["*.css"] : false
  pkg.files = isStyles ? ["glob-ui.css", "LICENSE", "README.md"] : ["dist/", "LICENSE", "README.md"]
  // Conditional exports with one types file per module format (.d.mts for import, .d.ts for require),
  // so ESM consumers get ESM types. Without this, attw reports FalseCJS.
  if (info.esm) {
    // Hand-written subpath exports (one per component family). Only the module type is set here.
    pkg.type = "module"
  } else if (isStyles) {
    pkg.exports = { ".": "./glob-ui.css", "./package.json": "./package.json" }
  } else {
    pkg.exports = {
      ".": {
        import: { types: "./dist/index.d.mts", default: "./dist/index.mjs" },
        require: { types: "./dist/index.d.ts", default: "./dist/index.js" },
      },
      "./package.json": "./package.json",
    }
    pkg.type = "commonjs"
    pkg.engines = { node: ">=18.18" }
  }
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")

  copyFileSync(path.join(root, "LICENSE"), path.join(packagesDir, dir, "LICENSE"))

  const install = `\`\`\`bash\npnpm add ${pkg.name}\n\`\`\``
  const lines = [`# ${pkg.name}`, "", description, ""]
  if (isInternal) {
    lines.push(
      "> **Internal API.** This package is used by the other GlobUI packages. Its exports can change in any release, so depend on the component packages instead.",
      ""
    )
  }
  if (doc) {
    lines.push("## Install", "", install, "", "## Documentation", "", `Full docs, examples and the accessibility table: [${doc.title}](${DOCS}/${doc.page}).`, "")
  } else if (isStyles) {
    lines.push("## Install", "", install, "", "In your global stylesheet (see the [installation guide](" + `${DOCS}/installation.mdx` + ")):", "", "```css", '@import "tailwindcss";', '@import "@glob-ui/styles";', "```", "")
  } else if (name === "all") {
    lines.push("## Install", "", install, "", "Every component is also available as its own package, for example `@glob-ui/button`.", "")
  }
  if (info.framework) {
    const families = ["dialog", "sheet", "layout", "app-shell-layout", "page-layout", "stacked-layout"]
    lines.push(
      "## Install",
      "",
      install,
      "",
      `Peer dependency: \`${info.framework === "Svelte" ? "svelte" : "vue"}\` (${info.framework === "Svelte" ? "^5" : "^3.5"}).`,
      "",
      "## Subpaths",
      "",
      `Each component family is its own subpath: ${families.map((f) => "\`@glob-ui/" + pkg.name.split("/")[1] + "/" + f + "\`").join(", ")}.`,
      "",
      "## Tailwind",
      "",
      "The components ship Tailwind class names. Tailwind does not scan \`node_modules\` by default, so add these \`@source\` lines to your stylesheet, next to the GlobUI theme:",
      "",
      "```css",
      '@import "tailwindcss";',
      '@import "@glob-ui/styles";',
      '@source "../node_modules/@glob-ui/' + pkg.name.split("/")[1] + '";',
      '@source "../node_modules/@glob-ui/recipes";',
      "```",
      "",
      "## Usage",
      "",
      "```" + (info.framework === "Svelte" ? "svelte" : "vue"),
      ...(info.framework === "Svelte"
        ? ['<script lang="ts">', '  import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@glob-ui/svelte/dialog"', "</script>", "", "<Dialog>", "  <DialogTrigger>Open</DialogTrigger>", "  <DialogContent>", "    <DialogTitle>Confirm</DialogTitle>", "  </DialogContent>", "</Dialog>"]
        : ['<script setup lang="ts">', '  import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@glob-ui/vue/dialog"', "</script>", "", "<template>", "  <Dialog>", "    <DialogTrigger>Open</DialogTrigger>", "    <DialogContent>", "      <DialogTitle>Confirm</DialogTitle>", "    </DialogContent>", "  </Dialog>", "</template>"]),
      "",
      "```",
      ""
    )
  }
  lines.push("## License", "", "MIT. See [LICENSE](./LICENSE).", "")
  writeFileSync(path.join(packagesDir, dir, "README.md"), lines.join("\n"))
}
console.log("package metadata, LICENSE and README synced")
