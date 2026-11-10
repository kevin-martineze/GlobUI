import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { Switch } from "./switch"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

describe("Switch", () => {
  it("toggles uncontrolled and reports changes", async () => {
    const onCheckedChange = vi.fn()
    await render(<Switch aria-label="Notifications" onCheckedChange={onCheckedChange} />)
    const sw = page.getByRole("switch", { name: "Notifications" })
    await expect.element(sw).toHaveAttribute("aria-checked", "false")

    await userEvent.click(sw)
    await expect.element(sw).toHaveAttribute("aria-checked", "true")
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    await expectNoA11yViolations()
  })

  it("stays on the controlled value until the parent updates it", async () => {
    const onCheckedChange = vi.fn()
    await render(<Switch aria-label="Controlled" checked={false} onCheckedChange={onCheckedChange} />)
    const sw = page.getByRole("switch", { name: "Controlled" })
    await userEvent.click(sw)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    await expect.element(sw).toHaveAttribute("aria-checked", "false")
  })

  it("submits a hidden input only while on", async () => {
    await render(<Switch aria-label="Marketing" name="marketing" value="yes" defaultChecked={false} />)
    const sw = page.getByRole("switch", { name: "Marketing" })
    expect(document.querySelector('input[name="marketing"]')).toBeNull()

    await userEvent.click(sw)
    const hidden = document.querySelector<HTMLInputElement>('input[name="marketing"]')
    expect(hidden?.value).toBe("yes")
  })
})
