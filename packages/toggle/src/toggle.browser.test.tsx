import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { Toggle, ToggleGroup, ToggleGroupItem } from "./toggle"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

describe("Toggle", () => {
  it("flips aria-pressed on click and reports the change", async () => {
    const onPressedChange = vi.fn()
    await render(<Toggle aria-label="Bold" onPressedChange={onPressedChange}>B</Toggle>)
    const toggle = page.getByRole("button", { name: "Bold" })
    await expect.element(toggle).toHaveAttribute("aria-pressed", "false")
    await userEvent.click(toggle)
    await expect.element(toggle).toHaveAttribute("aria-pressed", "true")
    expect(onPressedChange).toHaveBeenCalledWith(true)
    await expectNoA11yViolations()
  })
})

describe("ToggleGroup", () => {
  it("single: pressing one item releases the other, and pressing it again clears the choice", async () => {
    const onValueChange = vi.fn()
    await render(
      <ToggleGroup type="single" aria-label="Align" onValueChange={onValueChange}>
        <ToggleGroupItem value="left" aria-label="Left">L</ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Center">C</ToggleGroupItem>
      </ToggleGroup>
    )
    await userEvent.click(page.getByRole("button", { name: "Left" }))
    await expect.element(page.getByRole("button", { name: "Left" })).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(page.getByRole("button", { name: "Center" }))
    await expect.element(page.getByRole("button", { name: "Left" })).toHaveAttribute("aria-pressed", "false")
    expect(onValueChange).toHaveBeenLastCalledWith("center")
    await userEvent.click(page.getByRole("button", { name: "Center" }))
    expect(onValueChange).toHaveBeenLastCalledWith("")
    await expectNoA11yViolations()
  })

  it("multiple: several items stay pressed", async () => {
    const onValueChange = vi.fn()
    await render(
      <ToggleGroup type="multiple" aria-label="Styles" onValueChange={onValueChange}>
        <ToggleGroupItem value="b" aria-label="Bold">B</ToggleGroupItem>
        <ToggleGroupItem value="i" aria-label="Italic">I</ToggleGroupItem>
      </ToggleGroup>
    )
    await userEvent.click(page.getByRole("button", { name: "Bold" }))
    await userEvent.click(page.getByRole("button", { name: "Italic" }))
    expect(onValueChange).toHaveBeenLastCalledWith(["b", "i"])
    await expect.element(page.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true")
    await expect.element(page.getByRole("button", { name: "Italic" })).toHaveAttribute("aria-pressed", "true")
  })

  it("arrows move focus, skip a disabled item, and Tab leaves the group", async () => {
    await render(
      <div>
        <button>Before</button>
        <ToggleGroup type="single" aria-label="Views">
          <ToggleGroupItem value="a" aria-label="A">A</ToggleGroupItem>
          <ToggleGroupItem value="b" aria-label="B" disabled>B</ToggleGroupItem>
          <ToggleGroupItem value="c" aria-label="C">C</ToggleGroupItem>
        </ToggleGroup>
        <button>After</button>
      </div>
    )
    await userEvent.click(page.getByRole("button", { name: "Before" }))
    await userEvent.tab()
    expect(document.activeElement?.textContent).toBe("A")
    await userEvent.keyboard("{ArrowRight}")
    expect(document.activeElement?.textContent).toBe("C")
    await userEvent.tab()
    expect(document.activeElement?.textContent).toBe("After")
  })
  it("keeps value props off the DOM and calls the consumer's onKeyDown and onFocus", async () => {
    const onKeyDown = vi.fn()
    const onFocus = vi.fn()
    await render(
      <ToggleGroup type="single" aria-label="Align" defaultValue="left" onValueChange={() => {}} onKeyDown={onKeyDown} onFocus={onFocus}>
        <ToggleGroupItem value="left" aria-label="Left">L</ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Center">C</ToggleGroupItem>
      </ToggleGroup>
    )
    const group = page.getByRole("group", { name: "Align" })
    await expect.element(group).not.toHaveAttribute("value")
    await expect.element(group).not.toHaveAttribute("defaultvalue")
    await userEvent.keyboard("{Tab}")
    await expect.element(page.getByRole("button", { name: "Left" })).toHaveFocus()
    expect(onFocus).toHaveBeenCalled()
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(page.getByRole("button", { name: "Center" })).toHaveFocus()
    expect(onKeyDown).toHaveBeenCalled()
  })
})
