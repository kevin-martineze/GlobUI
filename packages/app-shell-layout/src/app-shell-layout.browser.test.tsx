import { beforeEach, describe, expect, it } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { AppShellLayout } from "./app-shell-layout"
import { LayoutNavTrigger, useLayoutScroll } from "@glob-ui/layout"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@glob-ui/dialog"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

const LONG = Array.from({ length: 60 }, (_, i) => <p key={i}>Row {i}</p>)

function Shell({ tall = true }: { tall?: boolean }) {
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
          <a href="#orders" aria-current="page">Orders</a>
          <a href="#customers">Customers</a>
        </>
      }
    >
      <h2>Orders</h2>
      {tall ? LONG : null}
    </AppShellLayout>
  )
}

function Probe() {
  const el = useLayoutScroll()
  return <span data-testid="probe">{el ? el.tagName : "none"}</span>
}

const main = () => document.querySelector("main") as HTMLElement
const docScroll = () => document.scrollingElement as HTMLElement

describe("AppShellLayout", () => {
  beforeEach(async () => {
    await page.viewport(1280, 800)
  })

  it("never scrolls the viewport: only the main region scrolls", async () => {
    await render(<Shell />)
    expect(docScroll().scrollHeight).toBeLessThanOrEqual(window.innerHeight + 1)
    expect(main().scrollHeight).toBeGreaterThan(main().clientHeight)
    main().scrollTop = 200
    expect(main().scrollTop).toBeGreaterThan(0)
    expect(docScroll().scrollTop).toBe(0)
  })

  it("declares each slot's scroll behaviour in the DOM", async () => {
    await render(<Shell />)
    expect(document.querySelector('[data-slot="header"]')?.getAttribute("data-scroll")).toBe("fixed")
    expect(document.querySelector('[data-slot="sidebar"]')?.getAttribute("data-scroll")).toBe("fixed")
    expect(document.querySelector('[data-slot="sidebar-list"]')?.getAttribute("data-scroll")).toBe("scroll")
    expect(main().getAttribute("data-scroll")).toBe("scroll")
  })

  it("has the banner, the navigation and the main landmarks", async () => {
    await render(<Shell />)
    await expect.element(page.getByRole("banner")).toBeInTheDocument()
    await expect.element(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible()
    await expect.element(page.getByRole("main")).toBeInTheDocument()
  })

  it("moves focus to main from the skip link", async () => {
    await render(<Shell />)
    const skip = page.getByRole("link", { name: "Skip to content" })
    ;(skip.element() as HTMLElement).focus()
    await userEvent.keyboard("{Enter}")
    expect(document.activeElement).toBe(main())
  })

  it("gives useLayoutScroll the main region", async () => {
    await render(
      <AppShellLayout>
        <Probe />
      </AppShellLayout>
    )
    await expect.element(page.getByTestId("probe")).toHaveTextContent("MAIN")
  })

  it("keeps a dialog opened inside main from moving main's scroll position", async () => {
    await render(
      <AppShellLayout>
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Note</DialogTitle>
          </DialogContent>
        </Dialog>
        {LONG}
      </AppShellLayout>
    )
    main().scrollTop = 300
    const before = main().scrollTop
    // A click from Playwright would scroll the trigger into view first, which is not what this test checks.
    ;(page.getByRole("button", { name: "Open" }).element() as HTMLElement).click()
    await expect.element(page.getByRole("dialog", { name: "Note" })).toBeVisible()
    expect(main().scrollTop).toBe(before)
    await userEvent.keyboard("{Escape}")
  })

  it("at 375px hides the inline sidebar and opens the navigation in a Sheet", async () => {
    await page.viewport(375, 812)
    await render(<Shell />)
    const trigger = page.getByRole("button", { name: "Open navigation" })
    await expect.element(trigger).toBeVisible()
    expect(getComputedStyle(document.querySelector('[data-slot="sidebar"]') as HTMLElement).display).toBe("none")
    await userEvent.click(trigger)
    const dialog = document.querySelector("dialog") as HTMLDialogElement
    expect(dialog.open).toBe(true)
    expect(dialog.contains(document.activeElement)).toBe(true)
    await userEvent.keyboard("{Escape}")
    expect(document.activeElement).toBe(page.getByRole("button", { name: "Open navigation" }).element())
    await userEvent.click(page.getByRole("button", { name: "Open navigation" }))
    await userEvent.click(page.getByRole("link", { name: "Customers" }))
    expect(dialog.open).toBe(false)
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(375)
  })

  it("passes axe", async () => {
    await render(<Shell />)
    await expectNoA11yViolations()
  })
})
