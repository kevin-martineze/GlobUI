import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { useState } from "react"
import { DatePicker, type DatePickerProps } from "./date-picker"
import { Field } from "../../field/src/field"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

const isOpen = () => !!document.querySelector('[role="dialog"]:popover-open')
const trigger = () => page.getByRole("button", { name: /Due date/ }).element() as HTMLElement
const hidden = (name: string) => document.querySelector<HTMLInputElement>(`input[type="hidden"][name="${name}"]`)?.value

function Single(props: Partial<DatePickerProps> & { value?: string | null }) {
  const [value, setValue] = useState<string | null>(props.value ?? null)
  return (
    <Field label="Due date">
      <DatePicker
        locale="en-US"
        name="due"
        {...props}
        mode="single"
        value={value}
        onChange={(v) => {
          setValue(v)
          props.onChange?.(v)
        }}
      />
    </Field>
  )
}

describe("DatePicker: single", () => {
  it("is named by its Field label, shows the formatted value, and passes axe closed and open", async () => {
    await render(<Single value="2026-11-09" />)
    await expect.element(page.getByRole("button", { name: /Due date/ })).toHaveTextContent("Nov 9, 2026")
    await expectNoA11yViolations()
    await userEvent.click(trigger())
    await expect.poll(isOpen).toBe(true)
    await expectNoA11yViolations()
  })

  it("opens on click with focus on the selected day", async () => {
    await render(<Single value="2026-11-09" />)
    await userEvent.click(trigger())
    await expect.poll(() => document.activeElement?.getAttribute("data-iso")).toBe("2026-11-09")
  })

  it("Enter selects the focused day, closes the picker and returns focus to the trigger", async () => {
    const onChange = vi.fn()
    await render(<Single value="2026-11-09" onChange={onChange} />)
    await userEvent.click(trigger())
    await expect.poll(() => document.activeElement?.getAttribute("data-iso")).toBe("2026-11-09")
    await userEvent.keyboard("{ArrowRight}{Enter}")
    expect(onChange).toHaveBeenLastCalledWith("2026-11-10")
    await expect.poll(isOpen).toBe(false)
    expect(document.activeElement).toBe(trigger())
    expect(hidden("due")).toBe("2026-11-10")
  })

  it("Escape closes the picker and returns focus to the trigger", async () => {
    await render(<Single value="2026-11-09" />)
    await userEvent.click(trigger())
    await expect.poll(isOpen).toBe(true)
    await userEvent.keyboard("{Escape}")
    await expect.poll(isOpen).toBe(false)
    expect(document.activeElement).toBe(trigger())
  })

  it("the clear button empties the value and the hidden input, and is not inside the trigger", async () => {
    const onChange = vi.fn()
    await render(<Single value="2026-11-09" onChange={onChange} />)
    expect(trigger().querySelector("button")).toBeNull()
    await userEvent.click(page.getByRole("button", { name: "Clear date" }))
    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(hidden("due")).toBe("")
  })

  it("the hidden input holds the ISO date", async () => {
    await render(<Single value="2026-03-08" />)
    expect(hidden("due")).toBe("2026-03-08")
  })
})

describe("DatePicker: range", () => {
  function Range(props: { onChange?: (r: { from: string | null; to: string | null }) => void; presets?: DatePickerProps["presets"] }) {
    const [value, setValue] = useState<{ from: string | null; to: string | null }>({ from: null, to: null })
    return (
      <Field label="Due date">
        <DatePicker
          mode="range"
          locale="en-US"
          name="stay"
          presets={props.presets}
          value={value}
          onChange={(r) => {
            setValue(r)
            props.onChange?.(r)
          }}
        />
      </Field>
    )
  }

  it("shows two months, closes after the second pick, and writes an ISO interval", async () => {
    const onChange = vi.fn()
    await render(<Range onChange={onChange} />)
    await userEvent.click(trigger())
    await expect.poll(isOpen).toBe(true)
    expect(document.querySelectorAll('[role="grid"]').length).toBe(2)
    await userEvent.click(page.getByRole("button", { name: /November 3, 2026/ }))
    expect(isOpen()).toBe(true)
    await userEvent.click(page.getByRole("button", { name: /November 9, 2026/ }))
    await expect.poll(isOpen).toBe(false)
    expect(onChange).toHaveBeenLastCalledWith({ from: "2026-11-03", to: "2026-11-09" })
    expect(hidden("stay")).toBe("2026-11-03/2026-11-09")
    expect(trigger().textContent).toContain("Nov 3 – 9, 2026")
  })

  it("the hidden input is empty while the range is incomplete", async () => {
    await render(<Range />)
    await userEvent.click(trigger())
    await userEvent.click(page.getByRole("button", { name: /November 3, 2026/ }))
    expect(hidden("stay")).toBe("")
  })

  it("a preset selects its range and closes the picker", async () => {
    const onChange = vi.fn()
    await render(<Range onChange={onChange} presets={[{ label: "Last 7 days", value: { from: "2026-11-03", to: "2026-11-09" } }]} />)
    await userEvent.click(trigger())
    await userEvent.click(page.getByRole("button", { name: "Last 7 days" }))
    expect(onChange).toHaveBeenLastCalledWith({ from: "2026-11-03", to: "2026-11-09" })
    await expect.poll(isOpen).toBe(false)
  })
})
