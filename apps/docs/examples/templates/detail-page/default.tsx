"use client"

import { AppShellLayout } from "@glob-ui/app-shell-layout"
import { DetailPageTemplate } from "../../../../../templates/detail-page/detail-page-template"
import { usePreviewProps } from "@/components/preview-root"

export default function DetailPageDefault() {
  const props = usePreviewProps({ title: "Order 1042", aside: true })
  return (
    <AppShellLayout header={<strong>Acme</strong>} sidebar={<a href="#orders" className="rounded-md px-3 py-2 text-sm no-underline hover:bg-fd-accent">Orders</a>}>
      <DetailPageTemplate
        title={props.title}
        breadcrumbs={<span>Orders / Order 1042</span>}
        backHref="#orders"
        actions={<span className="rounded-md border px-3 py-1.5 text-sm">Print</span>}
        aside={props.aside ? <dl className="grid gap-2 text-sm"><dt className="text-fd-muted-foreground">Paid on</dt><dd>Nov 2</dd><dt className="text-fd-muted-foreground">Client</dt><dd>Atlas Studio</dd></dl> : undefined}
      >
        <ul className="flex flex-col gap-2">
          {Array.from({ length: 18 }, (_, i) => (
            <li key={i} className="rounded-lg border p-3">
              Line item {i + 1}
            </li>
          ))}
        </ul>
      </DetailPageTemplate>
    </AppShellLayout>
  )
}
