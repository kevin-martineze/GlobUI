"use client"

import { AppShellLayout } from "@glob-ui/app-shell-layout"
import { createDataTableColumnHelper } from "@glob-ui/data-table"
import { ListPageTemplate } from "../../../../../templates/list-page/list-page-template"
import { usePreviewProps } from "@/components/preview-root"

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

export default function ListPageDefault() {
  const props = usePreviewProps({ title: "Invoices", loading: false, empty: false })
  return (
    <AppShellLayout
      header={<strong>Acme</strong>}
      sidebar={<a href="#invoices" className="rounded-md px-3 py-2 text-sm no-underline hover:bg-fd-accent">Invoices</a>}
    >
      <ListPageTemplate
        title={props.title}
        description="Open and paid invoices."
        actions={<span className="rounded-md border px-3 py-1.5 text-sm">New invoice</span>}
        columns={columns}
        data={props.empty ? [] : INVOICES}
        loading={props.loading}
        aria-label="Invoices"
        getRowId={(row) => row.id}
      />
    </AppShellLayout>
  )
}
