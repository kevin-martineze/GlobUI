// Asserts that built client packages start with "use client" and server packages do not.
// Run after `pnpm build:packages`. Exits 1 with a list of mismatches.
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../packages/", import.meta.url))

// Packages that must stay server-safe (no banner).
const SERVER = ["alert", "all", "badge", "button", "card", "core", "field", "input", "label", "page-layout", "pagination", "progress", "recipes", "separator", "skeleton", "slot", "spinner", "table", "textarea", "utils"]

// toast is split: index (toast(), server-safe) vs toaster (client).
const CHECKS = []
for (const dir of readdirSync(root)) {
  const dist = join(root, dir, "dist")
  if (!existsSync(dist) || dir === "styles") continue
  if (dir === "toast") {
    CHECKS.push({ name: "toast (index)", file: join(dist, "index.mjs"), client: false })
    CHECKS.push({ name: "toast (toaster)", file: join(dist, "toaster.mjs"), client: true })
    continue
  }
  CHECKS.push({ name: dir, file: join(dist, "index.mjs"), client: !SERVER.includes(dir) })
}

function firstStatement(file) {
  const lines = readFileSync(file, "utf8").split("\n")
  return lines.find((line) => line.trim() !== "") ?? ""
}

const failures = []
for (const check of CHECKS) {
  if (!existsSync(check.file)) {
    failures.push(`${check.name}: missing ${check.file}`)
    continue
  }
  const hasDirective = /^\s*["']use client["'];?\s*$/.test(firstStatement(check.file))
  if (hasDirective !== check.client) {
    failures.push(`${check.name}: expected ${check.client ? "" : "no "}"use client", found ${hasDirective ? "it" : "none"}`)
  }
}

if (failures.length) {
  console.error("Client directive check failed:\n  " + failures.join("\n  "))
  process.exit(1)
}
console.log(`Client directives OK (${CHECKS.length} outputs checked).`)
