# @glob-ui/accordion

## 0.4.0

### Patch Changes

- 50e2d63: Adds the navigation components to `@glob-ui/svelte`: Tabs, Accordion and Pagination, at `@glob-ui/svelte/tabs`, `@glob-ui/svelte/accordion` and `@glob-ui/svelte/pagination`. `getPageRange` moved into `@glob-ui/core`, so every framework computes the same pages; `@glob-ui/pagination` still exports it. The class strings these components share moved into `@glob-ui/recipes`. The rendered classes are unchanged in React.
- Updated dependencies [ca8bcbf]
- Updated dependencies [83a6e1a]
- Updated dependencies [78e6f6e]
- Updated dependencies [5a81367]
- Updated dependencies [50e2d63]
- Updated dependencies [bc61015]
  - @glob-ui/hooks@0.4.0
  - @glob-ui/recipes@0.4.0
  - @glob-ui/utils@0.4.0

## 0.3.0

### Minor Changes

- 6ad662b: The primary colour is now teal (`#33CFA8`), replacing orange. Text and lines in the primary colour use the new `--glob-primary-text` token, which is darker in light mode so it passes 4.5:1 on white.
- 355a3d2: Add layouts (AppShell, Page, Stacked) and the first templates

### Patch Changes

- Updated dependencies [355a3d2]
  - @glob-ui/hooks@0.3.0
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
  - @glob-ui/hooks@0.2.0
  - @glob-ui/utils@0.2.0
