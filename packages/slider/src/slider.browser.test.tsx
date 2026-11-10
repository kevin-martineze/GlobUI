import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { Slider } from "./slider"
import { Field } from "../../field/src/field"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

describe("Slider", () => {
  it("moves with the arrow keys, Home, End and PageUp, and reports each value", async () => {
    const onValueChange = vi.fn()
    await render(<Slider aria-label="Volume" defaultValue={50} onValueChange={onValueChange} />)
    const slider = page.getByRole("slider", { name: "Volume" })
    await slider.click()
    const input = slider.element() as HTMLInputElement
    input.focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(input.value).toBe("51")
    await userEvent.keyboard("{Home}")
    expect(input.value).toBe("0")
    await userEvent.keyboard("{End}")
    expect(input.value).toBe("100")
    await userEvent.keyboard("{PageDown}")
    expect(input.value).toBe("90")
    expect(onValueChange).toHaveBeenLastCalledWith(90)
  })

  it("is controlled when value is passed", async () => {
    const onValueChange = vi.fn()
    await render(<Slider aria-label="Fixed" value={20} onValueChange={onValueChange} />)
    const input = page.getByRole("slider", { name: "Fixed" }).element() as HTMLInputElement
    input.focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(onValueChange).toHaveBeenCalledWith(21)
    expect(input.value).toBe("20")
  })

  it("sets the fill variable from the value", async () => {
    await render(<Slider aria-label="Fill" min={0} max={200} value={50} />)
    const input = page.getByRole("slider", { name: "Fill" }).element() as HTMLInputElement
    expect(input.style.getPropertyValue("--glob-slider-fill")).toBe("25%")
  })

  it("is named by a Field label and passes axe", async () => {
    await render(
      <Field label="Brightness" description="Between 0 and 100">
        <Slider />
      </Field>
    )
    await expect.element(page.getByRole("slider", { name: "Brightness" })).toBeInTheDocument()
    await expectNoA11yViolations()
  })
})
