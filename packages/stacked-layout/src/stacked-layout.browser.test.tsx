import { beforeEach, describe, expect, it } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { StackedLayout } from "./stacked-layout"
import { LayoutNavTrigger, useLayoutScroll } from "@glob-ui/layout"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

function Probe() {
  const el = useLayoutScroll()
  return <span data-testid="probe">{el ? el.tagName : "none"}</span>
}

const TALL = Array.from({ length: 80 }, (_, i) => <p key={i}>Paragraph {i}</p>)

describe("StackedLayout", () => {
  beforeEach(async () => {
    await page.viewport(1280, 800)
  })

  it("scrolls the document and keeps the header in view", async () => {
    await render(
      <StackedLayout header={<strong>Docs</strong>} footer={<span>Footer</span>}>
        {TALL}
      </StackedLayout>
    )
    expect(document.documentElement.scrollHeight).toBeGreaterThan(window.innerHeight)
    window.scrollTo(0, 400)
    await new Promise((r) => setTimeout(r, 50))
    const header = document.querySelector("header") as HTMLElement
    expect(window.scrollY).toBeGreaterThan(0)
    expect(Math.round(header.getBoundingClientRect().top)).toBe(0)
    window.scrollTo(0, 0)
  })

  it("gives useLayoutScroll the document scrolling element", async () => {
    await render(
      <StackedLayout>
        <Probe />
      </StackedLayout>
    )
    await expect.element(page.getByTestId("probe")).toHaveTextContent("HTML")
  })

  it("has a skip link that moves focus to main", async () => {
    await render(<StackedLayout header={<span>Nav</span>}>{TALL}</StackedLayout>)
    ;(page.getByRole("link", { name: "Skip to content" }).element() as HTMLElement).focus()
    await userEvent.keyboard("{Enter}")
    expect(document.activeElement).toBe(document.querySelector("main"))
  })

  it("at 375px opens the mobile navigation from the header trigger", async () => {
    await page.viewport(375, 812)
    await render(
      <StackedLayout header={<LayoutNavTrigger />} mobileNav={<a href="#docs">Docs</a>} navLabel="Site">
        {TALL}
      </StackedLayout>
    )
    await userEvent.click(page.getByRole("button", { name: "Open navigation" }))
    const dialog = document.querySelector("dialog") as HTMLDialogElement
    expect(dialog.open).toBe(true)
    await userEvent.keyboard("{Escape}")
    expect(dialog.open).toBe(false)
    await page.viewport(1280, 800)
  })

  it("passes axe", async () => {
    await render(<StackedLayout header={<strong>Docs</strong>}>{TALL}</StackedLayout>)
    await expectNoA11yViolations()
  })
})
