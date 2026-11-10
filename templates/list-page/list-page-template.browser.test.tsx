import { beforeEach, describe, expect, it } from "vitest"
import { render } from "vitest-browser-react"
import { page } from "vitest/browser"
import { createDataTableColumnHelper } from "@glob-ui/data-table"
import { ListPageTemplate } from "./list-page-template"
import { expectNoA11yViolations } from "../../tests/browser/a11y"

type Invoice = { id: string; client: string; amount: number }
const helper = createDataTableColumnHelper<Invoice>()
const columns = [helper.accessor("id", { header: "Invoice" }), helper.accessor("client", { header: "Client" })]
const invoices: Invoice[] = [
  { id: "INV-1", client: "Atlas", amount: 10 },
  { id: "INV-2", client: "Northwind", amount: 20 },
]

describe("ListPageTemplate", () => {
  beforeEach(async () => {
    await page.viewport(1280, 800)
  })

  it("renders the header props and the table", async () => {
    await render(<ListPageTemplate title="Invoices" description="Open items" columns={columns} data={invoices} aria-label="Invoices table" />)
    await expect.element(page.getByRole("heading", { level: 1, name: "Invoices" })).toBeInTheDocument()
    await expect.element(page.getByRole("table", { name: "Invoices table" })).toBeInTheDocument()
    await expect.element(page.getByText("Northwind")).toBeInTheDocument()
    expect(document.querySelectorAll('[data-template-part="prop"]').length).toBeGreaterThanOrEqual(2)
  })

  it("shows the empty state when there are no rows", async () => {
    await render(<ListPageTemplate title="Invoices" columns={columns} data={[]} aria-label="Invoices table" />)
    await expect.element(page.getByText("Nothing here yet")).toBeInTheDocument()
  })

  it("marks the table busy while loading", async () => {
    await render(<ListPageTemplate title="Invoices" columns={columns} data={[]} loading aria-label="Invoices table" />)
    await expect.element(page.getByRole("table", { name: "Invoices table" })).toHaveAttribute("aria-busy", "true")
  })

  it("passes axe", async () => {
    await render(<ListPageTemplate title="Invoices" actions={<button type="button">New</button>} columns={columns} data={invoices} aria-label="Invoices table" />)
    await expectNoA11yViolations()
  })
})
