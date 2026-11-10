import { PageLayout, PageHeader } from "@glob-ui/page-layout"

const ITEMS = Array.from({ length: 16 }, (_, i) => `Item ${i + 1}`)

export default function PageDefault() {
  return (
    <div className="p-4 md:p-6">
      <PageLayout
        header={<PageHeader title="Invoices" description="Open and paid, this month" actions={<span className="rounded-md border px-3 py-1.5 text-sm">New invoice</span>} />}
        aside={
          <div className="rounded-xl border p-4 text-sm">
            <p className="font-medium">Filters</p>
            <p className="text-fd-muted-foreground">Status, client, date range.</p>
          </div>
        }
      >
        <ul className="flex flex-col gap-2">
          {ITEMS.map((item) => (
            <li key={item} className="rounded-lg border p-3">
              {item}
            </li>
          ))}
        </ul>
      </PageLayout>
    </div>
  )
}
