// End-to-end test of the Svelte copy-code registry: serves the docs (dev server) with the registry generated for
// this local address, installs items into a fresh Vite + Svelte 5 app with the shadcn-svelte CLI in
// non-interactive mode, then runs svelte-check and `vite build` on that app.
// Usage: node scripts/shadcn-svelte-e2e.mjs   (SMOKE_DIR overrides the work folder, PORT the docs port)
import { spawn, spawnSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const docs = path.join(root, "apps/docs")
const port = process.env.PORT ?? "3003"
const site = `http://localhost:${port}`
const work = process.env.SMOKE_DIR ?? mkdtempSync(path.join(os.tmpdir(), "glob-ui-shadcn-svelte-"))
const app = path.join(work, "svelte-app")
mkdirSync(app, { recursive: true })
const log = (m) => console.log(`[shadcn-svelte-e2e] ${m}`)
const sh = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...opts })
  const out = (r.stdout ?? "") + (r.stderr ?? "")
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed:\n${out}`)
  return out
}
const write = (file, content) => {
  mkdirSync(path.dirname(path.join(app, file)), { recursive: true })
  writeFileSync(path.join(app, file), content)
}

// 1. Registry for this address, then the docs dev server that serves it.
sh("node", ["scripts/build-registry.mjs"], { cwd: docs, env: { ...process.env, NEXT_PUBLIC_SITE_URL: site } })
const server = spawn("pnpm", ["exec", "next", "dev", "-p", port], { cwd: docs, stdio: "ignore", detached: true })
const stop = () => { try { process.kill(-server.pid) } catch {} }
process.on("exit", stop)
try {
  let up = false
  for (let i = 0; i < 90 && !up; i++) {
    up = await fetch(`${site}/r/svelte/index.json`).then((r) => r.ok).catch(() => false)
    if (!up) await new Promise((r) => setTimeout(r, 2000))
  }
  if (!up) throw new Error(`docs did not serve ${site}/r/svelte/index.json`)
  log(`registry served at ${site}/r/svelte`)

  // 2. A fresh Vite + Svelte 5 + Tailwind 4 app with the `$lib` alias, and the components.json that
  // `shadcn-svelte init` writes (written here, so the test does not depend on the init prompts or its base styles).
  write(
    "package.json",
    JSON.stringify(
      {
        name: "svelte-app",
        private: true,
        type: "module",
        scripts: { build: "vite build", check: "svelte-check --tsconfig ./tsconfig.json --fail-on-warnings" },
        devDependencies: {
          svelte: "^5.57.3",
          vite: "^8.3.8",
          "@sveltejs/vite-plugin-svelte": "^7.3.1",
          tailwindcss: "^4.3.5",
          "@tailwindcss/vite": "^4.3.5",
          typescript: "^5.9.3",
          "svelte-check": "^4.7.8",
          // As after `shadcn-svelte init`: `add` writes @import "shadcn-svelte/tailwind.css" into app.css.
          "shadcn-svelte": "1.8.0",
        },
      },
      null,
      2
    ) + "\n"
  )
  write(
    "vite.config.ts",
    `import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  resolve: { alias: { $lib: fileURLToPath(new URL("./src/lib", import.meta.url)) } },
})
`
  )
  write(
    "tsconfig.json",
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "bundler",
          strict: true,
          skipLibCheck: true,
          isolatedModules: true,
          verbatimModuleSyntax: true,
          lib: ["ES2022", "DOM", "DOM.Iterable"],
          types: [],
          baseUrl: ".",
          paths: { $lib: ["./src/lib"], "$lib/*": ["./src/lib/*"] },
        },
        include: ["src/**/*.ts", "src/**/*.svelte"],
      },
      null,
      2
    ) + "\n"
  )
  write("index.html", `<!doctype html>\n<html lang="en">\n  <body>\n    <div id="app"></div>\n    <script type="module" src="/src/main.ts"></script>\n  </body>\n</html>\n`)
  write("src/app.css", `@import "tailwindcss";\n`)
  write("src/main.ts", `import "./app.css"\nimport { mount } from "svelte"\nimport App from "./App.svelte"\n\nmount(App, { target: document.getElementById("app")! })\n`)
  write(
    "components.json",
    JSON.stringify(
      {
        $schema: "https://shadcn-svelte.com/schema.json",
        tailwind: { css: "src/app.css", baseColor: "slate" },
        aliases: { components: "$lib/components", utils: "$lib/utils", ui: "$lib/components/ui", hooks: "$lib/hooks", lib: "$lib" },
        typescript: true,
        registry: "https://shadcn-svelte.com/registry",
      },
      null,
      2
    ) + "\n"
  )
  sh("npm", ["install", "--no-audit", "--no-fund"], { cwd: app })
  log("Vite + Svelte app: OK")

  // 3. Add items from the registry, non-interactively, with this registry as the CLI's index. alert-dialog pulls
  // dialog and button; data-table pulls table, checkbox and select; the templates pull the layouts. --overwrite
  // also answers the "Updates to your app.css are required" prompt, which --yes does not.
  const items = ["button", "dialog", "alert-dialog", "select", "toast", "progress", "combobox", "command", "date-picker", "data-table", "tabs", "pagination", "phone-input", "dashboard-template", "list-page-template", "detail-page-template"].map((n) => `${site}/r/svelte/${n}.json`)
  sh("npx", ["--yes", "shadcn-svelte@1.8.0", "add", ...items, "--yes", "--overwrite"], { cwd: app, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, COMPONENTS_REGISTRY_URL: `${site}/r/svelte` } })
  log(`shadcn-svelte add ${items.length} items: OK`)
  const css = readFileSync(path.join(app, "src/app.css"), "utf8")
  if (!/--glob-primary/.test(css)) throw new Error("app.css is missing the GlobUI tokens from the theme item")
  if (!/@keyframes glob-indeterminate/.test(css)) throw new Error("app.css is missing @keyframes glob-indeterminate from the theme item")
  log("theme tokens and keyframes in app.css: OK")
  for (const file of ["src/lib/components/ui/glob-ui/button/Button.svelte", "src/lib/components/ui/glob-ui/shared/context.ts", "src/lib/glob-ui/utils.ts", "src/lib/glob-ui/core/index.ts", "src/lib/glob-ui/recipes/index.ts", "src/lib/components/templates/dashboard/DashboardTemplate.svelte"]) {
    if (!existsSync(path.join(app, file))) throw new Error(`${file} was not copied`)
  }
  const dashboard = readFileSync(path.join(app, "src/lib/components/templates/dashboard/DashboardTemplate.svelte"), "utf8")
  if (!dashboard.includes('from "$lib/components/ui/glob-ui/app-shell-layout/index"')) throw new Error("the template imports were not rewritten to the ui alias")
  log("files and import aliases: OK")

  // 4. A page that uses them, then svelte-check and vite build.
  write(
    "src/App.svelte",
    `<script lang="ts">
  import { Button } from "$lib/components/ui/glob-ui/button"
  import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "$lib/components/ui/glob-ui/dialog"
  import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
  } from "$lib/components/ui/glob-ui/alert-dialog"
  import { Select } from "$lib/components/ui/glob-ui/select"
  import { Toaster, toast } from "$lib/components/ui/glob-ui/toast"
  import { Progress } from "$lib/components/ui/glob-ui/progress"
  import { Combobox } from "$lib/components/ui/glob-ui/combobox"
  import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "$lib/components/ui/glob-ui/command"
  import { DatePicker } from "$lib/components/ui/glob-ui/date-picker"
  import { DataTable, createDataTableColumnHelper } from "$lib/components/ui/glob-ui/data-table"
  import { Tabs, TabsList, TabsTrigger, TabsContent } from "$lib/components/ui/glob-ui/tabs"
  import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "$lib/components/ui/glob-ui/pagination"
  import { PhoneInput } from "$lib/components/ui/glob-ui/phone-input"
  import DashboardTemplate from "$lib/components/templates/dashboard/DashboardTemplate.svelte"
  import ListPageTemplate from "$lib/components/templates/list-page/ListPageTemplate.svelte"
  import DetailPageTemplate from "$lib/components/templates/detail-page/DetailPageTemplate.svelte"

  type Row = { id: string; name: string; amount: number }
  const helper = createDataTableColumnHelper<Row>()
  const columns = [helper.accessor("name", { header: "Name" }), helper.accessor("amount", { header: "Amount" })]
  const rows: Row[] = Array.from({ length: 6 }, (_, i) => ({ id: "r" + i, name: "Item " + i, amount: i * 10 }))
  let plan = $state("pro")
  let page = $state("dashboard")
</script>

{#if page === "dashboard"}
  <DashboardTemplate title="Orders" activeHref="/orders">
    <Button onclick={() => (page = "list")}>Lists</Button>
    <Dialog>
      <DialogTrigger>
        {#snippet child(props)}<Button variant="outline" {...props}>Open dialog</Button>{/snippet}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Consumer dialog</DialogTitle>
        <DialogDescription>Installed with the shadcn-svelte CLI.</DialogDescription>
      </DialogContent>
    </Dialog>
    <AlertDialog>
      <AlertDialogTrigger>Delete</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Delete the item?</AlertDialogTitle>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="danger">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <Select aria-label="Plan" options={[{ value: "free", label: "Free" }, { value: "pro", label: "Pro" }]} bind:value={plan} />
    <Combobox aria-label="Framework" options={[{ value: "svelte", label: "Svelte" }]} />
    <Command>
      <CommandInput placeholder="Search" />
      <CommandList><CommandItem value="Canción">Canción</CommandItem></CommandList>
      <CommandEmpty />
    </Command>
    <DatePicker aria-label="Due date" defaultValue="2026-11-09" name="due" />
    <Progress aria-label="Loading" value={40} />
    <PhoneInput aria-label="Phone" />
    <Tabs defaultValue="a">
      <TabsList aria-label="Tabs"><TabsTrigger value="a">A</TabsTrigger><TabsTrigger value="b">B</TabsTrigger></TabsList>
      <TabsContent value="a">Panel A</TabsContent>
      <TabsContent value="b">Panel B</TabsContent>
    </Tabs>
    <Pagination>
      <PaginationContent><PaginationItem><PaginationLink href="?page=1" isActive>1</PaginationLink></PaginationItem></PaginationContent>
    </Pagination>
    <Button onclick={() => toast.success("Saved from a consumer app")}>Toast</Button>
  </DashboardTemplate>
{:else if page === "list"}
  <ListPageTemplate title="Items" {columns} data={rows} aria-label="Items" getRowId={(row) => row.id} />
{:else}
  <DetailPageTemplate title="Item 1" backHref="#items">
    {#snippet aside()}<p>Paid</p>{/snippet}
    <DataTable aria-label="Demo table" {columns} data={rows} sorting globalFilter pagination pageSize={3} />
  </DetailPageTemplate>
{/if}
<Toaster />
`
  )
  sh("npm", ["run", "check"], { cwd: app })
  log("svelte-check of the consumer: OK")
  sh("npm", ["run", "build"], { cwd: app })
  log("vite build of the consumer: OK")
} finally {
  stop()
  if (!process.env.SMOKE_DIR) rmSync(work, { recursive: true, force: true })
}
console.log("[shadcn-svelte-e2e] OK")
