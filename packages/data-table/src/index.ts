export { DataTable, dataTableFeatures, createDataTableColumnHelper } from "./data-table"
export type { DataTableProps, DataTableState, DataTableColumn, DataTableFeatures, ColumnDef } from "./data-table"
// The state shapes, re-exported so consumers do not import TanStack directly.
export type { SortingState, PaginationState, RowSelectionState, ColumnVisibilityState } from "@tanstack/react-table"
