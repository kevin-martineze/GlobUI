<script lang="ts">
  import { onMount } from "svelte"
  import {
    DataTable,
    createDataTableColumnHelper,
    type DataTableColumn,
    type PaginationState,
    type SortingState,
  } from "@glob-ui/svelte/data-table"

  type Order = { id: string; customer: string; total: number }

  const ALL: Order[] = Array.from({ length: 40 }, (_, i) => ({
    id: `ORD-${3000 + i}`,
    customer: ["Atlas Studio", "Northwind", "Bluebird Labs", "Quill & Co"][i % 4],
    total: 40 + ((i * 37) % 500),
  }))

  /** A stand-in for an API: 400 ms, then one page of rows, sorted by the requested column. */
  function fetchOrders(params: { pageIndex: number; pageSize: number; sortBy?: keyof Order; desc?: boolean }) {
    return new Promise<{ rows: Order[]; total: number }>((resolve) => {
      window.setTimeout(() => {
        const sorted = [...ALL].sort((a, b) => {
          if (!params.sortBy) return 0
          const cmp = a[params.sortBy] < b[params.sortBy] ? -1 : a[params.sortBy] > b[params.sortBy] ? 1 : 0
          return params.desc ? -cmp : cmp
        })
        const start = params.pageIndex * params.pageSize
        resolve({ rows: sorted.slice(start, start + params.pageSize), total: ALL.length })
      }, 400)
    })
  }

  const helper = createDataTableColumnHelper<Order>()
  const columns: DataTableColumn<Order>[] = [
    helper.accessor("id", { header: "Order" }),
    helper.accessor("customer", { header: "Customer" }),
    helper.accessor("total", { header: "Total", cell: (info) => `$${info.getValue()}` }),
  ]

  let sorting = $state<SortingState>([])
  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 })
  let rows = $state<Order[]>([])
  let total = $state(0)
  let loading = $state(true)

  // Sorting and paging go to the server. Each change asks it for the page again.
  function load() {
    const first = sorting[0]
    loading = true
    fetchOrders({ ...pagination, sortBy: first?.id as keyof Order | undefined, desc: first?.desc }).then((result) => {
      rows = result.rows
      total = result.total
      loading = false
    })
  }

  onMount(load)
</script>

<div class="w-full">
  <!-- manual: the server sorts and pages. The table shows `rows` as they come; `rowCount` sets the page count. -->
  <DataTable
    aria-label="Orders"
    {columns}
    data={rows}
    sorting
    pagination
    manual
    rowCount={total}
    {loading}
    state={{ sorting, pagination }}
    onSortingChange={(next) => {
      sorting = next
      load()
    }}
    onPaginationChange={(next) => {
      pagination = next
      load()
    }}
  />
</div>
