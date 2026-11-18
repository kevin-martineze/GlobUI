// The templates (phase 10g-1): Dashboard, List page and Detail page. Each fixes part of a layout and exposes props
// for the rest; the fixed and prop parts are marked with `data-template-part`. The scroll rule holds: the viewport
// never scrolls, the layout's main region does.
import { beforeEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "../browser/a11y"
import type { ContractInvoice, TemplatesAdapter } from "./types"

export const INVOICES: ContractInvoice[] = [
  { id: "INV-1", client: "Atlas", amount: 10 },
  { id: "INV-2", client: "Northwind", amount: 20 },
]

export function templatesContract(render: TemplatesAdapter) {
  describe(`DashboardTemplate (${render.name})`, () => {
    beforeEach(async () => {
      await page.viewport(1280, 800)
    })

    it("marks the fixed parts and renders the props", async () => {
      await render.dashboard({ title: "Orders", description: "This month", activeHref: "/orders", content: "Order list" })
      expect(document.querySelectorAll('[data-template-part="fixed"]').length).toBeGreaterThanOrEqual(2)
      await expect.element(page.getByRole("heading", { level: 1, name: "Orders" })).toBeInTheDocument()
      await expect.element(page.getByText("This month")).toBeInTheDocument()
      await expect.element(page.getByText("Order list")).toBeInTheDocument()
      await expect.element(page.getByRole("link", { name: "Acme" })).toHaveAttribute("href", "/")
    })

    it("marks the current navigation link", async () => {
      await render.dashboard({ title: "Orders", activeHref: "/orders" })
      // The sidebar, and its copy in the mobile navigation sheet, mark the same link.
      const current = Array.from(document.querySelectorAll('[aria-current="page"]'))
      expect(current.length).toBeGreaterThanOrEqual(1)
      expect(current.map((el) => el.textContent?.trim())).toEqual(current.map(() => "Orders"))
    })

    it("opens the user menu", async () => {
      await render.dashboard({ title: "Orders" })
      await userEvent.click(page.getByRole("button", { name: /Account of Ada Lovelace/ }))
      await expect.element(page.getByRole("menu")).toBeVisible()
      await expect.element(page.getByRole("menuitem", { name: "Sign out" })).toBeInTheDocument()
      await userEvent.keyboard("{Escape}")
    })

    it("keeps the viewport still and scrolls only the main region", async () => {
      await render.dashboard({ title: "Orders", rows: 80 })
      expect(document.documentElement.scrollHeight).toBeLessThanOrEqual(window.innerHeight + 1)
      const main = document.querySelector("main") as HTMLElement
      expect(main.scrollHeight).toBeGreaterThan(main.clientHeight)
    })

    it("opens the navigation on a phone", async () => {
      await page.viewport(375, 812)
      await render.dashboard({ title: "Orders" })
      await userEvent.click(page.getByRole("button", { name: "Open navigation" }))
      await expect.element(page.getByRole("dialog", { name: "Main navigation" })).toBeVisible()
      await userEvent.keyboard("{Escape}")
      await page.viewport(1280, 800)
    })

    it("passes axe", async () => {
      await render.dashboard({ title: "Orders", description: "This month", activeHref: "/orders", actions: true })
      await expectNoA11yViolations()
    })
  })

  describe(`ListPageTemplate (${render.name})`, () => {
    beforeEach(async () => {
      await page.viewport(1280, 800)
    })

    it("renders the header props and the table", async () => {
      await render.listPage({ title: "Invoices", description: "Open items", data: INVOICES })
      await expect.element(page.getByRole("heading", { level: 1, name: "Invoices" })).toBeInTheDocument()
      await expect.element(page.getByRole("table", { name: "Invoices table" })).toBeInTheDocument()
      await expect.element(page.getByText("Northwind")).toBeInTheDocument()
      expect(document.querySelectorAll('[data-template-part="prop"]').length).toBeGreaterThanOrEqual(2)
    })

    it("turns on sorting, search and pagination", async () => {
      await render.listPage({ title: "Invoices", data: INVOICES })
      expect(document.querySelectorAll("th[aria-sort]").length).toBe(2)
      expect(Array.from(document.querySelectorAll("span")).some((el) => el.textContent === "Page 1 of 1")).toBe(true)
      await userEvent.fill(page.getByRole("searchbox", { name: "Search" }), "north")
      await expect.poll(() => document.querySelectorAll("tbody tr").length).toBe(1)
    })

    it("shows the empty state when there are no rows", async () => {
      await render.listPage({ title: "Invoices", data: [] })
      await expect.element(page.getByText("Nothing here yet")).toBeInTheDocument()
      await expect.element(page.getByText("New items will appear in this list.")).toBeInTheDocument()
    })

    it("marks the table busy while loading", async () => {
      await render.listPage({ title: "Invoices", data: [], loading: true })
      await expect.element(page.getByRole("table", { name: "Invoices table" })).toHaveAttribute("aria-busy", "true")
    })

    it("passes axe", async () => {
      await render.listPage({ title: "Invoices", data: INVOICES, actions: true })
      await expectNoA11yViolations()
    })
  })

  describe(`DetailPageTemplate (${render.name})`, () => {
    beforeEach(async () => {
      await page.viewport(1280, 800)
    })

    it("renders a back link, the title and the aside card", async () => {
      await render.detailPage({ title: "Order 1042", backHref: "/orders", aside: "Paid on Nov 2", content: "Line items" })
      await expect.element(page.getByRole("link", { name: "← Back" })).toHaveAttribute("href", "/orders")
      await expect.element(page.getByRole("heading", { level: 1, name: "Order 1042" })).toBeInTheDocument()
      await expect.element(page.getByRole("heading", { level: 2, name: "Details" })).toBeInTheDocument()
      await expect.element(page.getByText("Paid on Nov 2")).toBeInTheDocument()
      await expect.element(page.getByText("Line items")).toBeInTheDocument()
      expect(document.querySelector('aside[data-slot="aside"]')?.getAttribute("data-scroll")).toBe("fixed")
    })

    it("leaves out the back link and the aside when they are not given", async () => {
      await render.detailPage({ title: "Order 1042", content: "Line items" })
      expect(document.querySelector('aside[data-slot="aside"]')).toBeNull()
      expect(page.getByRole("link", { name: "← Back" }).elements()).toHaveLength(0)
    })

    it("renders the actions in a prop part", async () => {
      await render.detailPage({ title: "Order 1042", actions: true })
      const button = page.getByRole("button", { name: "Edit" })
      await expect.element(button).toBeInTheDocument()
      expect(button.element().closest('[data-template-name="actions"]')?.getAttribute("data-template-part")).toBe("prop")
    })

    it("passes axe", async () => {
      await render.detailPage({ title: "Order 1042", backHref: "/orders", aside: "Paid", content: "Lines" })
      await expectNoA11yViolations()
    })
  })
}
