import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "./alert-dialog"
import { Button } from "../../button/src/button"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

function Delete(props: { onConfirm?: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="danger">Delete account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Delete your account?</AlertDialogTitle>
        <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="danger" onClick={props.onConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const dialogEl = () => document.querySelector("dialog")
const isOpen = () => !!dialogEl()?.open

describe("AlertDialog", () => {
  it("has role alertdialog, named and described, with no close icon", async () => {
    await render(<Delete />)
    await userEvent.click(page.getByRole("button", { name: "Delete account" }))
    const dialog = page.getByRole("alertdialog", { name: "Delete your account?" })
    await expect.element(dialog).toBeVisible()
    await expect.element(dialog).toHaveAccessibleDescription("This cannot be undone.")
    expect(page.getByRole("button", { name: "Close" }).elements()).toHaveLength(0)
    await expectNoA11yViolations()
  })

  it("starts focus on Cancel", async () => {
    await render(<Delete />)
    await userEvent.click(page.getByRole("button", { name: "Delete account" }))
    await expect.poll(isOpen).toBe(true)
    await expect.poll(() => document.activeElement?.textContent).toBe("Cancel")
  })

  it("does not close on a backdrop click", async () => {
    await render(<Delete />)
    await userEvent.click(page.getByRole("button", { name: "Delete account" }))
    await expect.poll(isOpen).toBe(true)
    await userEvent.click(document.body, { position: { x: 4, y: 4 } })
    await new Promise((r) => setTimeout(r, 50))
    expect(isOpen()).toBe(true)
  })

  it("closes on Escape", async () => {
    await render(<Delete />)
    await userEvent.click(page.getByRole("button", { name: "Delete account" }))
    await expect.poll(isOpen).toBe(true)
    await userEvent.keyboard("{Escape}")
    await expect.poll(isOpen).toBe(false)
  })

  it("the action closes it and calls onClick", async () => {
    const onConfirm = vi.fn()
    await render(<Delete onConfirm={onConfirm} />)
    await userEvent.click(page.getByRole("button", { name: "Delete account" }))
    await userEvent.click(page.getByRole("button", { name: "Delete" }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    await expect.poll(isOpen).toBe(false)
  })

  it("preventDefault in onClick keeps it open", async () => {
    await render(<Delete onConfirm={(e) => e.preventDefault()} />)
    await userEvent.click(page.getByRole("button", { name: "Delete account" }))
    await userEvent.click(page.getByRole("button", { name: "Delete" }))
    await new Promise((r) => setTimeout(r, 50))
    expect(isOpen()).toBe(true)
  })
})
