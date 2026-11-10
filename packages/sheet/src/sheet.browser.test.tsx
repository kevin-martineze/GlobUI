import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "./sheet"
import { Button } from "../../button/src/button"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

function Basic(props: { side?: "right" | "left" | "top" | "bottom" }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open settings</Button>
      </SheetTrigger>
      <SheetContent side={props.side}>
        <SheetTitle>Settings</SheetTitle>
        <SheetDescription>Change how the app looks.</SheetDescription>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="ghost">Done</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const dialogEl = () => document.querySelector("dialog")
const isOpen = () => !!dialogEl()?.open

describe("Sheet", () => {
  it("opens as a modal, named by its title, with focus inside", async () => {
    await render(<Basic />)
    await userEvent.click(page.getByRole("button", { name: "Open settings" }))
    const dialog = page.getByRole("dialog", { name: "Settings" })
    await expect.element(dialog).toBeVisible()
    await expect.element(dialog).toHaveAccessibleDescription("Change how the app looks.")
    expect(dialogEl()?.matches(":modal")).toBe(true)
    expect(dialogEl()?.contains(document.activeElement)).toBe(true)
    await expectNoA11yViolations()
  })

  it("closes on Escape and returns focus to the trigger", async () => {
    await render(<Basic />)
    const trigger = page.getByRole("button", { name: "Open settings" })
    await userEvent.click(trigger)
    await expect.poll(isOpen).toBe(true)
    await userEvent.keyboard("{Escape}")
    await expect.poll(isOpen).toBe(false)
    expect(document.activeElement).toBe(trigger.element())
  })

  it("closes on a backdrop click", async () => {
    await render(<Basic />)
    await userEvent.click(page.getByRole("button", { name: "Open settings" }))
    await expect.poll(isOpen).toBe(true)
    // The sheet is on the right: a point on the left lands on the backdrop.
    await userEvent.click(document.body, { position: { x: 4, y: 4 } })
    await expect.poll(isOpen).toBe(false)
  })

  it("pins a left sheet to the left edge", async () => {
    await render(<Basic side="left" />)
    await userEvent.click(page.getByRole("button", { name: "Open settings" }))
    await expect.poll(isOpen).toBe(true)
    await expect.poll(() => Math.round(dialogEl()!.getBoundingClientRect().x)).toBe(0)
  })

  it("has no axe violations when open", async () => {
    await render(<Basic />)
    await userEvent.click(page.getByRole("button", { name: "Open settings" }))
    await expect.element(page.getByRole("dialog", { name: "Settings" })).toBeVisible()
    await expectNoA11yViolations()
  })
})
