import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import svelte from "eslint-plugin-svelte";
import vue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Svelte and Vue single-file components: the framework rules, and TypeScript in <script lang="ts">. Svelte modules
  // that use runes (*.svelte.ts) go through the Svelte parser too, so they need the TypeScript parser as well.
  ...svelte.configs["flat/recommended"],
  ...vue.configs["flat/recommended"],
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  // The Angular package: the Angular rules for components, directives and their templates.
  ...angular.configs.tsRecommended.map((config) => ({ ...config, files: ["packages/angular/**/*.ts", "tests/contracts/angular/**/*.ts"] })),
  {
    files: ["packages/angular/**/*.ts"],
    rules: {
      // `class` is the one allowed alias: consumers write `class="..."` as on any element, and the part merges it after
      // its base classes with cn(), like `className` in React. The signal itself is named `userClass`.
      "@angular-eslint/no-input-rename": ["error", { allowedNames: ["class"] }],
    },
  },
  {
    files: ["**/*.vue"],
    rules: {
      // Component names match the React API (Dialog, Sheet, ...). Renaming them to two words would change the public API.
      "vue/multi-word-component-names": "off",
      // Line breaks inside the templates are left to the author, as in the rest of the repo (no Prettier here).
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/multiline-html-element-content-newline": "off",
    },
  },
  {
    settings: {
      // Monorepo: tell @next/eslint-plugin-next where the Next app lives.
      next: {
        rootDir: "apps/docs/",
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
    // svelte-package writes its intermediate output here.
    "**/.svelte-kit/**",
    "**/node_modules/**",
    "**/next-env.d.ts",
    // Fumadocs writes these files from source.config.ts; they are not hand-written.
    "**/.source/**",
  ]),
]);

export default eslintConfig;
