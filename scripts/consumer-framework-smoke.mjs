// Consumer smoke test for the framework packages: @glob-ui/svelte, @glob-ui/vue and @glob-ui/angular.
// Packs the packages, installs the tarballs into a throwaway app per framework (outside the repo), renders
// AppShellLayout with a Sheet in the header, and builds it: `vite build` for Svelte and Vue, `ng build` for Angular.
// Angular is built twice: on 22.2.5 and on the latest 21.x that passes the release-age policy, so the peer range
// can be stated from evidence. Usage: node scripts/consumer-framework-smoke.mjs (SMOKE_DIR overrides the work folder).
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

// 1. Pack the packages. The Angular package packs its publishConfig.directory (dist/) with workspace versions rewritten.
const packages = ["core", "recipes", "utils", "styles", "svelte", "vue", "angular"]
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

// 2. Shared pieces.
const tailwindCss = (sources) => `@import "tailwindcss";
@import "@glob-ui/styles";

${sources.map((s) => `@source "${s}";`).join("\n")}
`

function makeApp(name, { deps, devDeps, files, pinned, overrides = {} }) {
  const dir = path.join(work, name)
  mkdirSync(path.join(dir, "src"), { recursive: true })
  const pkg = { name, private: true, type: "module", scripts: { build: "vite build" }, dependencies: { ...deps, ...pinned }, devDependencies: devDeps, overrides: { ...local, ...overrides } }
  writeFileSync(path.join(dir, "package.json"), JSON.stringify(pkg, null, 2) + "\n")
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
    writeFileSync(path.join(dir, file), content)
  }
  return dir
}

const svelteApp = makeApp("svelte-consumer", {
  deps: { svelte: "^5.57.3", "@glob-ui/svelte": local["@glob-ui/svelte"], "@glob-ui/styles": local["@glob-ui/styles"] },
  devDeps: { "@sveltejs/vite-plugin-svelte": "^7.3.1", vite: "^8.3.8", tailwindcss: "^4.3.5", "@tailwindcss/vite": "^4.3.5" },
  files: {
    "vite.config.ts": `import { defineConfig } from "vite"\nimport { svelte } from "@sveltejs/vite-plugin-svelte"\nimport tailwindcss from "@tailwindcss/vite"\n\nexport default defineConfig({ plugins: [tailwindcss(), svelte()] })\n`,
    "index.html": `<!doctype html>\n<html lang="en"><head><meta charset="UTF-8" /></head><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>\n`,
    "src/app.css": tailwindCss(["../node_modules/@glob-ui/svelte", "../node_modules/@glob-ui/recipes"]),
    "src/main.ts": `import "./app.css"\nimport { mount } from "svelte"\nimport App from "./App.svelte"\n\nmount(App, { target: document.getElementById("app")! })\n`,
    "src/App.svelte": `<script lang="ts">
  import { AppShellLayout } from "@glob-ui/svelte/app-shell-layout"
  import { LayoutNavTrigger } from "@glob-ui/svelte/layout"
  import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose } from "@glob-ui/svelte/sheet"
  import { Button } from "@glob-ui/svelte/button"
  import { Field } from "@glob-ui/svelte/field"
  import { Input } from "@glob-ui/svelte/input"
  import { Checkbox } from "@glob-ui/svelte/checkbox"
  import { Select } from "@glob-ui/svelte/select"
  import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@glob-ui/svelte/dropdown-menu"
  import { Toaster, toast } from "@glob-ui/svelte/toast"
  import { Tabs, TabsList, TabsTrigger, TabsContent } from "@glob-ui/svelte/tabs"
  import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, getPageRange } from "@glob-ui/svelte/pagination"
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
  <Field label="Search" description="Order number or customer">
    <Input />
  </Field>
  <Checkbox label="Only open orders" />
  <Select aria-label="Status" options={[{ value: "open", label: "Open" }, { value: "closed", label: "Closed" }]} />
  <DropdownMenu>
    <DropdownMenuTrigger>More</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onSelect={() => toast.success("Exported")}>Export</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <Button>Apply</Button>
  <Tabs defaultValue="all">
    <TabsList aria-label="Orders view">
      <TabsTrigger value="all">All</TabsTrigger>
      <TabsTrigger value="open">Open</TabsTrigger>
    </TabsList>
    <TabsContent value="all">All orders</TabsContent>
    <TabsContent value="open">Open orders</TabsContent>
  </Tabs>
  <Pagination>
    <PaginationContent>
      {#each getPageRange({ page: 1, pageCount: 10 }) as item, i (i)}
        <PaginationItem>
          {#if item === "ellipsis"}<PaginationEllipsis />{:else}<PaginationLink href="#orders" isActive={item === 1}>{item}</PaginationLink>{/if}
        </PaginationItem>
      {/each}
    </PaginationContent>
  </Pagination>
  <Toaster />
</AppShellLayout>
`,
  },
  pinned: {},
})

const vueApp = makeApp("vue-consumer", {
  deps: { vue: "^3.5.45", "@glob-ui/vue": local["@glob-ui/vue"], "@glob-ui/styles": local["@glob-ui/styles"] },
  devDeps: { "@vitejs/plugin-vue": "^6.0.10", vite: "^8.3.8", tailwindcss: "^4.3.5", "@tailwindcss/vite": "^4.3.5" },
  files: {
    "vite.config.ts": `import { defineConfig } from "vite"\nimport vue from "@vitejs/plugin-vue"\nimport tailwindcss from "@tailwindcss/vite"\n\nexport default defineConfig({ plugins: [tailwindcss(), vue()] })\n`,
    "index.html": `<!doctype html>\n<html lang="en"><head><meta charset="UTF-8" /></head><body><div id="app"></div><script type="module" src="/src/main.ts"></script></body></html>\n`,
    "src/app.css": tailwindCss(["../node_modules/@glob-ui/vue", "../node_modules/@glob-ui/recipes"]),
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
  pinned: {},
})

// Angular: the smallest standalone setup that the Angular compiler builds (no Angular CLI project generator).
// The application builder compiles with the Angular compiler; `ng build` is the Angular CLI command that runs it.
function angularApp(version, typescript) {
  const ng = { "@angular/build": version, "@angular/cli": version, "@angular/common": version, "@angular/compiler": version, "@angular/core": version, "@angular/platform-browser": version }
  return makeApp(`angular-${version}`, {
    deps: { ...ng, rxjs: "^7.8.2", "@glob-ui/angular": local["@glob-ui/angular"], "@glob-ui/styles": local["@glob-ui/styles"], tslib: "^2.8.1" },
    devDeps: { typescript, tailwindcss: "^4.3.5", "@tailwindcss/postcss": "^4.3.5" },
    // npm does not apply the pnpm release-age policy, so every Angular package (including the peers that npm would
    // otherwise pick as the newest) is pinned to the version under test.
    pinned: { "@angular/compiler-cli": version },
    overrides: Object.fromEntries(["@angular/build", "@angular/cli", "@angular/common", "@angular/compiler", "@angular/compiler-cli", "@angular/core", "@angular/platform-browser"].map((p) => [p, version])),
    files: {
      "angular.json": JSON.stringify({
        $schema: "./node_modules/@angular/cli/lib/config/schema.json",
        version: 1,
        projects: {
          app: {
            projectType: "application",
            root: "",
            sourceRoot: "src",
            architect: {
              build: {
                builder: "@angular/build:application",
                options: { browser: "src/main.ts", tsConfig: "tsconfig.json", outputPath: "dist", index: "src/index.html", styles: ["src/styles.css"] },
              },
            },
          },
        },
      }, null, 2) + "\n",
      "tsconfig.json": JSON.stringify({
        compilerOptions: { target: "ES2022", module: "ES2022", moduleResolution: "bundler", strict: true, skipLibCheck: true, lib: ["ES2022", "DOM"], types: [] },
        angularCompilerOptions: { strictTemplates: true, strictInjectionParameters: true },
        files: ["src/main.ts"],
      }, null, 2) + "\n",
      ".postcssrc.json": `{ "plugins": { "@tailwindcss/postcss": {} } }\n`,
      "src/index.html": `<!doctype html>\n<html lang="en"><head><meta charset="UTF-8" /></head><body><app-root></app-root></body></html>\n`,
      "src/styles.css": tailwindCss(["../node_modules/@glob-ui/angular", "../node_modules/@glob-ui/recipes"]),
      "src/main.ts": `import { bootstrapApplication } from "@angular/platform-browser"\nimport { provideZonelessChangeDetection } from "@angular/core"\nimport { App } from "./app/app"\n\nbootstrapApplication(App, { providers: [provideZonelessChangeDetection()] })\n`,
      "src/app/app.ts": `import { Component } from "@angular/core"
import { GlobAppShellLayout } from "@glob-ui/angular/app-shell-layout"
import { GlobLayoutNavTrigger } from "@glob-ui/angular/layout"
import { GlobDialogTrigger } from "@glob-ui/angular/dialog"
import { GlobSheet, GlobSheetContent } from "@glob-ui/angular/sheet"

@Component({
  selector: "app-root",
  imports: [GlobAppShellLayout, GlobLayoutNavTrigger, GlobDialogTrigger, GlobSheet, GlobSheetContent],
  template: \`<glob-app-shell-layout [header]="hdr" [sidebar]="side">
    <ng-template #hdr>
      <button globLayoutNavTrigger></button>
      <strong>Smoke</strong>
      <glob-sheet>
        <button globDialogTrigger>Open sheet</button>
        <glob-sheet-content side="right"><h2>Filters</h2></glob-sheet-content>
      </glob-sheet>
    </ng-template>
    <ng-template #side><a href="#orders">Orders</a></ng-template>
    <h1>Orders</h1>
  </glob-app-shell-layout>\`,
})
export class App {}
`,
    },
  })
}

// 3. Install and build each app with the same npm steps a consumer runs.
const apps = [
  [svelteApp, "vite"],
  [vueApp, "vite"],
  [angularApp("22.2.5", "6.0.3"), "ng"],
  [angularApp("21.2.26", "5.9.3"), "ng"],
]
for (const [dir, tool] of apps) {
  log(`npm install in ${path.basename(dir)}`)
  // Angular apps: npm also gets a cutoff from before 22.2.6 (published 2026-11-04 22:43 UTC), so no transitive dependency
  // newer than the pinned line is picked.
  const args = dir.includes("angular-") ? ["install", "--before=2026-11-11T00:00:00.000Z"] : ["install"]
  run("npm", args, { cwd: dir, stdio: "inherit" })
  log(`${tool} build in ${path.basename(dir)}`)
  if (tool === "ng") run("npx", ["ng", "build"], { cwd: dir, stdio: "inherit" })
  else run("npx", ["vite", "build"], { cwd: dir, stdio: "inherit" })
  const out = existsSync(path.join(dir, "dist"))
  if (!out) throw new Error(`${dir}: no dist after build`)
}

log(`OK: AppShellLayout with a Sheet built for Svelte (plus Field, Input, Checkbox, Button, Select, DropdownMenu, Toaster, Tabs, Pagination), Vue, and Angular 22.2.5 and 21.2.26 (${work})`)
