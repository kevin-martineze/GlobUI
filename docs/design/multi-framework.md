# Multi-framework (Vue, Svelte, Angular)

Status: accepted design (2026-11-12). Phase 10. React stays first-class and its public API does not change.

## Goal

GlobUI components, layouts and templates work in React, Svelte, Vue and Angular, with the same behaviour, the same
accessibility guarantees and the same look. A bug fixed once is fixed in every framework.

## Decision: a framework-agnostic core plus thin adapters

Rejected options:

- **Web Components (Lit, Stencil).** One implementation, but ARIA references across shadow roots, form participation
  and SSR are fragile or broken, and Tailwind classes do not reach into the shadow DOM. This contradicts
  "accessible by default".
- **Hand ports per framework** (the shadcn-vue and shadcn-svelte model). Fast to start, but four copies of every
  behaviour, and every bug is fixed four times.

Chosen: the model of Zag.js and Ark UI, with our own code.

| Layer | Package | Contains | Depends on |
| --- | --- | --- | --- |
| Styles | `@glob-ui/styles` (exists) | Tokens and the Tailwind theme | nothing |
| Recipes | `@glob-ui/recipes` (new) | Every `cva` variant definition and shared class string | `class-variance-authority`, `@glob-ui/utils` |
| Core | `@glob-ui/core` (new) | Behaviour as plain TypeScript over the DOM | `@floating-ui/dom` |
| Adapters | `@glob-ui/<name>` (React, exists), `@glob-ui/svelte`, `@glob-ui/vue`, `@glob-ui/angular` (new) | Components: markup, ARIA attributes, state, wiring to core | core, recipes, the framework |

### Core rules

- Core never imports a framework. It works on `HTMLElement`s and plain values.
- A behaviour is a **controller**: `createX(element, options)` returns `{ update(options), destroy() }`. Every framework
  can call it from its own lifecycle (React effect, Svelte action / `$effect`, Vue `onMounted`, Angular directive).
- Pure logic (date maths, keyboard key maps, typeahead matching, ID generation rules) is plain functions, tested in Node.
- State that the UI renders (open, value, selected) stays in the adapter, because each framework has its own reactivity.
  Core reports changes through callbacks (`onOpenChange`, `onNavigate`).
- Prefer the platform: native `<dialog>`, `popover`, `inert`, form elements. Less code to port.

### Adapter rules

- One npm package per framework, with one subpath export per component: `@glob-ui/svelte/button`,
  `@glob-ui/vue/button`, `@glob-ui/angular/button`. 47 packages × 4 frameworks would be unmanageable.
  React keeps its per-component packages.
- Same component names, prop names, slot names, `data-*` attributes and classes as React. Docs show one API with
  framework tabs.
- Svelte 5 (runes only), packaged with `@sveltejs/package`.
- Vue 3.5+ (`<script setup>`, SFC), built with Vite library mode and `vue-tsc` for types.
- Angular 21+ (standalone components, signals, zoneless-safe), built with `ng-packagr`, one secondary entry point
  per component.
- All packages join the Changesets `fixed` group: one version for everything.

### Tests: one contract, every framework

- Behaviour and accessibility tests are written once per component as a **contract**: a function that receives a
  `render` adapter and runs the assertions against the DOM (roles, keyboard, focus, axe).
- Each framework provides its `render` adapter (`vitest-browser-react`, `vitest-browser-svelte`,
  `vitest-browser-vue`, Angular via `@analogjs/vitest-angular` or TestBed).
- A component is "done" in a framework when its contract passes there.

### Layouts

The scroll contract is already in the DOM (`data-layout`, `data-scroll-mode`, `data-slot`, `data-scroll`).
Core owns `getLayoutScroll(element)`: the nearest `[data-scroll="scroll"]` ancestor, else `document.scrollingElement`.
Every framework's `useLayoutScroll` equivalent calls it. The mobile navigation needs `Sheet`, so `Sheet` is ported
together with the layouts.

### Copy-code (registry)

The shadcn registry stays React-only for now. shadcn-svelte and shadcn-vue have their own registry formats. Decide in
phase 10h, after the npm packages exist.

## Phases

| Phase | Scope | Proof |
| --- | --- | --- |
| 10a | Create `@glob-ui/core` and `@glob-ui/recipes`. Move behaviour out of `@glob-ui/hooks` and the components into core controllers, and `cva` definitions into recipes. React becomes a thin wrapper. Contract test harness. | Every existing React test passes unchanged. No public React API change. |
| 10b | Scaffold `@glob-ui/svelte`, `@glob-ui/vue`. Port Layout primitives, Sheet, AppShell, Page and Stacked layouts. | Layout contracts pass in React, Svelte, Vue. |
| 10c | Scaffold `@glob-ui/angular`. Port the same layouts and Sheet. | Layout contracts pass in Angular. |
| 10d | Svelte components, in batches (forms, overlays, navigation, data). | Contracts pass. |
| 10e | Vue components, same batches. | Contracts pass. |
| 10f | Angular components, same batches. | Contracts pass. |
| 10g | Templates (Dashboard, List page, Detail page) for each framework. Docs: framework switcher on every page and example. | Docs build, check:docs, template contracts. |
| 10h | Copy-code for Svelte and Vue (their registry formats). Release. | E2E install like `scripts/shadcn-e2e.mjs`. |
