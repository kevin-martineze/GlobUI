---
"@glob-ui/svelte": patch
---

`PageHeader` takes a snippet as `title` without a type error (its `title` prop replaces the HTML attribute), and `@glob-ui/svelte/data-table` exports the `RowData` type for generic components built on DataTable. The Svelte versions of the Dashboard, List page and Detail page templates use both.
