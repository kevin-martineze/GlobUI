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
        // Pre-bundle up front: otherwise a cold cache (CI, or after an install) re-optimizes mid-run,
        // Vite reloads the test iframes and whole suites fail to start.
        optimizeDeps: {
          include: [
            "react",
            "react-dom",
            "react-dom/client",
            "react/jsx-runtime",
            "react/jsx-dev-runtime",
            "vitest-browser-react",
            "axe-core",
            "@floating-ui/dom",
            "@tanstack/react-table",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
          ],
        },
        test: {
          name: "browser",
          include: ["packages/*/src/**/*.browser.test.{ts,tsx}", "templates/*/*.browser.test.tsx", "tests/contracts/**/*.browser.test.tsx"],
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
