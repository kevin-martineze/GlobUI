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
  external: [
    "react", "react-dom",
    "@glob-ui/utils",
    "@glob-ui/button",
    "@glob-ui/input",
    "@glob-ui/select",
    "@glob-ui/multi-select",
    "@glob-ui/segmented",
    "@glob-ui/phone-input",
    "@glob-ui/label",
    "@glob-ui/textarea",
    "@glob-ui/checkbox",
    "@glob-ui/radio-group",
    "@glob-ui/switch",
    "@glob-ui/field",
  ],
  splitting: false,
})
