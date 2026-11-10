import { beforeEach, describe, expect, it } from "vitest"
import { render } from "vitest-browser-react"
import { page } from "vitest/browser"
import { DetailPageTemplate } from "./detail-page-template"
import { expectNoA11yViolations } from "../../tests/browser/a11y"

describe("DetailPageTemplate", () => {
  beforeEach(async () => {
    await page.viewport(1280, 800)
  })

  it("renders a back link, the title and the aside card", async () => {
    await render(
      <DetailPageTemplate title="Order 1042" backHref="/orders" aside={<p>Paid on Nov 2</p>}>
        <p>Line items</p>
      </DetailPageTemplate>
    )
    await expect.element(page.getByRole("link", { name: "← Back" })).toHaveAttribute("href", "/orders")
    await expect.element(page.getByRole("heading", { level: 1, name: "Order 1042" })).toBeInTheDocument()
    await expect.element(page.getByRole("heading", { level: 2, name: "Details" })).toBeInTheDocument()
    await expect.element(page.getByText("Paid on Nov 2")).toBeInTheDocument()
    expect(document.querySelector('aside[data-slot="aside"]')?.getAttribute("data-scroll")).toBe("fixed")
  })

  it("passes axe", async () => {
    await render(<DetailPageTemplate title="Order 1042" backHref="/orders" aside={<p>Paid</p>}>Lines</DetailPageTemplate>)
    await expectNoA11yViolations()
  })
})
