import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"

/**
 * The GlobUI version and the number of public packages, read from packages/ when the page is built. The home page
 * never hard-codes them, so they cannot drift. Private packages (the templates workspace is not in packages/) are skipped.
 */
export function packageStats(): { version: string; count: number } {
  const packagesDir = path.resolve(process.cwd(), "../../packages")
  let count = 0
  let version = ""
  for (const dir of readdirSync(packagesDir).sort()) {
    const manifest = path.join(packagesDir, dir, "package.json")
    if (!existsSync(manifest)) continue
    const pkg = JSON.parse(readFileSync(manifest, "utf8")) as { name?: string; version?: string; private?: boolean }
    if (pkg.private || !pkg.name?.startsWith("@glob-ui/")) continue
    count++
    // The `all` package is the bundle of every component, so its version is the library's version.
    if (dir === "all" && pkg.version) version = pkg.version
  }
  if (!version) throw new Error("packageStats: packages/all/package.json has no version")
  return { version, count }
}
