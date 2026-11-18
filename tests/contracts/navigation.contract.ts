// Phase 10d-3 contracts: the behaviour and accessibility of the navigation components (Tabs, Accordion, Pagination),
// written once and run in every framework that ports them. They come from the React package tests, plus a few checks
// on the wiring between parts (ids, headings, callbacks) that a port could miss.
import { describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "../browser/a11y"
import type { NavigationAdapter } from "./types"

const tab = (name: string) => page.getByRole("tab", { name })
const header = (name: string) => page.getByRole("button", { name })
const expanded = (name: string) => header(name).element().getAttribute("aria-expanded")

export function navigationContract(render: NavigationAdapter) {
  describe(`Tabs (${render.name})`, () => {
    it("moves with ArrowRight, skips the disabled tab, and loops", async () => {
      await render.tabs({ defaultValue: "account" })
      tab("Account").element().focus()

      await userEvent.keyboard("{ArrowRight}")
      await expect.element(tab("Billing")).toHaveFocus()
      await expect.element(tab("Billing")).toHaveAttribute("aria-selected", "true")

      await userEvent.keyboard("{ArrowRight}")
      await expect.element(tab("Team")).toHaveFocus()

      await userEvent.keyboard("{ArrowRight}")
      await expect.element(tab("Account")).toHaveFocus()
      await expectNoA11yViolations()
    })

    it("moves backwards with ArrowLeft, skipping the disabled tab", async () => {
      await render.tabs({ defaultValue: "billing" })
      tab("Billing").element().focus()
      await userEvent.keyboard("{ArrowLeft}")
      await expect.element(tab("Account")).toHaveFocus()
    })

    it("jumps with Home and End", async () => {
      await render.tabs({ defaultValue: "billing" })
      tab("Billing").element().focus()
      await userEvent.keyboard("{End}")
      await expect.element(tab("Team")).toHaveFocus()
      await userEvent.keyboard("{Home}")
      await expect.element(tab("Account")).toHaveFocus()
    })

    it("uses Up and Down in a vertical list", async () => {
      await render.tabs({ defaultValue: "account", orientation: "vertical" })
      await expect.element(page.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical")
      tab("Account").element().focus()
      await userEvent.keyboard("{ArrowDown}")
      await expect.element(tab("Billing")).toHaveFocus()
      await userEvent.keyboard("{ArrowRight}")
      await expect.element(tab("Billing")).toHaveFocus()
      await userEvent.keyboard("{ArrowUp}")
      await expect.element(tab("Account")).toHaveFocus()
    })

    it("gives the first enabled tab tabIndex 0 when value matches no tab", async () => {
      await render.tabs({ value: "does-not-exist" })
      await expect.element(tab("Account")).toHaveAttribute("tabindex", "0")
      await expect.element(tab("Billing")).toHaveAttribute("tabindex", "-1")
      expect(tab("Password").element().getAttribute("tabindex")).not.toBe("0")
    })

    it("shows the panel for the selected tab only", async () => {
      await render.tabs({ defaultValue: "billing" })
      await expect.element(page.getByText("Billing panel")).toBeVisible()
      expect(page.getByText("Account panel").elements()).toHaveLength(0)
    })

    it("selects a tab on click and reports the value", async () => {
      const onValueChange = vi.fn()
      await render.tabs({ defaultValue: "account", onValueChange })
      await userEvent.click(tab("Team"))
      expect(onValueChange).toHaveBeenLastCalledWith("team")
      await expect.element(tab("Team")).toHaveAttribute("aria-selected", "true")
      await expect.element(tab("Team")).toHaveAttribute("data-state", "active")
      await expect.element(tab("Account")).toHaveAttribute("data-state", "inactive")
      await expect.element(page.getByText("Team panel")).toBeVisible()
    })

    it("links each tab to its panel, and the panel back to its tab", async () => {
      await render.tabs({ defaultValue: "billing" })
      const trigger = tab("Billing").element()
      const panel = page.getByRole("tabpanel").element()
      expect(trigger.getAttribute("aria-controls")).toBe(panel.id)
      expect(panel.getAttribute("aria-labelledby")).toBe(trigger.id)
      expect(panel.getAttribute("tabindex")).toBe("0")
      // Every other panel stays in the DOM, hidden, so its tab's aria-controls points at an element.
      const controlled = document.getElementById(tab("Account").element().getAttribute("aria-controls")!)
      expect(controlled?.hidden).toBe(true)
    })
  })

  describe(`Accordion (${render.name})`, () => {
    it("single: opening one item closes the other", async () => {
      await render.accordion({ type: "single" })
      await userEvent.click(header("Shipping"))
      await expect.element(page.getByText("Ships in 2 days.")).toBeVisible()

      await userEvent.click(header("Returns"))
      await expect.element(header("Returns")).toHaveAttribute("aria-expanded", "true")
      await expect.element(header("Shipping")).toHaveAttribute("aria-expanded", "false")
      await expectNoA11yViolations()
    })

    it("single without collapsible: the open item cannot be closed by its trigger", async () => {
      await render.accordion({ type: "single" })
      await userEvent.click(header("Shipping"))
      await userEvent.click(header("Shipping"))
      expect(expanded("Shipping")).toBe("true")
    })

    it("single collapsible: the open item closes when its trigger is clicked again", async () => {
      const onValueChange = vi.fn()
      await render.accordion({ type: "single", collapsible: true, onValueChange })
      await userEvent.click(header("Shipping"))
      expect(onValueChange).toHaveBeenLastCalledWith("a")
      await userEvent.click(header("Shipping"))
      await expect.element(header("Shipping")).toHaveAttribute("aria-expanded", "false")
      expect(onValueChange).toHaveBeenLastCalledWith("")
    })

    it("multiple: several items can be open at once", async () => {
      const onValueChange = vi.fn()
      await render.accordion({ type: "multiple", onValueChange })
      await userEvent.click(header("Shipping"))
      await userEvent.click(header("Returns"))
      expect(expanded("Shipping")).toBe("true")
      expect(expanded("Returns")).toBe("true")
      expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"])
    })

    it("a disabled item does not open", async () => {
      await render.accordion({ type: "single" })
      await expect.element(header("Disabled")).toBeDisabled()
      await userEvent.click(header("Disabled"), { force: true })
      expect(expanded("Disabled")).toBe("false")
    })

    it("keeps closed content inert and out of the accessibility tree", async () => {
      await render.accordion({ type: "single" })
      expect(page.getByText("Ships in 2 days.").elements()).toHaveLength(1)
      const panel = document.querySelector('[role="region"][id]') ?? document.querySelector("[inert]")
      expect(panel).not.toBeNull()
      expect(panel!.hasAttribute("inert")).toBe(true)

      await userEvent.click(header("Shipping"))
      await expect.element(page.getByText("Ships in 2 days.")).toBeVisible()
      expect(document.querySelector('[role="region"][id]')!.hasAttribute("inert")).toBe(false)
    })

    it("wraps each trigger in an h3 and labels its region with it", async () => {
      await render.accordion({ type: "single" })
      const trigger = header("Shipping").element()
      expect(trigger.parentElement?.tagName).toBe("H3")
      const region = document.getElementById(trigger.getAttribute("aria-controls")!)
      expect(region?.getAttribute("role")).toBe("region")
      expect(region?.getAttribute("aria-labelledby")).toBe(trigger.id)
    })

    it("moves between headers with the arrows, Home and End, skipping the disabled one", async () => {
      await render.accordion({ type: "single" })
      header("Shipping").element().focus()
      await userEvent.keyboard("{ArrowDown}")
      await expect.element(header("Returns")).toHaveFocus()
      await userEvent.keyboard("{ArrowDown}")
      await expect.element(header("Shipping")).toHaveFocus()
      await userEvent.keyboard("{End}")
      await expect.element(header("Returns")).toHaveFocus()
      await userEvent.keyboard("{Home}")
      await expect.element(header("Shipping")).toHaveFocus()
    })
  })

  describe(`Pagination (${render.name})`, () => {
    it("passes axe with links and the current page marked", async () => {
      await render.paginationLinks()
      await expect.element(page.getByRole("navigation", { name: "Pagination" })).toBeVisible()
      await expect.element(page.getByRole("link", { name: "1" })).toHaveAttribute("aria-current", "page")
      await expect.element(page.getByRole("link", { name: "Go to next page" })).toHaveAttribute("href", "/b")
      await expect.element(page.getByText("More pages")).toBeInTheDocument()
      await expectNoA11yViolations()
    })

    it("the disabled previous link cannot be followed", async () => {
      await render.paginationDisabledPrevious()
      const prev = page.getByRole("link", { name: "Go to previous page" }).element() as HTMLAnchorElement
      expect(prev.getAttribute("aria-disabled")).toBe("true")
      expect(prev.hasAttribute("href")).toBe(false)
      expect(prev.getAttribute("tabindex")).toBe("-1")
    })

    it("controlled buttons move the current page and disable the ends", async () => {
      const onPage = vi.fn()
      await render.paginationControlled({ pageCount: 5, onPage })
      await expect.element(page.getByRole("button", { name: "Go to previous page" })).toBeDisabled()
      await userEvent.click(page.getByRole("button", { name: "Go to next page" }))
      expect(onPage).toHaveBeenLastCalledWith(2)
      await expect.element(page.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page")
      await expectNoA11yViolations()
    })

    it("shows an ellipsis for hidden pages and reaches the last page", async () => {
      const onPage = vi.fn()
      await render.paginationControlled({ pageCount: 10, onPage })
      await expect.element(page.getByText("More pages")).toBeInTheDocument()
      await userEvent.click(page.getByRole("button", { name: "10" }))
      expect(onPage).toHaveBeenLastCalledWith(10)
      await expect.element(page.getByRole("button", { name: "Go to next page" })).toBeDisabled()
      await expect.element(page.getByRole("button", { name: "Go to previous page" })).toBeEnabled()
    })
  })
}
