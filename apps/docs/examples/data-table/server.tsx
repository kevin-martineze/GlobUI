"use client"

import { useEffect, useState } from "react"
import { DataTable, createDataTableColumnHelper, type DataTableColumn, type SortingState, type PaginationState } from "@glob-ui/data-table"

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

export default function DataTableServer() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [rows, setRows] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Sorting and paging go to the server. Each change asks it for the page again.
  function request(nextSorting: SortingState, nextPagination: PaginationState) {
    const first = nextSorting[0]
    return fetchOrders({ ...nextPagination, sortBy: first?.id as keyof Order | undefined, desc: first?.desc })
  }

  function apply(result: { rows: Order[]; total: number }) {
    setRows(result.rows)
    setTotal(result.total)
    setLoading(false)
  }

  function changeSorting(next: SortingState) {
    setSorting(next)
    setLoading(true)
    request(next, pagination).then(apply)
  }

  function changePagination(next: PaginationState) {
    setPagination(next)
    setLoading(true)
    request(sorting, next).then(apply)
  }

  useEffect(() => {
    let current = true
    request([], { pageIndex: 0, pageSize: 10 }).then((result) => {
      if (current) apply(result)
    })
    return () => {
      current = false
    }
    // Only the first load runs here; later loads come from the change handlers.
  }, [])

  return (
    <div className="w-full">
      {/* manual: the server sorts and pages. The table shows `rows` as they come; `rowCount` sets the page count. */}
      <DataTable
        aria-label="Orders"
        columns={columns}
        data={rows}
        sorting
        pagination
        manual
        rowCount={total}
        loading={loading}
        state={{ sorting, pagination }}
        onSortingChange={changeSorting}
        onPaginationChange={changePagination}
      />
    </div>
  )
}
