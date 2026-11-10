import { existsSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"
import { playwright } from "@vitest/browser-playwright"
import tailwindcss from "@tailwindcss/vite"

// Tests import package sources, not dist, so no build is needed first.
// `@glob-ui/<pkg>` -> `packages/<pkg>/src/index.ts` for every package with an index.
const packagesDir = fileURLToPath(new URL("./packages", import.meta.url))
const alias = readdirSync(packagesDir)
  .filter((dir) => existsSync(join(packagesDir, dir, "src/index.ts")))
  .map((dir) => ({
    find: new RegExp(`^@glob-ui/${dir}$`),
    replacement: join(packagesDir, dir, "src/index.ts"),
  }))

// Automatic JSX runtime: the root tsconfig uses "react-jsx", but Next's own tsconfig uses "preserve".
const oxc = { jsx: { runtime: "automatic" as const } }

export default defineConfig({
  test: {
    projects: [
      {
        oxc,
        resolve: { alias },
        test: {
          name: "unit",
          environment: "node",
          include: ["packages/*/src/**/*.test.ts", "packages/*/src/**/*.ssr.test.tsx"],
        },
      },
      {
        oxc,
        plugins: [tailwindcss()],
        resolve: { alias },
        test: {
          name: "browser",
          include: ["packages/*/src/**/*.browser.test.tsx", "templates/*/*.browser.test.tsx"],
          setupFiles: ["tests/browser/setup.ts"],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
})
