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
  external: ["react", "@glob-ui/label", "@glob-ui/utils"],
  splitting: false,
})
