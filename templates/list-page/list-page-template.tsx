import type { ReactNode } from "react"
import { PageLayout, PageHeader } from "@glob-ui/page-layout"
import { DataTable, type DataTableColumn, type DataTableProps, type DataTableState } from "@glob-ui/data-table"
import type { RowData } from "@tanstack/react-table"

// Edit: this is yours. The empty state is shown when there are no rows and no filter.
const EMPTY_TITLE = "Nothing here yet"
const EMPTY_TEXT = "New items will appear in this list."

export interface ListPageTemplateProps<TData extends RowData> {
  title: ReactNode
  description?: ReactNode
  /** Buttons for the page, next to the title. */
  actions?: ReactNode
  /** Filter controls. They sit in the table toolbar, before the search field. */
  filters?: ReactNode
  columns: DataTableColumn<TData>[]
  data: TData[]
  "aria-label": string
  getRowId?: DataTableProps<TData>["getRowId"]
  loading?: boolean
  /** Replaces the default empty state text. */
  emptyState?: ReactNode
  /** Passed to DataTable. Use them with `state` for server-side lists. */
  state?: DataTableState
  onSortingChange?: DataTableProps<TData>["onSortingChange"]
  onPaginationChange?: DataTableProps<TData>["onPaginationChange"]
  onGlobalFilterChange?: DataTableProps<TData>["onGlobalFilterChange"]
  onRowSelectionChange?: DataTableProps<TData>["onRowSelectionChange"]
  manual?: boolean
  rowCount?: number
  pageSize?: number
}

/** A list page: a header with actions, and a DataTable with sorting, search, pagination and a loading state. */
export function ListPageTemplate<TData extends RowData>({
  title,
  description,
  actions,
  filters,
  columns,
  data,
  "aria-label": ariaLabel,
  getRowId,
  loading = false,
  emptyState,
  state,
  onSortingChange,
  onPaginationChange,
  onGlobalFilterChange,
  onRowSelectionChange,
  manual,
  rowCount,
  pageSize = 10,
}: ListPageTemplateProps<TData>) {
  return (
    <PageLayout
      header={
        <div data-template-part="fixed">
          <div data-template-part="prop">
            <PageHeader title={title} description={description} actions={actions} />
          </div>
        </div>
      }
    >
      <div data-template-part="prop" className="min-w-0">
        <DataTable
          aria-label={ariaLabel}
          columns={columns}
          data={data}
          getRowId={getRowId}
          loading={loading}
          sorting
          globalFilter
          pagination
          pageSize={pageSize}
          state={state}
          onSortingChange={onSortingChange}
          onPaginationChange={onPaginationChange}
          onGlobalFilterChange={onGlobalFilterChange}
          onRowSelectionChange={onRowSelectionChange}
          manual={manual}
          rowCount={rowCount}
          toolbar={filters}
          emptyState={emptyState ?? <EmptyState />}
        />
      </div>
    </PageLayout>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-1 py-8 text-center">
      <p className="font-medium text-glob-text">{EMPTY_TITLE}</p>
      <p className="text-sm text-glob-text-secondary">{EMPTY_TEXT}</p>
    </div>
  )
}
