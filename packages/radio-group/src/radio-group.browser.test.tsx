import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

describe("RadioGroup", () => {
  it("uses the native radio pattern: one tab stop, arrows select and wrap", async () => {
    const onValueChange = vi.fn()
    await render(
      <RadioGroup defaultValue="free" name="plan" onValueChange={onValueChange} aria-label="Plan">
        <RadioGroupItem value="free" label="Free" />
        <RadioGroupItem value="pro" label="Pro" />
        <RadioGroupItem value="team" label="Team" />
      </RadioGroup>
    )
    await expectNoA11yViolations()
    await page.getByRole("radio", { name: "Free" }).element().focus()
    await userEvent.keyboard("{ArrowDown}")
    expect(onValueChange).toHaveBeenLastCalledWith("pro")
    await expect.element(page.getByRole("radio", { name: "Pro" })).toBeChecked()
    await userEvent.keyboard("{ArrowUp}")
    await expect.element(page.getByRole("radio", { name: "Free" })).toBeChecked()
    await userEvent.keyboard("{ArrowUp}")
    await expect.element(page.getByRole("radio", { name: "Team" })).toBeChecked()
  })

  it("submits the selected value with a native form", async () => {
    const onSubmit = vi.fn((e: SubmitEvent) => e.preventDefault())
    await render(
      <form onSubmit={onSubmit}>
        <RadioGroup defaultValue="free" name="plan" aria-label="Plan">
          <RadioGroupItem value="free" label="Free" />
          <RadioGroupItem value="pro" label="Pro" />
        </RadioGroup>
      </form>
    )
    expect(new FormData(document.querySelector("form")!).get("plan")).toBe("free")
    await page.getByRole("radio", { name: "Pro" }).element().focus()
    await userEvent.keyboard("{Space}")
    expect(new FormData(document.querySelector("form")!).get("plan")).toBe("pro")
  })
})
