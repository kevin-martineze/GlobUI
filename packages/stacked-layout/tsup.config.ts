import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: {
    compilerOptions: {
      module: "NodeNext",
      moduleResolution: "NodeNext",
      jsx: "react-jsx",
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
    },
  },
  sourcemap: true,
  clean: true,
  external: ["@glob-ui/layout", "@glob-ui/utils", "react"],
  splitting: false,
  // esbuild drops module-level directives when bundling; re-add it so RSC treats this as a client module.
  banner: { js: '"use client"' },
})
