// Class parity for the templates (phase 10g-1). Each framework renders each template with the same props, inside
// `[data-testid="template"]`. The snapshot lists every element as "tag class", in document order, so the React and
// Svelte snapshots match when the templates render the same markup.
import { describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { INVOICES } from "./templates.contract"
import type { TemplatesAdapter } from "./types"

const rowsOf = (root: Element) =>
  Array.from(root.querySelectorAll("*")).map((el) => `${el.tagName.toLowerCase()} ${el.getAttribute("class") ?? ""}`.trim())

const root = () => document.querySelector('[data-testid="template"]')

export function templatesParityContract(render: TemplatesAdapter) {
  describe(`templates class parity (${render.name})`, () => {
    it("renders the dashboard with the same elements and classes", async () => {
      await page.viewport(1280, 800)
      await render.dashboard({ title: "Orders", description: "This month", activeHref: "/orders", content: "Order list", actions: true })
      expect(root()).not.toBeNull()
      await expect(JSON.stringify(rowsOf(root()!), null, 2)).toMatchFileSnapshot(`./snapshots/templates-parity/dashboard-${render.name}.json`)
    })

    it("renders the list page with the same elements and classes", async () => {
      await page.viewport(1280, 800)
      await render.listPage({ title: "Invoices", description: "Open items", data: INVOICES, actions: true })
      await expect.poll(() => root()?.querySelectorAll("tbody tr").length).toBe(2)
      await expect(JSON.stringify(rowsOf(root()!), null, 2)).toMatchFileSnapshot(`./snapshots/templates-parity/list-page-${render.name}.json`)
    })

    it("renders the detail page with the same elements and classes", async () => {
      await page.viewport(1280, 800)
      await render.detailPage({ title: "Order 1042", backHref: "/orders", aside: "Paid on Nov 2", content: "Line items", actions: true })
      await expect(JSON.stringify(rowsOf(root()!), null, 2)).toMatchFileSnapshot(`./snapshots/templates-parity/detail-page-${render.name}.json`)
    })
  })
}
