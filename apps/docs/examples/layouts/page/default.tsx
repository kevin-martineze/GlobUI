import { AppShellLayout } from "@glob-ui/app-shell-layout"
import { PageLayout, PageHeader } from "@glob-ui/page-layout"

const ITEMS = Array.from({ length: 16 }, (_, i) => `Item ${i + 1}`)

// PageLayout lives inside a shell's main region. The page passes content only: no wrapper, padding or height.
export default function PageDefault() {
  return (
    <AppShellLayout header={<strong>Acme</strong>}>
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
    </AppShellLayout>
  )
}
