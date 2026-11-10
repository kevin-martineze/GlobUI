"use client"

import { useState } from "react"
import { DataTable, createDataTableColumnHelper, type DataTableColumn, type RowSelectionState } from "@glob-ui/data-table"
import { Button } from "@glob-ui/button"
import { toast } from "@glob-ui/toast"

type Invoice = { id: string; client: string; amount: number }

const invoices: Invoice[] = Array.from({ length: 12 }, (_, i) => ({
  id: `INV-${1000 + i}`,
  client: ["Atlas Studio", "Northwind", "Bluebird Labs"][i % 3],
  amount: 300 + i * 125,
}))

const helper = createDataTableColumnHelper<Invoice>()
const columns: DataTableColumn<Invoice>[] = [
  helper.accessor("id", { header: "Invoice" }),
  helper.accessor("client", { header: "Client" }),
  helper.accessor("amount", { header: "Amount", cell: (info) => `$${info.getValue().toLocaleString("en-US")}` }),
]

export default function DataTableSelection() {
  const [selection, setSelection] = useState<RowSelectionState>({})
  const selectedIds = Object.keys(selection)

  return (
    <div className="flex w-full flex-col gap-3">
      <DataTable
        aria-label="Invoices"
        columns={columns}
        data={invoices}
        getRowId={(row) => row.id}
        rowSelection
        pagination
        pageSize={5}
        state={{ rowSelection: selection }}
        onRowSelectionChange={setSelection}
        toolbar={
          selectedIds.length > 0 ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.success(`Marked ${selectedIds.length} invoices as paid`)
                setSelection({})
              }}
            >
              Mark {selectedIds.length} as paid
            </Button>
          ) : null
        }
      />
    </div>
  )
}
