import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { Calendar } from "./calendar"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

const focused = () => (document.activeElement as HTMLElement | null)?.dataset.iso
const tabStops = () => Array.from(document.querySelectorAll<HTMLElement>('[role="grid"] [data-iso][tabindex="0"]'))
const heading = () => document.querySelector('[role="grid"]')?.getAttribute("aria-labelledby")
const headingText = () => document.getElementById(heading() ?? "")?.textContent?.trim()

describe("Calendar: grid and focus", () => {
  it("is a grid named by its month heading, with column headers and one tab stop", async () => {
    await render(<Calendar month="2026-11" value="2026-11-09" />)
    const grid = page.getByRole("grid", { name: "November 2026" }).element()
    expect(grid).toBeTruthy()
    expect(grid.querySelectorAll('[role="columnheader"]').length).toBe(7)
    expect(tabStops().length).toBe(1)
    expect(tabStops()[0].dataset.iso).toBe("2026-11-09")
    await expectNoA11yViolations()
  })

  it("selected and today's cells expose aria-selected and aria-current", async () => {
    await render(<Calendar month="2026-11" value="2026-11-09" />)
    const cell = document.querySelector('[role="gridcell"][aria-selected="true"]')
    expect(cell?.querySelector("button")?.dataset.iso).toBe("2026-11-09")
  })

  it("arrows, Home, End, PageUp and PageDown move focus; crossing a month changes the heading", async () => {
    await render(<Calendar defaultMonth="2026-11" value="2026-11-09" />)
    tabStops()[0].focus()
    await userEvent.keyboard("{ArrowRight}")
    expect(focused()).toBe("2026-11-10")
    await userEvent.keyboard("{ArrowDown}")
    expect(focused()).toBe("2026-11-17")
    await userEvent.keyboard("{Home}")
    // 2026-11-01 is a Sunday; the week starts on Sunday (en-US): Home stays on the week's first day.
    expect(focused()).toBe("2026-11-15")
    await userEvent.keyboard("{End}")
    expect(focused()).toBe("2026-11-21")
    await userEvent.keyboard("{PageDown}")
    expect(focused()).toBe("2026-12-21")
    await expect.poll(headingText).toMatch(/December/)
    await userEvent.keyboard("{Shift>}{PageUp}{/Shift}")
    expect(focused()).toBe("2025-12-21")
  })

  it("ArrowLeft from the first day of the month moves into the previous month and shows it", async () => {
    await render(<Calendar defaultMonth="2026-11" value="2026-11-01" />)
    tabStops()[0].focus()
    await userEvent.keyboard("{ArrowLeft}")
    expect(focused()).toBe("2026-10-31")
    await expect.poll(headingText).toMatch(/October/)
  })

  it("moves the visible month with the next and previous buttons", async () => {
    await render(<Calendar defaultMonth="2026-11" />)
    await userEvent.click(page.getByRole("button", { name: "Next month" }))
    await expect.poll(headingText).toMatch(/diciembre|December/)
    await userEvent.click(page.getByRole("button", { name: "Previous month" }))
    await expect.poll(headingText).toMatch(/November|noviembre/)
  })
})

describe("Calendar: min, max and disabled days", () => {
  it("min blocks the previous month button and keeps days before min unselectable", async () => {
    const onChange = vi.fn()
    await render(<Calendar month="2026-11" min="2026-11-05" value={null} onChange={onChange} />)
    await expect.element(page.getByRole("button", { name: "Previous month" })).toBeDisabled()
    // aria-disabled days are not actionable for the user; a plain click must not select them.
    ;(page.getByRole("button", { name: /November 3, 2026/ }).element() as HTMLElement).click()
    expect(onChange).not.toHaveBeenCalled()
  })

  it("max blocks the next month button", async () => {
    await render(<Calendar month="2026-11" max="2026-11-20" />)
    await expect.element(page.getByRole("button", { name: "Next month" })).toBeDisabled()
  })

  it("isDateDisabled days can receive focus but cannot be selected", async () => {
    const onChange = vi.fn()
    await render(<Calendar month="2026-11" value={null} onChange={onChange} isDateDisabled={(iso) => iso === "2026-11-10"} />)
    const disabled = page.getByRole("button", { name: /November 10, 2026/ }).element() as HTMLElement
    expect(disabled.getAttribute("aria-disabled")).toBe("true")
    disabled.focus()
    expect(document.activeElement).toBe(disabled)
    disabled.click()
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe("Calendar: selection", () => {
  it("single: clicking the selected day again keeps it, unless allowDeselect", async () => {
    const onChange = vi.fn()
    await render(<Calendar month="2026-11" value="2026-11-09" onChange={onChange} />)
    await userEvent.click(page.getByRole("button", { name: /November 9, 2026/ }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it("range: the second pick sets to, and a pick before from swaps them", async () => {
    const onChange = vi.fn()
    await render(<Calendar mode="range" month="2026-11" defaultValue={{ from: null, to: null }} onChange={onChange} />)
    await userEvent.click(page.getByRole("button", { name: /November 9, 2026/ }))
    expect(onChange).toHaveBeenLastCalledWith({ from: "2026-11-09", to: null })
    await userEvent.click(page.getByRole("button", { name: /November 3, 2026/ }))
    expect(onChange).toHaveBeenLastCalledWith({ from: "2026-11-03", to: "2026-11-09" })
  })

  it("range: a new first pick clears to", async () => {
    const onChange = vi.fn()
    await render(<Calendar mode="range" month="2026-11" value={{ from: "2026-11-03", to: "2026-11-09" }} onChange={onChange} />)
    await userEvent.click(page.getByRole("button", { name: /November 12, 2026/ }))
    expect(onChange).toHaveBeenLastCalledWith({ from: "2026-11-12", to: null })
  })

  it("the Spanish locale starts the week on Monday and names months in Spanish", async () => {
    await render(<Calendar month="2026-11" locale="es-ES" />)
    const headers = Array.from(document.querySelectorAll('[role="columnheader"]')).map((th) => th.getAttribute("aria-label"))
    expect(headers[0]?.toLowerCase()).toBe("lunes")
    expect(headingText()?.toLowerCase()).toContain("noviembre")
    await expectNoA11yViolations()
  })
})
