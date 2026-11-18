<script lang="ts" generics="TData extends RowData">
  import type { Snippet } from "svelte"
  import {
    createTable,
    FlexRender,
    renderComponent,
    type ColumnVisibilityState,
    type PaginationState,
    type RowData,
    type RowSelectionState,
    type SortingState,
    type Updater,
  } from "@tanstack/svelte-table"
  import { cn } from "@glob-ui/utils"
  import { matchesSearch } from "@glob-ui/core"
  import {
    buttonVariants,
    DATA_TABLE_CLASSES,
    DATA_TABLE_EMPTY_CLASSES,
    DATA_TABLE_FOOTER_CLASSES,
    DATA_TABLE_PAGE_BUTTONS_CLASSES,
    DATA_TABLE_PAGE_SIZE_CLASSES,
    DATA_TABLE_PAGE_SIZE_LABEL_CLASSES,
    DATA_TABLE_PAGINATION_CLASSES,
    DATA_TABLE_ROW_CLICKABLE_CLASSES,
    DATA_TABLE_SEARCH_CLASSES,
    DATA_TABLE_SKELETON_CLASSES,
    DATA_TABLE_SORT_BUTTON_CLASSES,
    DATA_TABLE_SORT_ICON_CLASSES,
    DATA_TABLE_SORT_ICON_IDLE_CLASSES,
    DATA_TABLE_TOOLBAR_CLASSES,
    DATA_TABLE_TOOLBAR_START_CLASSES,
  } from "@glob-ui/recipes"
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table"
  import { Button } from "../button"
  import { Checkbox } from "../checkbox"
  import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../dropdown-menu"
  import { Input } from "../input"
  import { Select } from "../select"
  import { Skeleton } from "../skeleton"
  import { createDataTableColumnHelper, dataTableFeatures, StableArray, type DataTableColumn, type DataTableState } from "./features"

  type Props = {
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
    emptyState?: string | Snippet
    /** Extra controls next to the search field, for example bulk actions. */
    toolbar?: Snippet
    /** Row click. The row is not a button: give keyboard users a link or button inside a cell. */
    onRowClick?: (row: TData) => void
    density?: "compact" | "default" | "comfortable"
    striped?: boolean
    stickyHeader?: boolean
    class?: string
    containerClass?: string
  }

  /**
   * A data table: sorting, filtering, pagination, row selection and column visibility, each opt-in.
   * It keeps its own state unless you pass `state` and the change handlers (server data).
   */
  let {
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
    // `state` would clash with the $state rune (Svelte reads `$state` as a store of it), so it is renamed here.
    state: controlled,
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
    class: className,
    containerClass,
  }: Props = $props()

  // Each slice is controlled when `state` has it, and internal otherwise. The handler fires on every change.
  let sortingInternal = $state<SortingState>([])
  // Only the initial pageSize is wanted.
  // svelte-ignore state_referenced_locally
  let paginationInternal = $state<PaginationState>({ pageIndex: 0, pageSize })
  let filterInternal = $state("")
  let selectionInternal = $state<RowSelectionState>({})
  let visibilityState = $state<ColumnVisibilityState>({})

  const sortingState = $derived(controlled?.sorting ?? sortingInternal)
  const paginationState = $derived(controlled?.pagination ?? paginationInternal)
  const filterState = $derived(controlled?.globalFilter ?? filterInternal)
  const selectionState = $derived(controlled?.rowSelection ?? selectionInternal)

  function setSorting(next: SortingState) {
    if (controlled?.sorting === undefined) sortingInternal = next
    if (next !== sortingState) onSortingChange?.(next)
  }
  function setPagination(next: PaginationState) {
    if (controlled?.pagination === undefined) paginationInternal = next
    if (next !== paginationState) onPaginationChange?.(next)
  }
  function setFilter(next: string) {
    if (controlled?.globalFilter === undefined) filterInternal = next
    if (next !== filterState) onGlobalFilterChange?.(next)
  }
  function setSelection(next: RowSelectionState) {
    if (controlled?.rowSelection === undefined) selectionInternal = next
    if (next !== selectionState) onRowSelectionChange?.(next)
  }

  const resolve = <T,>(updater: Updater<T>, current: T): T =>
    typeof updater === "function" ? (updater as (old: T) => T)(current) : updater

  // Accent-insensitive word match over the row's values. In manual mode the server filters, so every row passes.
  const passAll = () => true
  const matchRow = (row: { original: TData }, _columnId: string, filterValue: unknown) =>
    matchesSearch(String(filterValue ?? ""), ...Object.values(row.original as object).map((v) => String(v ?? "")))

  const helper = createDataTableColumnHelper<TData>()
  const allColumns = $derived.by<DataTableColumn<TData>[]>(() => {
    if (!selectionEnabled) return columns
    const select = helper.display({
      id: "select",
      header: ({ table }) =>
        renderComponent(Checkbox, {
          "aria-label": "Select all rows",
          checked: table.getIsAllPageRowsSelected(),
          indeterminate: table.getIsSomePageRowsSelected(),
          onchange: table.getToggleAllPageRowsSelectedHandler(),
        }),
      cell: ({ row }) =>
        renderComponent(Checkbox, {
          "aria-label": "Select row",
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          onchange: row.getToggleSelectedHandler(),
        }),
    })
    return [select as DataTableColumn<TData>, ...columns]
  })

  // Without pagination, one page holds every row.
  const effectivePagination = $derived<PaginationState>(
    paginationEnabled ? paginationState : { pageIndex: 0, pageSize: Math.max(data.length, 1) }
  )

  // The Svelte adapter keeps the table options in deep $state, so each options update would hand table-core a new proxy
  // of `data`. table-core reads that as new data and goes back to the first page. Svelte does not proxy an Array
  // subclass, so the rows and the columns keep their identity until the props change.
  const tableData = $derived(StableArray.from(data))
  const tableColumns = $derived(StableArray.from(allColumns))

  const table = createTable({
    features: dataTableFeatures,
    get columns() {
      return tableColumns
    },
    get data() {
      return tableData
    },
    get getRowId() {
      return getRowId
    },
    get state() {
      return {
        sorting: sortingState,
        pagination: effectivePagination,
        globalFilter: filterEnabled ? filterState : "",
        rowSelection: selectionState,
        columnVisibility: visibilityState,
      }
    },
    onSortingChange: (updater: Updater<SortingState>) => setSorting(resolve(updater, sortingState)),
    onPaginationChange: (updater: Updater<PaginationState>) => setPagination(resolve(updater, paginationState)),
    onGlobalFilterChange: (updater: Updater<string>) => setFilter(resolve(updater, filterState)),
    onRowSelectionChange: (updater: Updater<RowSelectionState>) => setSelection(resolve(updater, selectionState)),
    onColumnVisibilityChange: (updater: Updater<ColumnVisibilityState>) => {
      visibilityState = resolve(updater, visibilityState)
    },
    get enableSorting() {
      return sortingEnabled
    },
    get enableRowSelection() {
      return selectionEnabled
    },
    get enableGlobalFilter() {
      return filterEnabled
    },
    get enableHiding() {
      return visibilityEnabled
    },
    get manualSorting() {
      return manual
    },
    get manualPagination() {
      return manual
    },
    // A new function would reset the filtered rows, and with them the page index: the two filters are created once.
    get globalFilterFn() {
      return manual ? passAll : matchRow
    },
  })

  const rows = $derived(table.getRowModel().rows)
  const visibleColumnCount = $derived(table.getVisibleLeafColumns().length)
  const total = $derived(manual ? (rowCount ?? data.length) : table.getRowCount())
  const pageSizeNow = $derived(effectivePagination.pageSize)
  const pageCount = $derived(manual ? Math.max(1, Math.ceil(total / pageSizeNow)) : Math.max(1, table.getPageCount()))
  const pageIndex = $derived(effectivePagination.pageIndex)
  const filterActive = $derived(filterEnabled && filterState !== "")
  const selectedCount = $derived(Object.keys(selectionState).filter((id) => selectionState[id]).length)
  const announcement = $derived(
    [
      filterActive ? `${total} ${total === 1 ? "result" : "results"}` : null,
      paginationEnabled && pageCount > 1 ? `Page ${pageIndex + 1} of ${pageCount}` : null,
    ]
      .filter(Boolean)
      .join(". ")
  )

  function goToPage(next: number) {
    setPagination({ ...paginationState, pageIndex: Math.min(Math.max(next, 0), pageCount - 1) })
  }

  const showToolbar = $derived(filterEnabled || visibilityEnabled || toolbar)
  const hideable = $derived(visibilityEnabled ? table.getAllLeafColumns().filter((column) => column.getCanHide()) : [])
</script>

{#snippet sortIndicator(direction: false | "asc" | "desc")}
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    class={cn(DATA_TABLE_SORT_ICON_CLASSES, !direction && DATA_TABLE_SORT_ICON_IDLE_CLASSES)}
  >
    {#if direction === "desc"}<path d="M6 9l6 6 6-6" />{:else if direction === "asc"}<path d="M6 15l6-6 6 6" />{:else}<path
        d="M7 10l5-5 5 5M7 14l5 5 5-5"
      />{/if}
  </svg>
{/snippet}

<div class={cn(DATA_TABLE_CLASSES, className)}>
  {#if showToolbar}
    <div class={DATA_TABLE_TOOLBAR_CLASSES}>
      <div class={DATA_TABLE_TOOLBAR_START_CLASSES}>
        {#if filterEnabled}
          <Input
            type="search"
            aria-label="Search"
            placeholder="Search..."
            value={filterState}
            oninput={(event) => {
              setFilter(event.currentTarget.value)
              if (paginationEnabled) setPagination({ ...paginationState, pageIndex: 0 })
            }}
            class={DATA_TABLE_SEARCH_CLASSES}
          />
        {/if}
        {@render toolbar?.()}
      </div>
      {#if visibilityEnabled}
        <DropdownMenu>
          <!-- The trigger renders its own button, so the button styles go on it directly. -->
          <DropdownMenuTrigger class={buttonVariants({ variant: "outline", size: "sm" })}>Columns</DropdownMenuTrigger>
          <DropdownMenuContent>
            {#each hideable as column (column.id)}
              <DropdownMenuCheckboxItem checked={column.getIsVisible()} onCheckedChange={(next) => column.toggleVisibility(next)}>
                {typeof column.columnDef.header === "string" ? column.columnDef.header : column.id}
              </DropdownMenuCheckboxItem>
            {/each}
          </DropdownMenuContent>
        </DropdownMenu>
      {/if}
    </div>
  {/if}

  <Table
    aria-label={ariaLabel}
    aria-busy={loading || undefined}
    scrollLabel={ariaLabel}
    {density}
    {striped}
    {stickyHeader}
    {containerClass}
  >
    <TableHeader>
      {#each table.getHeaderGroups() as group (group.id)}
        <TableRow>
          {#each group.headers as header (header.id)}
            {@const canSort = header.column.getCanSort()}
            {@const direction = header.column.getIsSorted()}
            <TableHead
              aria-sort={canSort ? (direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none") : undefined}
            >
              {#if !header.isPlaceholder}
                {#if canSort}
                  <button type="button" onclick={header.column.getToggleSortingHandler()} class={DATA_TABLE_SORT_BUTTON_CLASSES}>
                    <FlexRender {header} />
                    {@render sortIndicator(direction)}
                  </button>
                {:else}
                  <FlexRender {header} />
                {/if}
              {/if}
            </TableHead>
          {/each}
        </TableRow>
      {/each}
    </TableHeader>
    <TableBody>
      {#if loading}
        {#each { length: pageSizeNow }, i (i)}
          <TableRow aria-hidden="true">
            {#each { length: Math.max(visibleColumnCount, 1) }, c (c)}
              <TableCell><Skeleton class={DATA_TABLE_SKELETON_CLASSES} /></TableCell>
            {/each}
          </TableRow>
        {/each}
      {:else if rows.length === 0}
        <TableRow>
          <TableCell colspan={Math.max(visibleColumnCount, 1)} class={DATA_TABLE_EMPTY_CLASSES}>
            {#if typeof emptyState === "string"}{emptyState}{:else}{@render emptyState()}{/if}
          </TableCell>
        </TableRow>
      {:else}
        {#each rows as row (row.id)}
          <TableRow
            data-state={row.getIsSelected() ? "selected" : undefined}
            onclick={onRowClick ? () => onRowClick(row.original) : undefined}
            class={onRowClick ? DATA_TABLE_ROW_CLICKABLE_CLASSES : undefined}
          >
            {#each row.getVisibleCells() as cell (cell.id)}
              <TableCell><FlexRender {cell} /></TableCell>
            {/each}
          </TableRow>
        {/each}
      {/if}
    </TableBody>
  </Table>

  <!-- Announces the result count after a search and the page after a page change. -->
  <div role="status" aria-live="polite" class="sr-only">{announcement}</div>

  {#if paginationEnabled || selectionEnabled}
    <div class={DATA_TABLE_FOOTER_CLASSES}>
      <div>{selectionEnabled ? `${selectedCount} of ${total} row${total === 1 ? "" : "s"} selected` : null}</div>
      {#if paginationEnabled}
        <div class={DATA_TABLE_PAGINATION_CLASSES}>
          <div class={DATA_TABLE_PAGE_SIZE_CLASSES}>
            <span class={DATA_TABLE_PAGE_SIZE_LABEL_CLASSES}>Rows per page</span>
            <Select
              aria-label="Rows per page"
              size="sm"
              options={pageSizeOptions.map((n) => ({ value: String(n), label: String(n) }))}
              value={String(pageSizeNow)}
              onChange={(value) => setPagination({ pageIndex: 0, pageSize: Number(value) })}
            />
          </div>
          <span>Page {pageIndex + 1} of {pageCount}</span>
          <div class={DATA_TABLE_PAGE_BUTTONS_CLASSES}>
            <Button variant="outline" size="sm" aria-label="Previous page" disabled={pageIndex <= 0} onclick={() => goToPage(pageIndex - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              aria-label="Next page"
              disabled={pageIndex >= pageCount - 1}
              onclick={() => goToPage(pageIndex + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
