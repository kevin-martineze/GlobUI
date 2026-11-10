import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { Segmented } from "./segmented"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

const OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month", disabled: true },
  { value: "year", label: "Year" },
]

const radio = (name: string) => page.getByRole("radio", { name })
const checked = () => document.querySelector('[role="radio"][aria-checked="true"]')?.textContent?.trim()

describe("Segmented (radio group)", () => {
  it("is a radiogroup of radios with one tab stop on the checked option", async () => {
    await render(<Segmented options={OPTIONS} defaultValue="week" aria-label="Range" />)
    await expect.element(page.getByRole("radiogroup", { name: "Range" })).toBeVisible()
    await expect.element(radio("Week")).toHaveAttribute("aria-checked", "true")
    await expect.element(radio("Week")).toHaveAttribute("tabindex", "0")
    await expect.element(radio("Day")).toHaveAttribute("tabindex", "-1")
    await expectNoA11yViolations()
  })

  it("arrows move focus and select, skipping the disabled option, and wrap around", async () => {
    const onChange = vi.fn()
    await render(<Segmented options={OPTIONS} defaultValue="day" onChange={onChange} aria-label="Range" />)
    await radio("Day").element().focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(checked()).toBe("Week")
    expect(onChange).toHaveBeenLastCalledWith("week")
    await userEvent.keyboard("{ArrowRight}")
    expect(checked()).toBe("Year")
    await userEvent.keyboard("{ArrowRight}")
    expect(checked()).toBe("Day")
    await userEvent.keyboard("{ArrowLeft}")
    expect(checked()).toBe("Year")
  })

  it("Home and End are not used by the radio pattern here, but arrows always are", async () => {
    await render(<Segmented options={OPTIONS} defaultValue="week" aria-label="Range" />)
    await radio("Week").element().focus()
    await userEvent.keyboard("{ArrowDown}")
    expect(checked()).toBe("Year")
  })

  it("submits the checked value with a native form", async () => {
    const onSubmit = vi.fn((e: SubmitEvent) => e.preventDefault())
    await render(
      <form onSubmit={onSubmit}>
        <Segmented name="range" options={OPTIONS} defaultValue="week" aria-label="Range" />
      </form>
    )
    expect(new FormData(document.querySelector("form")!).get("range")).toBe("week")
    await radio("Year").element().focus()
    await userEvent.keyboard("{Space}")
    expect(new FormData(document.querySelector("form")!).get("range")).toBe("year")
  })
})
