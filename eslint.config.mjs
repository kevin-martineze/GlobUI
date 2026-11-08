import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    settings: {
      // Monorepo: tell @next/eslint-plugin-next where the Next app lives.
      next: {
        rootDir: "apps/showcase/",
      },
      // The root has no react package, so "detect" cannot resolve it.
      react: {
        version: "19.2",
      },
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/dist/**",
    "**/node_modules/**",
    "**/next-env.d.ts",
  ]),
]);

export default eslintConfig;
