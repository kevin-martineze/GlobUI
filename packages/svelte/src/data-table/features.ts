// The TanStack features and column types of DataTable, shared with the React package's API.
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  type ColumnDef,
  type PaginationState,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/svelte-table"

/** The TanStack features this table uses. Each one is registered once, here. */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  // Row models: the pipeline that applies sorting, filtering and pagination. Without them the features are only state.
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
})

export type DataTableFeatures = typeof dataTableFeatures

/** A column definition for DataTable. Build them with `createDataTableColumnHelper`. */
// The value type is left open: accessor columns return typed values (string, number), and a fixed `unknown` makes them incompatible.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>

/** The column helper for a row type: `helper.accessor("name", { header: "Name" })`, `helper.display({...})`. */
export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>()
}

export interface DataTableState {
  sorting?: SortingState
  pagination?: PaginationState
  globalFilter?: string
  rowSelection?: RowSelectionState
}

/** An array Svelte leaves as is in deep $state (it only proxies plain objects and arrays). See DataTable.svelte. */
export class StableArray<T> extends Array<T> {}
