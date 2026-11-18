<script lang="ts">
  import { DataTable, createDataTableColumnHelper, type DataTableColumn, type RowSelectionState } from "@glob-ui/svelte/data-table"
  import { Button } from "@glob-ui/svelte/button"
  import { toast } from "@glob-ui/svelte/toast"

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

  let selection = $state<RowSelectionState>({})
  const selectedIds = $derived(Object.keys(selection))
</script>

{#snippet bulkActions()}
  <Button
    size="sm"
    variant="outline"
    onclick={() => {
      toast.success(`Marked ${selectedIds.length} invoices as paid`)
      selection = {}
    }}
  >
    Mark {selectedIds.length} as paid
  </Button>
{/snippet}

<div class="flex w-full flex-col gap-3">
  <DataTable
    aria-label="Invoices"
    {columns}
    data={invoices}
    getRowId={(row) => row.id}
    rowSelection
    pagination
    pageSize={5}
    state={{ rowSelection: selection }}
    onRowSelectionChange={(next) => (selection = next)}
    toolbar={selectedIds.length > 0 ? bulkActions : undefined}
  />
</div>
