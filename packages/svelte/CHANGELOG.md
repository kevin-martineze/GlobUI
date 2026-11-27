# @glob-ui/svelte

## 0.4.0

### Minor Changes

- 7ff18f7: Introduces `@glob-ui/svelte` (Svelte 5) and `@glob-ui/vue` (Vue 3.5+): the Dialog and Sheet families, the layout primitives (`LayoutSlot`, `SkipLink`, `LayoutNavTrigger`, `LayoutMobileNav`, `useLayoutScroll`), `AppShellLayout`, `PageLayout` with `PageHeader`, and `StackedLayout`. Each has one subpath per component family, for example `@glob-ui/svelte/dialog` and `@glob-ui/vue/sheet`. Behaviour matches the React packages, and the contract tests pass in all three frameworks. `@glob-ui/core` gains `createModal`, the modal behaviour (native `<dialog>`, scroll lock, Escape, backdrop, focus return) shared by the Svelte and Vue adapters.
- 83a6e1a: Introduces `@glob-ui/angular` (Angular 21 and 22, standalone components and signals): the Dialog and Sheet families, the layout primitives, `AppShellLayout`, `PageLayout` with `PageHeader`, and `StackedLayout`. Each family is a secondary entry point, for example `@glob-ui/angular/dialog`. The class strings shared by the layouts and dialogs moved into `@glob-ui/recipes`. The rendered classes are unchanged in React, Svelte and Vue.
- 78e6f6e: Adds the form and primitive components to `@glob-ui/svelte`: Button, Badge, Label, Input, Textarea, Field, Checkbox, Switch, RadioGroup, Separator, Spinner, Skeleton, Card, Alert, Avatar with AvatarGroup, Progress, Slider, Toggle with ToggleGroup, and Segmented. Each family is a subpath, for example `@glob-ui/svelte/field`. The class strings these components share moved into `@glob-ui/recipes`. The rendered classes are unchanged in React.
- 5a81367: Adds the overlays to `@glob-ui/svelte`: Popover, Tooltip, DropdownMenu, AlertDialog, Toast (`Toaster` and `toast()`), Select, Combobox, MultiSelect and Command with CommandDialog. Each family is a subpath, for example `@glob-ui/svelte/select`. The class strings these components share moved into `@glob-ui/recipes`. The rendered classes are unchanged in React.
- 50e2d63: Adds the navigation components to `@glob-ui/svelte`: Tabs, Accordion and Pagination, at `@glob-ui/svelte/tabs`, `@glob-ui/svelte/accordion` and `@glob-ui/svelte/pagination`. `getPageRange` moved into `@glob-ui/core`, so every framework computes the same pages; `@glob-ui/pagination` still exports it. The class strings these components share moved into `@glob-ui/recipes`. The rendered classes are unchanged in React.
- bc61015: Adds the data and date components to `@glob-ui/svelte`: Table, DataTable (on `@tanstack/svelte-table`), Calendar, DatePicker and PhoneInput, each at its own subpath. The calendar grid helpers (`buildCalendarWeeks`, `calendarKeyTarget`, `monthKey`, `shiftMonth`, `startOfWeek`) and `formatDateValue` moved into `@glob-ui/core`, so every framework builds the same months. The class strings these components share moved into `@glob-ui/recipes`. The rendered classes are unchanged in React.

### Patch Changes

- 4689058: `PageHeader` takes a snippet as `title` without a type error (its `title` prop replaces the HTML attribute), and `@glob-ui/svelte/data-table` exports the `RowData` type for generic components built on DataTable. The Svelte versions of the Dashboard, List page and Detail page templates use both.
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
