// Consumer smoke test: packs every @glob-ui/* package, installs the tarballs into a fresh Next 16
// app outside the repo, follows the Installation page literally, and runs `next build`.
// Usage: node scripts/consumer-smoke.mjs [--keep] (SMOKE_DIR overrides the work folder).
// Needs network access for create-next-app and npm (registry reads only).
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const work = process.env.SMOKE_DIR ?? mkdtempSync(path.join(os.tmpdir(), "glob-ui-consumer-"))
const tarDir = path.join(work, "tarballs")
const app = path.join(work, "next-app")
const log = (msg) => console.log(`[smoke] ${msg}`)
const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...opts })
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed:\n${r.stdout}${r.stderr}`)
  return r.stdout
}

mkdirSync(tarDir, { recursive: true })
log(`work folder: ${work}`)

// 1. Pack every package.
const packagesDir = path.join(root, "packages")
const packages = readdirSync(packagesDir).filter((d) => existsSync(path.join(packagesDir, d, "package.json")))
const tarballs = {}
const sizes = []
for (const dir of packages) {
  const manifest = JSON.parse(readFileSync(path.join(packagesDir, dir, "package.json"), "utf8"))
  run("pnpm", ["pack", "--pack-destination", tarDir], { cwd: path.join(packagesDir, dir) })
  const file = readdirSync(tarDir).find((f) => f.startsWith(manifest.name.replace("@", "").replace("/", "-") + "-") && f.endsWith(".tgz"))
  if (!file) throw new Error(`no tarball for ${manifest.name}`)
  tarballs[manifest.name] = path.join(tarDir, file)
  sizes.push({ name: manifest.name, bytes: statSync(path.join(tarDir, file)).size })
}
log(`packed ${sizes.length} packages`)

// 2. A fresh Next 16 app, created the way a consumer creates one.
run("npx", ["--yes", "create-next-app@16.2.6", app, "--ts", "--app", "--tailwind", "--no-eslint", "--src-dir", "--import-alias", "@/*", "--use-npm", "--yes"], { cwd: work, stdio: "inherit" })

// 3. Install the tarballs. npm overrides make the @glob-ui/* dependencies of each tarball resolve to the local tarballs.
const pkgPath = path.join(app, "package.json")
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
const local = Object.fromEntries(Object.entries(tarballs).map(([name, file]) => [name, `file:${file}`]))
pkg.dependencies = { ...pkg.dependencies, ...local }
pkg.overrides = { ...local }
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n")
run("npm", ["install"], { cwd: app, stdio: "inherit" })

// 4. The Installation page, literally: styles import and the @source line.
writeFileSync(
  path.join(app, "src/app/globals.css"),
  `@import "tailwindcss";
@import "@glob-ui/styles";

@source "../../node_modules/@glob-ui/*/dist/**/*.{js,mjs}";
`
)

// 5. Pages: a Server Component using Button, Card and Field+Input; a client page with Dialog, Select and Toast.
const src = path.join(app, "src/app")
writeFileSync(
  path.join(src, "layout.tsx"),
  `import type { ReactNode } from "react"
import { Toaster } from "@glob-ui/toast"
import "./globals.css"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
`
)
writeFileSync(
  path.join(src, "page.tsx"),
  `import { Button } from "@glob-ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@glob-ui/card"
import { Field } from "@glob-ui/field"
import { Input } from "@glob-ui/input"
import { ClientPanel } from "./client-panel"

// A Server Component: Button, Card, and Field with Input render without "use client".
export default function Page() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Server-rendered card</CardTitle>
        </CardHeader>
        <CardContent>
          <Field label="Email" description="Used for sign-in.">
            <Input type="email" placeholder="you@example.com" />
          </Field>
          <Button className="mt-4" variant="primary">Save</Button>
        </CardContent>
      </Card>
      <ClientPanel />
    </main>
  )
}
`
)
writeFileSync(
  path.join(src, "client-panel.tsx"),
  `"use client"

import { useState } from "react"
import { Button } from "@glob-ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@glob-ui/dialog"
import { Select } from "@glob-ui/select"
import { toast } from "@glob-ui/toast"

export function ClientPanel() {
  const [value, setValue] = useState("mx")
  return (
    <div className="flex flex-col gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Consumer dialog</DialogTitle>
          <DialogDescription>Installed from a tarball.</DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Select aria-label="Country" options={[{ value: "mx", label: "Mexico" }, { value: "co", label: "Colombia" }]} value={value} onChange={setValue} />
      <Button onClick={() => toast.success("Saved", { description: value })}>Toast</Button>
    </div>
  )
}
`
)

// 6. Next build.
const build = spawnSync("npx", ["next", "build"], { cwd: app, encoding: "utf8", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } })
const out = (build.stdout ?? "") + (build.stderr ?? "")
if (build.status !== 0) {
  console.error(out)
  throw new Error("next build of the consumer app failed")
}
log("next build of the consumer app: OK")

console.log("\nTarball sizes:")
for (const s of sizes.sort((a, b) => b.bytes - a.bytes)) console.log(`  ${(s.bytes / 1024).toFixed(1).padStart(7)} KiB  ${s.name}`)
const total = sizes.reduce((n, s) => n + s.bytes, 0)
console.log(`  ${(total / 1024).toFixed(1).padStart(7)} KiB  total (${sizes.length} packages)`)

// 7. The same tarballs in a minimal Vite + React app, with the Tailwind Vite plugin.
const viteApp = path.join(work, "vite-app")
mkdirSync(path.join(viteApp, "src"), { recursive: true })
writeFileSync(
  path.join(viteApp, "package.json"),
  JSON.stringify(
    {
      name: "vite-consumer",
      private: true,
      type: "module",
      scripts: { build: "vite build" },
      dependencies: { react: "19.2.4", "react-dom": "19.2.4", ...local },
      devDependencies: { vite: "^7", "@vitejs/plugin-react": "^5", tailwindcss: "^4", "@tailwindcss/vite": "^4", typescript: "^5", "@types/react": "^19", "@types/react-dom": "^19" },
      overrides: { ...local },
    },
    null,
    2
  ) + "\n"
)
writeFileSync(
  path.join(viteApp, "vite.config.ts"),
  `import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({ plugins: [react(), tailwindcss()] })
`
)
writeFileSync(path.join(viteApp, "index.html"), '<!doctype html><html lang="en"><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n')
writeFileSync(path.join(viteApp, "src/index.css"), '@import "tailwindcss";\n@import "@glob-ui/styles";\n\n@source "../node_modules/@glob-ui/*/dist/**/*.{js,mjs}";\n')
writeFileSync(
  path.join(viteApp, "src/main.tsx"),
  `import { createRoot } from "react-dom/client"
import { Button } from "@glob-ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@glob-ui/dialog"
import { Select } from "@glob-ui/select"
import { Toaster, toast } from "@glob-ui/toast"
import "./index.css"

// Client-only app: every component here has state or handlers.
function App() {
  return (
    <main style={{ display: "flex", flexDirection: "column", gap: 16, padding: 32, maxWidth: 420 }}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Vite dialog</DialogTitle>
          <DialogDescription>Installed from a tarball.</DialogDescription>
        </DialogContent>
      </Dialog>
      <Select aria-label="Country" options={[{ value: "mx", label: "Mexico" }]} defaultValue="mx" />
      <Button onClick={() => toast.success("Saved from Vite")}>Toast</Button>
      <Toaster />
    </main>
  )
}

createRoot(document.getElementById("root")!).render(<App />)
`
)
run("npm", ["install"], { cwd: viteApp, stdio: "inherit" })
const viteBuild = spawnSync("npx", ["vite", "build"], { cwd: viteApp, encoding: "utf8" })
if (viteBuild.status !== 0) {
  console.error((viteBuild.stdout ?? "") + (viteBuild.stderr ?? ""))
  throw new Error("vite build of the consumer app failed")
}
log("vite build of the consumer app: OK")

if (!process.argv.includes("--keep") && !process.env.SMOKE_DIR) {
  // Keep the work folder only when asked, so a failing run can be inspected.
  rmSync(work, { recursive: true, force: true })
}
console.log("\nConsumer smoke (Next): OK")
