import { readFileSync } from "node:fs"
import path from "node:path"

export interface TokenValues {
  name: string
  light: string
  dark: string
}

/**
 * Reads the colour tokens from the one source of truth, packages/styles/glob-ui.css.
 * The light values are in `:root { }`, the dark values in `:root[data-theme="dark"] { }`.
 */
export function readColorTokens(): TokenValues[] {
  const css = readFileSync(path.resolve(process.cwd(), "../../packages/styles/glob-ui.css"), "utf8")
  const light = block(css, /^:root\s*\{/m)
  const dark = block(css, /^:root\[data-theme="dark"\]\s*\{/m)
  const names = [...light.matchAll(/--glob-([a-z-]+):/g)].map((m) => m[1])
  return names
    .filter((name) => !name.startsWith("radius-") && !name.startsWith("shadow-"))
    .map((name) => ({
      name,
      light: value(light, name),
      dark: value(dark, name),
    }))
}

function block(css: string, start: RegExp): string {
  const match = start.exec(css)
  if (!match) throw new Error("token block not found: " + start)
  const open = match.index + match[0].length
  const close = css.indexOf("}", open)
  return css.slice(open, close)
}

function value(text: string, name: string): string {
  const match = new RegExp(`--glob-${name}:\\s*([^;]+);`).exec(text)
  if (!match) throw new Error(`token --glob-${name} missing in its block`)
  return match[1].trim()
}
