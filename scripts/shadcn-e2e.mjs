// End-to-end test of the copy-code registry: serves the docs (dev server) with the registry generated
// for this local address, installs eight items into a fresh Next 16 app with the shadcn CLI in
// non-interactive mode, then runs `next build` on that app.
// Usage: node scripts/shadcn-e2e.mjs   (SMOKE_DIR overrides the work folder, PORT the docs port)
import { spawn, spawnSync } from "node:child_process"
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const docs = path.join(root, "apps/docs")
const port = process.env.PORT ?? "3002"
const site = `http://localhost:${port}`
const work = process.env.SMOKE_DIR ?? mkdtempSync(path.join(os.tmpdir(), "glob-ui-shadcn-"))
const app = path.join(work, "shadcn-app")
mkdirSync(work, { recursive: true })
const log = (m) => console.log(`[shadcn-e2e] ${m}`)
const sh = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, ...opts })
  const out = (r.stdout ?? "") + (r.stderr ?? "")
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed:\n${out}`)
  return out
}

// 1. Registry for this address, then the docs dev server that serves it.
sh("node", ["scripts/build-registry.mjs"], { cwd: docs, env: { ...process.env, NEXT_PUBLIC_SITE_URL: site } })
const server = spawn("pnpm", ["exec", "next", "dev", "-p", port], { cwd: docs, stdio: "ignore", detached: true })
const stop = () => { try { process.kill(-server.pid) } catch {} }
process.on("exit", stop)
try {
  let up = false
  for (let i = 0; i < 90 && !up; i++) {
    up = await fetch(`${site}/r/index.json`).then((r) => r.ok).catch(() => false)
    if (!up) await new Promise((r) => setTimeout(r, 2000))
  }
  if (!up) throw new Error(`docs did not serve ${site}/r/index.json`)
  log(`registry served at ${site}/r`)

  // 2. A fresh consumer app and shadcn init with defaults.
  sh("npx", ["--yes", "create-next-app@16.2.6", app, "--ts", "--app", "--tailwind", "--no-eslint", "--src-dir", "--import-alias", "@/*", "--use-npm", "--yes"], { cwd: work })
  sh("npx", ["--yes", "shadcn@4.23.0", "init", "--defaults", "--yes"], { cwd: app })
  log("shadcn init: OK")

  // 3. Add items from the registry, non-interactively. alert-dialog pulls dialog and button as
  // registry dependencies; progress needs the theme's keyframes; combobox and command
  // need both utils files (cn and the text matching).
  const items = ["button", "dialog", "select", "toast", "alert-dialog", "progress", "combobox", "command"].map((n) => `${site}/r/${n}.json`)
  sh("npx", ["--yes", "shadcn@4.23.0", "add", ...items, "--yes"], { cwd: app })
  log(`shadcn add ${items.length} items: OK`)
  const globals = readFileSync(path.join(app, "src/app/globals.css"), "utf8")
  if (!/@keyframes glob-indeterminate/.test(globals)) throw new Error("globals.css is missing @keyframes glob-indeterminate from the theme item")
  log("theme keyframes in globals.css: OK")

  // 4. A page that uses them (server Button, client Dialog, Select and Toast), then next build.
  writeFileSync(
    path.join(app, "src/app/page.tsx"),
    `import { Button } from "@/components/glob-ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/glob-ui/dialog"
import { Select } from "@/components/glob-ui/select"
import { Toaster } from "@/components/glob-ui/toast"
import { Combobox } from "@/components/glob-ui/combobox"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/glob-ui/command"
import { Progress } from "@/components/glob-ui/progress"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/glob-ui/alert-dialog"
import { ClientPanel } from "./client-panel"

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-6 p-10">
      <Button variant="primary">Server component button</Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Consumer dialog</DialogTitle>
          <DialogDescription>Installed with the shadcn CLI.</DialogDescription>
        </DialogContent>
      </Dialog>
      <Select aria-label="Plain select" options={[{ value: "a", label: "Alpha" }]} defaultValue="a" />
      <Combobox aria-label="Framework" options={[{ value: "next", label: "Next.js" }]} />
      <Command>
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandItem value="Canción">Canción</CommandItem>
        </CommandList>
        <CommandEmpty />
      </Command>
      <Progress aria-label="Server progress" value={40} />
      <Progress aria-label="Loading" />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete the item?</AlertDialogTitle>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="danger">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ClientPanel />
      <Toaster />
    </main>
  )
}
`
  )
  writeFileSync(
    path.join(app, "src/app/client-panel.tsx"),
    `"use client"

import { Button } from "@/components/glob-ui/button"
import { Select } from "@/components/glob-ui/select"
import { toast } from "@/components/glob-ui/toast"

export function ClientPanel() {
  return (
    <div className="flex flex-col gap-3">
      <Select aria-label="Client select" options={[{ value: "mx", label: "Mexico" }]} defaultValue="mx" />
      <Button onClick={() => toast.success("Saved from a consumer app")}>Toast</Button>
    </div>
  )
}
`
  )
  const build = spawnSync("npx", ["next", "build"], { cwd: app, encoding: "utf8", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } })
  if (build.status !== 0) throw new Error("next build of the shadcn consumer failed:\n" + (build.stdout ?? "") + (build.stderr ?? ""))
  log("next build of the shadcn consumer: OK")
  const installed = readFileSync(path.join(app, "components.json"), "utf8")
  log(`components.json aliases: ${JSON.parse(installed).aliases.components}`)
} finally {
  stop()
  if (!process.env.SMOKE_DIR) rmSync(work, { recursive: true, force: true })
}
console.log("[shadcn-e2e] OK")
