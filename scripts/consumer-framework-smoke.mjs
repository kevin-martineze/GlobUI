// Consumer smoke test for the framework packages: @glob-ui/svelte and @glob-ui/vue.
// Packs the packages, installs the tarballs into a throwaway Vite app per framework (outside the repo),
// renders AppShellLayout with a Sheet in the header, and runs `vite build`.
// Usage: node scripts/consumer-framework-smoke.mjs (SMOKE_DIR overrides the work folder).
// Needs network access for npm (registry reads only). Build the packages first: `pnpm build:packages`.
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const work = process.env.SMOKE_DIR ?? mkdtempSync(path.join(os.tmpdir(), "glob-ui-framework-"))
const tarDir = path.join(work, "tarballs")
const log = (msg) => console.log(`[framework-smoke] ${msg}`)
const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...opts })
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed:\n${r.stdout}${r.stderr}`)
  return r.stdout
}

mkdirSync(tarDir, { recursive: true })
log(`work folder: ${work}`)

// 1. Pack the packages the two frameworks need. Their @glob-ui/* dependencies are overridden to the tarballs.
const packages = ["core", "recipes", "utils", "styles", "svelte", "vue"]
const tarballs = {}
for (const dir of packages) {
  const pkgDir = path.join(root, "packages", dir)
  const manifest = JSON.parse(readFileSync(path.join(pkgDir, "package.json"), "utf8"))
  run("pnpm", ["pack", "--pack-destination", tarDir], { cwd: pkgDir })
  const file = readdirSync(tarDir).find((f) => f.startsWith(manifest.name.replace("@", "").replace("/", "-") + "-") && f.endsWith(".tgz"))
  if (!file) throw new Error(`no tarball for ${manifest.name}`)
  tarballs[manifest.name] = path.join(tarDir, file)
  log(`packed ${manifest.name} (${Math.round(statSync(tarballs[manifest.name]).size / 1024)} KB)`)
}
const local = Object.fromEntries(Object.entries(tarballs).map(([name, file]) => [name, `file:${file}`]))

// 2. The app files that every framework app shares.
const appCss = `@import "tailwindcss";
@import "@glob-ui/styles";

@source "../node_modules/@glob-ui/svelte";
@source "../node_modules/@glob-ui/vue";
@source "../node_modules/@glob-ui/recipes";
`

function makeApp(name, { framework, deps, devDeps, files }) {
  const dir = path.join(work, name)
  mkdirSync(path.join(dir, "src"), { recursive: true })
  const pkg = {
    name,
    private: true,
    type: "module",
    scripts: { build: "vite build" },
    dependencies: { ...deps, "@glob-ui/styles": local["@glob-ui/styles"], ...(framework === "svelte" ? { "@glob-ui/svelte": local["@glob-ui/svelte"] } : { "@glob-ui/vue": local["@glob-ui/vue"] }) },
    devDependencies: devDeps,
    overrides: { ...local },
  }
  writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg, null, 2) + "\n")
  writeFileSync(path.join(dir, "src/app.css"), appCss)
  writeFileSync(path.join(dir, "index.html"), `<!doctype html>\n<html lang="en">\n  <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>\n  <body>\n    <div id="app"></div>\n    <script type="module" src="/src/main.ts"></script>\n  </body>\n</html>\n`)
  for (const [file, content] of Object.entries(files)) writeFileSync(path.join(dir, file), content)
  return dir
}

const svelteApp = makeApp("svelte-consumer", {
  framework: "svelte",
  deps: { svelte: "^5.57.3" },
  devDeps: { "@sveltejs/vite-plugin-svelte": "^7.3.1", vite: "^8.3.8", tailwindcss: "^4.3.5", "@tailwindcss/vite": "^4.3.5" },
  files: {
    "vite.config.ts": `import { defineConfig } from "vite"\nimport { svelte } from "@sveltejs/vite-plugin-svelte"\nimport tailwindcss from "@tailwindcss/vite"\n\nexport default defineConfig({ plugins: [tailwindcss(), svelte()] })\n`,
    "src/main.ts": `import "./app.css"\nimport { mount } from "svelte"\nimport App from "./App.svelte"\n\nmount(App, { target: document.getElementById("app")! })\n`,
    "src/App.svelte": `<script lang="ts">
  import { AppShellLayout } from "@glob-ui/svelte/app-shell-layout"
  import { LayoutNavTrigger } from "@glob-ui/svelte/layout"
  import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose } from "@glob-ui/svelte/sheet"
</script>

<AppShellLayout>
  {#snippet header()}
    <LayoutNavTrigger />
    <strong>Smoke</strong>
    <Sheet>
      <SheetTrigger>Open sheet</SheetTrigger>
      <SheetContent side="right">
        <SheetTitle>Filters</SheetTitle>
        <SheetClose>Close</SheetClose>
      </SheetContent>
    </Sheet>
  {/snippet}
  {#snippet sidebar()}
    <a href="#orders">Orders</a>
  {/snippet}
  <h1>Orders</h1>
</AppShellLayout>
`,
  },
})

const vueApp = makeApp("vue-consumer", {
  framework: "vue",
  deps: { vue: "^3.5.45" },
  devDeps: { "@vitejs/plugin-vue": "^6.0.11", vite: "^8.3.8", tailwindcss: "^4.3.5", "@tailwindcss/vite": "^4.3.5" },
  files: {
    "vite.config.ts": `import { defineConfig } from "vite"\nimport vue from "@vitejs/plugin-vue"\nimport tailwindcss from "@tailwindcss/vite"\n\nexport default defineConfig({ plugins: [tailwindcss(), vue()] })\n`,
    "src/main.ts": `import "./app.css"\nimport { createApp } from "vue"\nimport App from "./App.vue"\n\ncreateApp(App).mount("#app")\n`,
    "src/App.vue": `<script setup lang="ts">
import { AppShellLayout } from "@glob-ui/vue/app-shell-layout"
import { LayoutNavTrigger } from "@glob-ui/vue/layout"
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose } from "@glob-ui/vue/sheet"
</script>

<template>
  <AppShellLayout>
    <template #header>
      <LayoutNavTrigger />
      <strong>Smoke</strong>
      <Sheet>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent side="right">
          <SheetTitle>Filters</SheetTitle>
          <SheetClose>Close</SheetClose>
        </SheetContent>
      </Sheet>
    </template>
    <template #sidebar>
      <a href="#orders">Orders</a>
    </template>
    <h1>Orders</h1>
  </AppShellLayout>
</template>
`,
  },
})

// 3. Install and build each app with the same npm steps a consumer runs.
for (const dir of [svelteApp, vueApp]) {
  log(`npm install in ${path.basename(dir)}`)
  run("npm", ["install"], { cwd: dir, stdio: "inherit" })
  log(`vite build in ${path.basename(dir)}`)
  run("npx", ["vite", "build"], { cwd: dir, stdio: "inherit" })
  if (!existsSync(path.join(dir, "dist/index.html"))) throw new Error(`${dir}: no dist/index.html after build`)
}

log(`OK: AppShellLayout with a Sheet built for Svelte and Vue (${work})`)
