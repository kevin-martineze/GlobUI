"use client"

import { useMemo, useState, type ReactNode } from "react"
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
  useTable,
  type ColumnDef,
  type ColumnVisibilityState,
  type PaginationState,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table"
import { cn } from "@glob-ui/utils"
import { matchesSearch } from "@glob-ui/core"
import { useControllableState } from "@glob-ui/hooks"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@glob-ui/table"
import { Button, buttonVariants } from "@glob-ui/button"
import { Checkbox } from "@glob-ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@glob-ui/dropdown-menu"
import { Input } from "@glob-ui/input"
import { Select } from "@glob-ui/select"
import { Skeleton } from "@glob-ui/skeleton"

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

export interface DataTableProps<TData extends RowData> {
  columns: DataTableColumn<TData>[]
  data: TData[]
  /** A stable id per row (for selection). Default: the row index. */
  getRowId?: (row: TData, index: number) => string
  /** Accessible name of the table. Also names its scroll region. */
  "aria-label"?: string
  /** Click to sort (Shift for several columns). Default false. */
  sorting?: boolean
  /** A search field that filters rows (accent-insensitive, every word). Default false. */
  globalFilter?: boolean
  /** Pages of rows with a page-size menu. Default false. */
  pagination?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  /** A checkbox column with select-all. Default false. */
  rowSelection?: boolean
  /** A Columns menu that shows or hides columns. Default false. */
  columnVisibility?: boolean
  /** Controlled state, for example from a URL or a server response. Pair each slice with its change handler. */
  state?: DataTableState
  onSortingChange?: (sorting: SortingState) => void
  onPaginationChange?: (pagination: PaginationState) => void
  onGlobalFilterChange?: (filter: string) => void
  onRowSelectionChange?: (selection: RowSelectionState) => void
  /**
   * Sorting, filtering and pagination happen on the server: the table renders `data` as it is. Pass `rowCount`
   * (the total number of rows) so the page count is right.
   */
  manual?: boolean
  rowCount?: number
  /** Skeleton rows instead of the body, and `aria-busy` on the table. */
  loading?: boolean
  emptyState?: ReactNode
  /** Extra controls next to the search field, for example bulk actions. */
  toolbar?: ReactNode
  /** Row click. The row is not a button: give keyboard users a link or button inside a cell. */
  onRowClick?: (row: TData) => void
  density?: "compact" | "default" | "comfortable"
  striped?: boolean
  stickyHeader?: boolean
  className?: string
  containerClassName?: string
}

const resolve = <T,>(updater: Updater<T>, current: T): T => (typeof updater === "function" ? (updater as (old: T) => T)(current) : updater)

function SortIndicator({ direction }: { direction: false | "asc" | "desc" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn("h-3.5 w-3.5 shrink-0", !direction && "opacity-40")}>
      {direction === "desc" ? <path d="M6 9l6 6 6-6" /> : direction === "asc" ? <path d="M6 15l6-6 6 6" /> : <path d="M7 10l5-5 5 5M7 14l5 5 5-5" />}
    </svg>
  )
}

/**
 * A data table: sorting, filtering, pagination, row selection and column visibility, each opt-in.
 * It keeps its own state unless you pass `state` and the change handlers (server data).
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  getRowId,
  "aria-label": ariaLabel = "Table",
  sorting: sortingEnabled = false,
  globalFilter: filterEnabled = false,
  pagination: paginationEnabled = false,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50],
  rowSelection: selectionEnabled = false,
  columnVisibility: visibilityEnabled = false,
  state,
  onSortingChange,
  onPaginationChange,
  onGlobalFilterChange,
  onRowSelectionChange,
  manual = false,
  rowCount,
  loading = false,
  emptyState = "No results.",
  toolbar,
  onRowClick,
  density = "default",
  striped = false,
  stickyHeader = false,
  className,
  containerClassName,
}: DataTableProps<TData>) {
  const [sortingState, setSortingState] = useControllableState<SortingState>(state?.sorting, [], onSortingChange)
  const [paginationState, setPaginationState] = useControllableState<PaginationState>(
    state?.pagination,
    { pageIndex: 0, pageSize },
    onPaginationChange
  )
  const [filterState, setFilterState] = useControllableState<string>(state?.globalFilter, "", onGlobalFilterChange)
  const [selectionState, setSelectionState] = useControllableState<RowSelectionState>(state?.rowSelection, {}, onRowSelectionChange)
  const [visibilityState, setVisibilityState] = useState<ColumnVisibilityState>({})

  const helper = useMemo(() => createDataTableColumnHelper<TData>(), [])
  const allColumns = useMemo<DataTableColumn<TData>[]>(() => {
    if (!selectionEnabled) return columns
    const select = helper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all rows"
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox aria-label="Select row" checked={row.getIsSelected()} disabled={!row.getCanSelect()} onChange={row.getToggleSelectedHandler()} />
      ),
    })
    return [select as DataTableColumn<TData>, ...columns]
  }, [columns, selectionEnabled, helper])

  // Without pagination, one page holds every row.
  const effectivePagination: PaginationState = paginationEnabled
    ? paginationState
    : { pageIndex: 0, pageSize: Math.max(data.length, 1) }

  const table = useTable({
    features: dataTableFeatures,
    columns: allColumns,
    data,
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
    state: {
      sorting: sortingState,
      pagination: effectivePagination,
      globalFilter: filterEnabled ? filterState : "",
      rowSelection: selectionState,
      columnVisibility: visibilityState,
    },
    onSortingChange: (updater: Updater<SortingState>) => setSortingState(resolve(updater, sortingState)),
    onPaginationChange: (updater: Updater<PaginationState>) => setPaginationState(resolve(updater, paginationState)),
    onGlobalFilterChange: (updater: Updater<string>) => setFilterState(resolve(updater, filterState)),
    onRowSelectionChange: (updater: Updater<RowSelectionState>) => setSelectionState(resolve(updater, selectionState)),
    onColumnVisibilityChange: (updater: Updater<ColumnVisibilityState>) => setVisibilityState(resolve(updater, visibilityState)),
    enableSorting: sortingEnabled,
    enableRowSelection: selectionEnabled,
    enableGlobalFilter: filterEnabled,
    enableHiding: visibilityEnabled,
    manualSorting: manual,
    manualPagination: manual,
    // Accent-insensitive word match over the row's values. In manual mode the server filters, so every row passes.
    globalFilterFn: manual
      ? () => true
      : (row, _columnId, filterValue) => matchesSearch(String(filterValue ?? ""), ...Object.values(row.original as object).map((v) => String(v ?? ""))),
  })

  const rows = table.getRowModel().rows
  const visibleColumnCount = table.getVisibleLeafColumns().length
  const total = manual ? (rowCount ?? data.length) : table.getRowCount()
  const pageSizeNow = effectivePagination.pageSize
  const pageCount = manual ? Math.max(1, Math.ceil(total / pageSizeNow)) : Math.max(1, table.getPageCount())
  const pageIndex = effectivePagination.pageIndex
  const filterActive = filterEnabled && filterState !== ""
  const selectedCount = Object.keys(selectionState).filter((id) => selectionState[id]).length
  const announcement = [
    filterActive ? `${total} ${total === 1 ? "result" : "results"}` : null,
    paginationEnabled && pageCount > 1 ? `Page ${pageIndex + 1} of ${pageCount}` : null,
  ]
    .filter(Boolean)
    .join(". ")

  function goToPage(next: number) {
    setPaginationState({ ...paginationState, pageIndex: Math.min(Math.max(next, 0), pageCount - 1) })
  }

  const showToolbar = filterEnabled || visibilityEnabled || toolbar
  const hideable = visibilityEnabled ? table.getAllLeafColumns().filter((column) => column.getCanHide()) : []

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {showToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {filterEnabled && (
              <Input
                type="search"
                aria-label="Search"
                placeholder="Search..."
                value={filterState}
                onChange={(e) => {
                  setFilterState(e.target.value)
                  if (paginationEnabled) setPaginationState({ ...paginationState, pageIndex: 0 })
                }}
                className="w-full sm:w-64"
              />
            )}
            {toolbar}
          </div>
          {visibilityEnabled && (
            <DropdownMenu>
              {/* The trigger renders its own button, so the button styles go on it directly. */}
              <DropdownMenuTrigger className={buttonVariants({ variant: "outline", size: "sm" })}>Columns</DropdownMenuTrigger>
              <DropdownMenuContent>
                {hideable.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(next) => column.toggleVisibility(next)}
                  >
                    {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      <Table
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        scrollLabel={ariaLabel}
        density={density}
        striped={striped}
        stickyHeader={stickyHeader}
        containerClassName={containerClassName}
      >
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const direction = header.column.getIsSorted()
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={canSort ? (direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none") : undefined}
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-1 rounded-glob-sm font-medium hover:text-glob-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring"
                      >
                        <table.FlexRender header={header} />
                        <SortIndicator direction={direction} />
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: pageSizeNow }, (_, i) => (
              <TableRow key={`skeleton-${i}`} aria-hidden="true">
                {Array.from({ length: Math.max(visibleColumnCount, 1) }, (_, c) => (
                  <TableCell key={c}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={Math.max(visibleColumnCount, 1)} className="py-8 text-center text-glob-text-secondary">
                {emptyState}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                className={onRowClick ? "cursor-pointer" : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Announces the result count after a search and the page after a page change. */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {(paginationEnabled || selectionEnabled) && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-glob-text-secondary">
          <div>{selectionEnabled ? `${selectedCount} of ${total} row${total === 1 ? "" : "s"} selected` : null}</div>
          {paginationEnabled && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap">Rows per page</span>
                <Select
                  aria-label="Rows per page"
                  size="sm"
                  options={pageSizeOptions.map((n) => ({ value: String(n), label: String(n) }))}
                  value={String(pageSizeNow)}
                  onChange={(value) => setPaginationState({ pageIndex: 0, pageSize: Number(value) })}
                />
              </div>
              <span>
                Page {pageIndex + 1} of {pageCount}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" aria-label="Previous page" disabled={pageIndex <= 0} onClick={() => goToPage(pageIndex - 1)}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" aria-label="Next page" disabled={pageIndex >= pageCount - 1} onClick={() => goToPage(pageIndex + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
DataTable.displayName = "DataTable"

export type { ColumnDef }
