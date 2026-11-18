import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

// The Svelte package mirrors the React packages: `@glob-ui/<pkg>` in React is `@glob-ui/svelte/<pkg>` in Svelte.
// Read from the package source at build time, so the docs cannot list a subpath or a name the package lacks.

const svelteSrc = path.resolve(process.cwd(), "../../packages/svelte/src")

/** The index file of a Svelte subpath, or null when the Svelte package has no such subpath (hooks, slot, utils). */
function svelteIndex(pkg: string) {
  const file = path.join(svelteSrc, pkg, "index.ts")
  return existsSync(file) ? file : null
}

export function hasSvelte(pkg: string) {
  return svelteIndex(pkg) !== null
}

/** The value names a Svelte subpath exports (components and functions), in source order. Types are left out. */
export function svelteExports(pkg: string): string[] {
  const file = svelteIndex(pkg)
  if (!file) return []
  const names: string[] = []
  for (const m of readFileSync(file, "utf8").matchAll(/^export \{([^}]*)\}/gm)) {
    for (const part of m[1].split(",")) {
      const spec = part.trim()
      if (!spec || spec.startsWith("type ")) continue
      names.push(spec.split(/\s+as\s+/).pop()!.trim())
    }
  }
  return names
}
