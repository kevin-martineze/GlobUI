# @glob-ui/vue

## 0.4.0

### Minor Changes

- 7ff18f7: Introduces `@glob-ui/svelte` (Svelte 5) and `@glob-ui/vue` (Vue 3.5+): the Dialog and Sheet families, the layout primitives (`LayoutSlot`, `SkipLink`, `LayoutNavTrigger`, `LayoutMobileNav`, `useLayoutScroll`), `AppShellLayout`, `PageLayout` with `PageHeader`, and `StackedLayout`. Each has one subpath per component family, for example `@glob-ui/svelte/dialog` and `@glob-ui/vue/sheet`. Behaviour matches the React packages, and the contract tests pass in all three frameworks. `@glob-ui/core` gains `createModal`, the modal behaviour (native `<dialog>`, scroll lock, Escape, backdrop, focus return) shared by the Svelte and Vue adapters.
- 83a6e1a: Introduces `@glob-ui/angular` (Angular 21 and 22, standalone components and signals): the Dialog and Sheet families, the layout primitives, `AppShellLayout`, `PageLayout` with `PageHeader`, and `StackedLayout`. Each family is a secondary entry point, for example `@glob-ui/angular/dialog`. The class strings shared by the layouts and dialogs moved into `@glob-ui/recipes`. The rendered classes are unchanged in React, Svelte and Vue.

### Patch Changes

- Updated dependencies [ca8bcbf]
- Updated dependencies [7ff18f7]
- Updated dependencies [83a6e1a]
- Updated dependencies [78e6f6e]
- Updated dependencies [5a81367]
- Updated dependencies [50e2d63]
- Updated dependencies [bc61015]
  - @glob-ui/core@0.4.0
  - @glob-ui/recipes@0.4.0
  - @glob-ui/utils@0.4.0
