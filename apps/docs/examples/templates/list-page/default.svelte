<script lang="ts">
  import { AppShellLayout } from "@glob-ui/svelte/app-shell-layout"
  import { createDataTableColumnHelper } from "@glob-ui/svelte/data-table"
  import ListPageTemplate from "../../../../../templates/svelte/list-page/ListPageTemplate.svelte"

  type Invoice = { id: string; client: string; amount: number; status: string }

  const helper = createDataTableColumnHelper<Invoice>()
  const columns = [
    helper.accessor("id", { header: "Invoice" }),
    helper.accessor("client", { header: "Client" }),
    helper.accessor("amount", { header: "Amount" }),
    helper.accessor("status", { header: "Status" }),
  ]
  const CLIENTS = ["Atlas Studio", "Northwind", "Bluebird Labs", "Harbor Co"]
  const INVOICES: Invoice[] = Array.from({ length: 18 }, (_, i) => ({
    id: `INV-${1000 + i}`,
    client: CLIENTS[i % CLIENTS.length],
    amount: 120 + i * 45,
    status: i % 3 === 0 ? "Paid" : "Open",
  }))
</script>

<AppShellLayout>
  {#snippet header()}<strong>Acme</strong>{/snippet}
  {#snippet sidebar()}<a href="#invoices" class="rounded-md px-3 py-2 text-sm no-underline hover:bg-fd-accent">Invoices</a>{/snippet}
  <ListPageTemplate
    title="Invoices"
    description="Open and paid invoices."
    {columns}
    data={INVOICES}
    aria-label="Invoices"
    getRowId={(row) => row.id}
  >
    {#snippet actions()}<span class="rounded-md border px-3 py-1.5 text-sm">New invoice</span>{/snippet}
  </ListPageTemplate>
</AppShellLayout>
