import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./dialog"
import { Button } from "../../button/src/button"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

function Basic(props: { closeOnOutsideClick?: boolean; onOpenChange?: (open: boolean) => void; open?: boolean }) {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>Make changes to your profile.</DialogDescription>
        <input aria-label="Name" />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const dialogEl = () => document.querySelector("dialog")
// A closed <dialog> stays in the DOM (the component keeps it mounted), so check its open state.
const dialogOpen = () => !!dialogEl()?.open

describe("Dialog", () => {
  it("opens as a modal, names itself by its title and moves focus inside", async () => {
    await render(<Basic />)
    await userEvent.click(page.getByRole("button", { name: "Edit profile" }))

    const dialog = page.getByRole("dialog", { name: "Edit profile" })
    await expect.element(dialog).toBeVisible()
    await expect.element(dialog).toHaveAccessibleDescription("Make changes to your profile.")
    expect(dialogEl()?.matches(":modal")).toBe(true)
    expect(dialogEl()?.contains(document.activeElement)).toBe(true)
    await expectNoA11yViolations()
  })

  it("closes on Escape and returns focus to the trigger", async () => {
    await render(<Basic />)
    const trigger = page.getByRole("button", { name: "Edit profile" })
    await userEvent.click(trigger)
    await expect.poll(dialogOpen).toBe(true)
    await expect.element(page.getByRole("dialog"))

    await userEvent.keyboard("{Escape}")
    await expect.poll(dialogOpen).toBe(false)
    await expect.element(trigger).toHaveFocus()
  })

  it("closes from the Cancel button", async () => {
    await render(<Basic />)
    await userEvent.click(page.getByRole("button", { name: "Edit profile" }))
    await userEvent.click(page.getByRole("button", { name: "Cancel" }))
    await expect.poll(dialogOpen).toBe(false)
  })

  it("closes on a backdrop click by default", async () => {
    await render(<Basic />)
    await userEvent.click(page.getByRole("button", { name: "Edit profile" }))
    await expect.poll(dialogOpen).toBe(true)
    await expect.element(page.getByRole("dialog"))
    // A point outside the dialog box lands on the backdrop, which belongs to the <dialog> element.
    await userEvent.click(document.body, { position: { x: 4, y: 4 } })
    await expect.poll(dialogOpen).toBe(false)
  })

  it("stays open on a backdrop click when closeOnOutsideClick is false, and reports Escape", async () => {
    const onOpenChange = vi.fn()
    await render(<Basic closeOnOutsideClick={false} onOpenChange={onOpenChange} />)
    await userEvent.click(page.getByRole("button", { name: "Edit profile" }))
    await expect.poll(dialogOpen).toBe(true)
    await expect.element(page.getByRole("dialog"))

    await userEvent.click(document.body, { position: { x: 4, y: 4 } })
    await expect.poll(dialogOpen).toBe(true)
    await expect.element(page.getByRole("dialog"))
    expect(onOpenChange).not.toHaveBeenCalledWith(false)

    await userEvent.keyboard("{Escape}")
    await expect.poll(dialogOpen).toBe(false)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("is fully controlled by the open prop", async () => {
    const screen = await render(<Basic open={false} />)
    expect(dialogEl()?.open).toBe(false)
    await screen.rerender(<Basic open />)
    await expect.poll(dialogOpen).toBe(true)
    await expect.element(page.getByRole("dialog"))
  })
})
