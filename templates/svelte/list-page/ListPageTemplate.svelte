<script lang="ts" generics="TData extends RowData">
  import type { Snippet } from "svelte"
  import { PageLayout, PageHeader } from "@glob-ui/svelte/page-layout"
  import {
    DataTable,
    type DataTableColumn,
    type DataTableState,
    type PaginationState,
    type RowData,
    type RowSelectionState,
    type SortingState,
  } from "@glob-ui/svelte/data-table"

  // Edit: this is yours. The empty state is shown when there are no rows and no filter.
  const EMPTY_TITLE = "Nothing here yet"
  const EMPTY_TEXT = "New items will appear in this list."

  /** A list page: a header with actions, and a DataTable with sorting, search, pagination and a loading state. */
  let {
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
    // `state` would clash with the $state rune, so it is renamed here (the prop is still `state`).
    state: controlled,
    onSortingChange,
    onPaginationChange,
    onGlobalFilterChange,
    onRowSelectionChange,
    manual,
    rowCount,
    pageSize = 10,
  }: {
    title: string | Snippet
    description?: string | Snippet
    /** Buttons for the page, next to the title. */
    actions?: Snippet
    /** Filter controls. They sit in the table toolbar, before the search field. */
    filters?: Snippet
    columns: DataTableColumn<TData>[]
    data: TData[]
    "aria-label": string
    getRowId?: (row: TData, index: number) => string
    loading?: boolean
    /** Replaces the default empty state text. */
    emptyState?: string | Snippet
    /** Passed to DataTable. Use them with `state` for server-side lists. */
    state?: DataTableState
    onSortingChange?: (sorting: SortingState) => void
    onPaginationChange?: (pagination: PaginationState) => void
    onGlobalFilterChange?: (filter: string) => void
    onRowSelectionChange?: (selection: RowSelectionState) => void
    manual?: boolean
    rowCount?: number
    pageSize?: number
  } = $props()
</script>

{#snippet defaultEmptyState()}
  <div class="flex flex-col items-center gap-1 py-8 text-center">
    <p class="font-medium text-glob-text">{EMPTY_TITLE}</p>
    <p class="text-sm text-glob-text-secondary">{EMPTY_TEXT}</p>
  </div>
{/snippet}

<PageLayout>
  {#snippet header()}
    <div data-template-part="fixed" data-template-name="header layout">
      <div data-template-part="prop" data-template-name="title, description, actions">
        <PageHeader {title} {description} {actions} />
      </div>
    </div>
  {/snippet}
  <div data-template-part="prop" data-template-name="columns, data, filters, state" class="min-w-0">
    <DataTable
      aria-label={ariaLabel}
      {columns}
      {data}
      {getRowId}
      {loading}
      sorting
      globalFilter
      pagination
      {pageSize}
      state={controlled}
      {onSortingChange}
      {onPaginationChange}
      {onGlobalFilterChange}
      {onRowSelectionChange}
      {manual}
      {rowCount}
      toolbar={filters}
      emptyState={emptyState ?? defaultEmptyState}
    />
  </div>
</PageLayout>
