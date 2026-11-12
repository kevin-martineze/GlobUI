// After vue-tsc emits the declarations: point the barrel imports of ".vue" modules at ".vue.js" (node16
// resolves a ".js" specifier to its ".d.ts"; a bare ".vue" never resolves), and write a ".d.cts" copy of
// every barrel for CommonJS consumers.
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, copyFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const dist = fileURLToPath(new URL("../dist", import.meta.url))

function walk(dir, visit) {
  for (const entry of readdirSync(dir)) {
    const file = join(dir, entry)
    if (statSync(file).isDirectory()) walk(file, visit)
    else visit(file)
  }
}

walk(dist, (file) => {
  if (!file.endsWith(".d.ts")) return
  const text = readFileSync(file, "utf8")
  // Relative specifiers: a directory gets /index.js, a .vue module gets .js; everything else already has an extension.
  const fixed = text.replace(/from "(\.\.?\/[^"]*)"/g, (match, spec) => {
    const target = join(dirname(file), spec)
    if (spec.endsWith(".js")) return match
    if (existsSync(target) && statSync(target).isDirectory()) return `from "${spec}/index.js"`
    if (spec.endsWith(".vue")) return `from "${spec}.js"`
    // A bare module name (no extension) that resolves to a declaration file: node16 ESM needs the .js.
    if (existsSync(target + ".d.ts")) return `from "${spec}.js"`
    return match
  })
  if (fixed !== text) writeFileSync(file, fixed)
  if (file.endsWith("/index.d.ts")) copyFileSync(file, file.replace(/index\.d\.ts$/, "index.d.cts"))
})
console.log("types finished")
