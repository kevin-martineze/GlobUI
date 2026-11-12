import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

const here = fileURLToPath(new URL(".", import.meta.url))
const format = (process.env.GLOB_FORMAT === "cjs" ? "cjs" : "es") as "es" | "cjs"
// One entry per subpath (dialog, sheet, ...). preserveModules keeps one file per module, so a consumer
// that imports one subpath bundles only that family.
const families = ["dialog", "sheet", "layout", "app-shell-layout", "page-layout", "stacked-layout"]

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "dist",
    // One run per module format (see the build script): the ESM run clears dist, the CJS run adds to it.
    emptyOutDir: format === "es",
    sourcemap: true,
    target: "es2020",
    lib: {
      entry: Object.fromEntries(families.map((family) => [`${family}/index`, resolve(here, `src/${family}/index.ts`)])),
      formats: [format],
    },
    rollupOptions: {
      external: [/^vue($|\/)/, /^@glob-ui\//, "class-variance-authority"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: format === "cjs" ? "[name].cjs" : "[name].js",
      },
    },
  },
})
