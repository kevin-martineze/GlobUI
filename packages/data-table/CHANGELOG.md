# @glob-ui/data-table

## 0.4.0

### Minor Changes

- ca8bcbf: Internal refactor for multi-framework support (phase 10a). The behaviour of the components moved into the new framework-free `@glob-ui/core` package (focus, keyboard, floating positioning, scroll lock, layout scroll, typeahead, calendar and locale helpers, text matching, toast store, country data). The `cva` variants and shared class strings moved into the new `@glob-ui/recipes` package. The React components keep their exports and behaviour: no public API change and no visual change.

### Patch Changes

- bc61015: Adds the data and date components to `@glob-ui/svelte`: Table, DataTable (on `@tanstack/svelte-table`), Calendar, DatePicker and PhoneInput, each at its own subpath. The calendar grid helpers (`buildCalendarWeeks`, `calendarKeyTarget`, `monthKey`, `shiftMonth`, `startOfWeek`) and `formatDateValue` moved into `@glob-ui/core`, so every framework builds the same months. The class strings these components share moved into `@glob-ui/recipes`. The rendered classes are unchanged in React.
- Updated dependencies [ca8bcbf]
- Updated dependencies [7ff18f7]
- Updated dependencies [83a6e1a]
- Updated dependencies [78e6f6e]
- Updated dependencies [5a81367]
- Updated dependencies [50e2d63]
- Updated dependencies [bc61015]
  - @glob-ui/button@0.4.0
  - @glob-ui/checkbox@0.4.0
  - @glob-ui/core@0.4.0
  - @glob-ui/dropdown-menu@0.4.0
  - @glob-ui/hooks@0.4.0
  - @glob-ui/input@0.4.0
  - @glob-ui/recipes@0.4.0
  - @glob-ui/select@0.4.0
  - @glob-ui/utils@0.4.0
  - @glob-ui/skeleton@0.4.0
  - @glob-ui/table@0.4.0

## 0.3.0

### Minor Changes

- 355a3d2: Add layouts (AppShell, Page, Stacked) and the first templates

### Patch Changes

- Updated dependencies [6ad662b]
- Updated dependencies [355a3d2]
  - @glob-ui/button@0.3.0
  - @glob-ui/checkbox@0.3.0
  - @glob-ui/dropdown-menu@0.3.0
  - @glob-ui/hooks@0.3.0
  - @glob-ui/input@0.3.0
  - @glob-ui/select@0.3.0
  - @glob-ui/skeleton@0.3.0
  - @glob-ui/table@0.3.0
  - @glob-ui/utils@0.3.0

## 0.2.0

### Minor Changes

- 88a9743: Add Table, Pagination and DataTable

### Patch Changes

- Updated dependencies [f55ac33]
- Updated dependencies [d706a00]
- Updated dependencies [b5a84ba]
- Updated dependencies [88a9743]
  - @glob-ui/button@0.2.0
  - @glob-ui/checkbox@0.2.0
  - @glob-ui/dropdown-menu@0.2.0
  - @glob-ui/hooks@0.2.0
  - @glob-ui/input@0.2.0
  - @glob-ui/select@0.2.0
  - @glob-ui/skeleton@0.2.0
  - @glob-ui/utils@0.2.0
  - @glob-ui/table@0.2.0
