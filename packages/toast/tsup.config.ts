import { defineConfig, type Options } from "tsup"

// Three output files: index and store are server-safe, toaster is a client module.
// Imports between them stay as relative imports so the "use client" boundary survives
// and the store module is a single instance shared by toast() and the Toaster.
type Plugin = NonNullable<Options["esbuildPlugins"]>[number]

const localModules: Plugin = {
  name: "local-modules",
  setup(build) {
    const ext = build.initialOptions.format === "esm" ? ".mjs" : ".js"
    build.onResolve({ filter: /^\.\/(store|toaster)$/ }, (args) =>
      args.kind === "entry-point" ? undefined : { path: args.path + ext, external: true }
    )
  },
}

const shared: Options = {
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
  external: ["react", "react-dom", "@glob-ui/alert", "@glob-ui/utils"],
  splitting: false,
  esbuildPlugins: [localModules],
}

export default defineConfig([
  // The two configs run in parallel, so each one cleans only its own files.
  { ...shared, entry: { index: "src/index.ts", store: "src/store.ts" }, clean: ["index.*", "store.*"] },
  {
    ...shared,
    entry: { toaster: "src/toaster.tsx" },
    clean: ["toaster.*"],
    // No banner: toaster.tsx is the entry, and esbuild keeps an entry's own "use client".
  },
])
