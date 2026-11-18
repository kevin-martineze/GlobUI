export { default as DataTable } from "./DataTable.svelte"
export { dataTableFeatures, createDataTableColumnHelper } from "./features"
export type { DataTableColumn, DataTableFeatures, DataTableState } from "./features"
// Cells and headers render strings, or a component or snippet through these helpers.
export { renderComponent, renderSnippet } from "@tanstack/svelte-table"
// The state shapes, re-exported so consumers do not import TanStack directly.
export type { ColumnDef, RowData, SortingState, PaginationState, RowSelectionState, ColumnVisibilityState } from "@tanstack/svelte-table"
