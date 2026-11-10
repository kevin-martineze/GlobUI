"use client"

import { DashboardTemplate } from "../../../../../templates/dashboard/dashboard-template"
import { usePreviewProps } from "@/components/preview-root"

const CARDS = ["Revenue", "Orders", "Customers", "Refunds"]

export default function DashboardDefault() {
  const props = usePreviewProps({ title: "Orders", description: "Every order this month.", activeHref: "/orders" })
  return (
    <DashboardTemplate title={props.title} description={props.description} activeHref={props.activeHref}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map((card) => (
          <div key={card} className="rounded-xl border p-4">
            <p className="text-sm text-fd-muted-foreground">{card}</p>
            <p className="text-2xl font-semibold">1,240</p>
          </div>
        ))}
      </div>
      <ul className="flex flex-col gap-2">
        {Array.from({ length: 20 }, (_, i) => (
          <li key={i} className="rounded-lg border p-3">
            Order {1000 + i}
          </li>
        ))}
      </ul>
    </DashboardTemplate>
  )
}
