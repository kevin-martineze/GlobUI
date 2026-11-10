import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { Checkbox } from "./checkbox"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

describe("Checkbox", () => {
  it("shows the indeterminate state and clears it on click", async () => {
    await render(<Checkbox indeterminate label="Select all" />)
    const box = page.getByRole("checkbox", { name: "Select all" })
    expect((box.element() as HTMLInputElement).indeterminate).toBe(true)

    await userEvent.click(box)
    expect((box.element() as HTMLInputElement).indeterminate).toBe(false)
    expect((box.element() as HTMLInputElement).checked).toBe(true)
    await expectNoA11yViolations()
  })

  it("toggles with the keyboard (Space)", async () => {
    await render(<Checkbox label="Accept" />)
    const box = page.getByRole("checkbox", { name: "Accept" })
    await box.element().focus()
    await userEvent.keyboard(" ")
    await expect.element(box).toBeChecked()
    await userEvent.keyboard(" ")
    await expect.element(box).not.toBeChecked()
  })
})
