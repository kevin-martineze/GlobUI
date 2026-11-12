import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: {
    compilerOptions: {
      module: "NodeNext",
      moduleResolution: "NodeNext",
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
    },
  },
  sourcemap: true,
  clean: true,
  external: ["@floating-ui/dom"],
  splitting: false,
})
