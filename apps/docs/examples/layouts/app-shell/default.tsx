import { AppShellLayout } from "@glob-ui/app-shell-layout"
import { LayoutNavTrigger } from "@glob-ui/layout"

const ROWS = Array.from({ length: 24 }, (_, i) => `Order ${1000 + i}`)

export default function AppShellDefault() {
  return (
    <AppShellLayout
      header={
        <>
          <LayoutNavTrigger />
          <strong>Acme</strong>
        </>
      }
      sidebar={
        <>
          <a href="#overview" aria-current="page" className="rounded-md px-3 py-2 text-sm no-underline hover:bg-fd-accent">
            Overview
          </a>
          <a href="#orders" className="rounded-md px-3 py-2 text-sm no-underline hover:bg-fd-accent">
            Orders
          </a>
          <a href="#customers" className="rounded-md px-3 py-2 text-sm no-underline hover:bg-fd-accent">
            Customers
          </a>
        </>
      }
    >
      <h2 className="mb-4 text-xl font-semibold">Orders</h2>
      <ul className="flex flex-col gap-2">
        {ROWS.map((row) => (
          <li key={row} className="rounded-lg border p-3">
            {row}
          </li>
        ))}
      </ul>
    </AppShellLayout>
  )
}
