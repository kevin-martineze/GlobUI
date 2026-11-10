// Validates every publishable @glob-ui/* package: publint and @arethetypeswrong (attw) on the
// packed tarball, plus the release metadata. Run after `pnpm build:packages`.
// Exits 1 on any problem. There are no exceptions: a rule that cannot pass needs a written reason here.
import { spawnSync } from "node:child_process"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const packagesDir = path.join(root, "packages")
const license = readFileSync(path.join(root, "LICENSE"), "utf8")
const problems = []
const checked = []

for (const dir of readdirSync(packagesDir)) {
  const pkgDir = path.join(packagesDir, dir)
  const manifestPath = path.join(pkgDir, "package.json")
  if (!existsSync(manifestPath)) continue
  const pkg = JSON.parse(readFileSync(manifestPath, "utf8"))
  const label = pkg.name
  checked.push(label)

  // Release metadata.
  if (pkg.private) problems.push(`${label}: still private`)
  if (pkg.license !== "MIT") problems.push(`${label}: license must be MIT`)
  if (pkg.publishConfig?.access !== "public") problems.push(`${label}: publishConfig.access must be public`)
  if (pkg.publishConfig?.provenance !== true) problems.push(`${label}: publishConfig.provenance must be true`)
  if (!pkg.repository?.url?.includes("kevin-martineze/GlobUI")) problems.push(`${label}: repository.url missing`)
  if (!pkg.description) problems.push(`${label}: description missing`)
  if (!pkg.exports?.["./package.json"]) problems.push(`${label}: exports must include ./package.json`)
  if (pkg.sideEffects === undefined) problems.push(`${label}: sideEffects missing`)
  if (!pkg.files?.includes("LICENSE") || !pkg.files?.includes("README.md")) problems.push(`${label}: files must include LICENSE and README.md`)
  const copy = path.join(pkgDir, "LICENSE")
  if (!existsSync(copy) || readFileSync(copy, "utf8") !== license) problems.push(`${label}: LICENSE copy missing or out of date (run pnpm sync:packages)`)
  if (!existsSync(path.join(pkgDir, "README.md"))) problems.push(`${label}: README.md missing (run pnpm sync:packages)`)

  // Built output and tarball rules, for packages with JavaScript.
  if (existsSync(path.join(pkgDir, "dist"))) {
    const publint = spawnSync("pnpm", ["exec", "publint", pkgDir, "--strict"], { cwd: root, encoding: "utf8" })
    if (publint.status !== 0) problems.push(`${label}: publint\n${publint.stdout}${publint.stderr}`)

    const attw = spawnSync("pnpm", ["exec", "attw", "--pack", pkgDir], { cwd: root, encoding: "utf8" })
    const out = (attw.stdout ?? "") + (attw.stderr ?? "")
    if (attw.status !== 0 || !out.includes("No problems found")) problems.push(`${label}: attw\n${out}`)
  }
}

console.log(`checked ${checked.length} packages: ${checked.join(", ")}`)
if (problems.length) {
  console.error("Package check failed:\n" + problems.map((p) => "  - " + p).join("\n"))
  process.exit(1)
}
console.log("Package check OK (publint --strict, attw, metadata).")
