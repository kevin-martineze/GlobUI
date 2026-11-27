# @glob-ui/sheet

## 0.4.0

### Minor Changes

- ca8bcbf: Internal refactor for multi-framework support (phase 10a). The behaviour of the components moved into the new framework-free `@glob-ui/core` package (focus, keyboard, floating positioning, scroll lock, layout scroll, typeahead, calendar and locale helpers, text matching, toast store, country data). The `cva` variants and shared class strings moved into the new `@glob-ui/recipes` package. The React components keep their exports and behaviour: no public API change and no visual change.
- 83a6e1a: Introduces `@glob-ui/angular` (Angular 21 and 22, standalone components and signals): the Dialog and Sheet families, the layout primitives, `AppShellLayout`, `PageLayout` with `PageHeader`, and `StackedLayout`. Each family is a secondary entry point, for example `@glob-ui/angular/dialog`. The class strings shared by the layouts and dialogs moved into `@glob-ui/recipes`. The rendered classes are unchanged in React, Svelte and Vue.

### Patch Changes

- Updated dependencies [ca8bcbf]
- Updated dependencies [83a6e1a]
- Updated dependencies [78e6f6e]
- Updated dependencies [5a81367]
- Updated dependencies [50e2d63]
- Updated dependencies [bc61015]
  - @glob-ui/dialog@0.4.0
  - @glob-ui/recipes@0.4.0
  - @glob-ui/utils@0.4.0

## 0.3.0

### Minor Changes

- 355a3d2: Add layouts (AppShell, Page, Stacked) and the first templates

### Patch Changes

- Updated dependencies [355a3d2]
  - @glob-ui/dialog@0.3.0
  - @glob-ui/utils@0.3.0

## 0.2.0

### Minor Changes

- f55ac33: Add Sheet, AlertDialog, Separator, Progress, Slider and Toggle/ToggleGroup
- d706a00: Add Combobox and Command (command palette)
- b5a84ba: Add Calendar and DatePicker (single and range)
- 88a9743: Add Table, Pagination and DataTable

### Patch Changes

- Updated dependencies [f55ac33]
- Updated dependencies [d706a00]
- Updated dependencies [b5a84ba]
- Updated dependencies [88a9743]
  - @glob-ui/dialog@0.2.0
  - @glob-ui/utils@0.2.0
