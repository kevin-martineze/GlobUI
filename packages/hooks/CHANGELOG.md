# @glob-ui/hooks

## 0.4.0

### Minor Changes

- ca8bcbf: Internal refactor for multi-framework support (phase 10a). The behaviour of the components moved into the new framework-free `@glob-ui/core` package (focus, keyboard, floating positioning, scroll lock, layout scroll, typeahead, calendar and locale helpers, text matching, toast store, country data). The `cva` variants and shared class strings moved into the new `@glob-ui/recipes` package. The React components keep their exports and behaviour: no public API change and no visual change.

### Patch Changes

- Updated dependencies [ca8bcbf]
- Updated dependencies [7ff18f7]
- Updated dependencies [50e2d63]
- Updated dependencies [bc61015]
  - @glob-ui/core@0.4.0

## 0.3.0

### Minor Changes

- 355a3d2: Add layouts (AppShell, Page, Stacked) and the first templates

## 0.2.0

### Minor Changes

- f55ac33: Add Sheet, AlertDialog, Separator, Progress, Slider and Toggle/ToggleGroup
- d706a00: Add Combobox and Command (command palette)
- b5a84ba: Add Calendar and DatePicker (single and range)
- 88a9743: Add Table, Pagination and DataTable
