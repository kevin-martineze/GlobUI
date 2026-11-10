import { beforeEach, describe, expect, it } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { DashboardTemplate } from "./dashboard-template"
import { expectNoA11yViolations } from "../../tests/browser/a11y"

describe("DashboardTemplate", () => {
  beforeEach(async () => {
    await page.viewport(1280, 800)
  })

  it("marks the fixed parts and renders the props", async () => {
    await render(
      <DashboardTemplate title="Orders" description="This month" activeHref="/orders">
        <p>Order list</p>
      </DashboardTemplate>
    )
    const fixed = document.querySelectorAll('[data-template-part="fixed"]')
    expect(fixed.length).toBeGreaterThanOrEqual(2)
    await expect.element(page.getByRole("heading", { level: 1, name: "Orders" })).toBeInTheDocument()
    await expect.element(page.getByText("Order list")).toBeInTheDocument()
  })

  it("marks the current navigation link", async () => {
    await render(<DashboardTemplate title="Orders" activeHref="/orders" />)
    const current = document.querySelector('[aria-current="page"]')
    expect(current?.textContent).toBe("Orders")
  })

  it("keeps the viewport still and scrolls only the main region", async () => {
    await render(
      <DashboardTemplate title="Orders">
        {Array.from({ length: 80 }, (_, i) => (
          <p key={i}>Row {i}</p>
        ))}
      </DashboardTemplate>
    )
    expect(document.documentElement.scrollHeight).toBeLessThanOrEqual(window.innerHeight + 1)
    const main = document.querySelector("main") as HTMLElement
    expect(main.scrollHeight).toBeGreaterThan(main.clientHeight)
  })

  it("opens the navigation on a phone", async () => {
    await page.viewport(375, 812)
    await render(<DashboardTemplate title="Orders" />)
    await userEvent.click(page.getByRole("button", { name: "Open navigation" }))
    await expect.element(page.getByRole("dialog", { name: "Main navigation" })).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await page.viewport(1280, 800)
  })

  it("passes axe", async () => {
    await render(<DashboardTemplate title="Orders" description="This month" activeHref="/orders" />)
    await expectNoA11yViolations()
  })
})
