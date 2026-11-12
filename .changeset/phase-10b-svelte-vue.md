---
"@glob-ui/svelte": minor
"@glob-ui/vue": minor
"@glob-ui/core": minor
---

Introduces `@glob-ui/svelte` (Svelte 5) and `@glob-ui/vue` (Vue 3.5+): the Dialog and Sheet families, the layout primitives (`LayoutSlot`, `SkipLink`, `LayoutNavTrigger`, `LayoutMobileNav`, `useLayoutScroll`), `AppShellLayout`, `PageLayout` with `PageHeader`, and `StackedLayout`. Each has one subpath per component family, for example `@glob-ui/svelte/dialog` and `@glob-ui/vue/sheet`. Behaviour matches the React packages, and the contract tests pass in all three frameworks. `@glob-ui/core` gains `createModal`, the modal behaviour (native `<dialog>`, scroll lock, Escape, backdrop, focus return) shared by the Svelte and Vue adapters.
