import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { MultiSelect } from "./multi-select"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

const TAGS = ["Design", "Code", "Docs", "Ops", "QA", "UX", "Data", "Sales", "Legal"].map((label) => ({
  value: label.toLowerCase(),
  label,
}))
const THREE = TAGS.slice(0, 3)

const combo = () => page.getByRole("combobox")
const listbox = () => document.querySelector<HTMLElement>('[role="listbox"]')
const isOpen = () => !!listbox()?.closest("[popover]")?.matches(":popover-open")
const activeOption = () => {
  const id = (document.activeElement as HTMLElement | null)?.getAttribute("aria-activedescendant")
  return id ? document.getElementById(id)?.textContent?.trim() : undefined
}
const optionState = (label: string) => {
  const opt = Array.from(document.querySelectorAll('[role="option"]')).find((o) => o.textContent?.trim() === label)
  return { selected: opt?.getAttribute("aria-selected"), disabled: opt?.getAttribute("aria-disabled") }
}
const hidden = (name: string) => Array.from(document.querySelectorAll<HTMLInputElement>(`input[type="hidden"][name="${name}"]`)).map((i) => i.value)

describe("MultiSelect: keyboard", () => {
  it("has the listbox ARIA and Enter/Space toggle options without closing", async () => {
    const onChange = vi.fn()
    await render(<MultiSelect options={THREE} value={[]} onChange={onChange} name="tags" aria-label="Tags" />)
    await combo().element().focus()
    await userEvent.keyboard("{Enter}")
    await expect.element(combo()).toHaveAttribute("aria-expanded", "true")
    expect(listbox()?.getAttribute("aria-multiselectable")).toBe("true")
    await expectNoA11yViolations()

    await userEvent.keyboard(" ")
    expect(onChange).toHaveBeenLastCalledWith(["design"])
    expect(isOpen()).toBe(true)
  })

  it("keeps the list open while several options are toggled, and Escape closes it", async () => {
    await render(<MultiSelect options={THREE} defaultValue={["design"]} name="tags" aria-label="Tags" />)
    await combo().element().focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{ArrowDown}{Enter}")
    await userEvent.keyboard("{ArrowDown}{Enter}")
    expect(hidden("tags")).toEqual(["design", "code", "docs"])
    expect(isOpen()).toBe(true)
    await userEvent.keyboard("{Escape}")
    expect(isOpen()).toBe(false)
  })

  it("moves with arrows and Home/End over the list", async () => {
    await render(<MultiSelect options={THREE} defaultValue={[]} name="tags" aria-label="Tags" />)
    await combo().element().focus()
    await userEvent.keyboard("{Enter}")
    expect(activeOption()).toBe("Design")
    await userEvent.keyboard("{End}")
    expect(activeOption()).toBe("Docs")
    await userEvent.keyboard("{Home}")
    expect(activeOption()).toBe("Design")
  })

  it("Tab closes the list and lets focus move on", async () => {
    await render(
      <div>
        <MultiSelect options={THREE} defaultValue={[]} name="tags" aria-label="Tags" />
        <button>Next</button>
      </div>
    )
    await combo().element().focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{Tab}")
    expect(isOpen()).toBe(false)
    await expect.element(page.getByRole("button", { name: "Next" })).toHaveFocus()
  })
})

describe("MultiSelect: chips and search", () => {
  it("removes a chip with its keyboard-reachable Remove button", async () => {
    await render(<MultiSelect options={THREE} defaultValue={["design", "code"]} name="tags" aria-label="Tags" />)
    const remove = page.getByRole("button", { name: "Remove Design" })
    await remove.element().focus()
    await userEvent.keyboard("{Enter}")
    expect(hidden("tags")).toEqual(["code"])
    await expect.element(page.getByRole("button", { name: "Remove Design" })).not.toBeInTheDocument()
  })

  it("Backspace in an empty search removes the last chip", async () => {
    await render(<MultiSelect options={TAGS} defaultValue={["design", "code"]} name="tags" aria-label="Tags" />)
    await combo().element().focus()
    await userEvent.keyboard("{Enter}")
    await expect.element(page.getByRole("textbox", { name: "Search options" })).toHaveFocus()
    await userEvent.keyboard("{Backspace}")
    expect(hidden("tags")).toEqual(["design"])
  })

  it("filters with search above 8 options and toggles the active match with Enter", async () => {
    await render(<MultiSelect options={TAGS} defaultValue={[]} name="tags" aria-label="Tags" />)
    await combo().element().focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("da")
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(1)
    expect(activeOption()).toBe("Data")
    await userEvent.keyboard("{Enter}")
    expect(hidden("tags")).toEqual(["data"])
  })
})

describe("MultiSelect: max and forms", () => {
  it("disables unselected options once max is reached", async () => {
    await render(<MultiSelect options={THREE} defaultValue={["design", "code"]} max={2} name="tags" aria-label="Tags" />)
    await combo().element().focus()
    await userEvent.keyboard("{Enter}")
    expect(optionState("Design").selected).toBe("true")
    expect(optionState("Code").selected).toBe("true")
    expect(optionState("Docs").disabled).toBe("true")
    // Selected options stay enabled, so they can still be removed.
    expect(optionState("Code").disabled).toBeNull()
  })

  it("submits one hidden input per value with a native form", async () => {
    const onSubmit = vi.fn((e: SubmitEvent) => e.preventDefault())
    await render(
      <form onSubmit={onSubmit}>
        <MultiSelect options={THREE} defaultValue={["design", "docs"]} name="tags" aria-label="Tags" />
      </form>
    )
    const data = new FormData(document.querySelector("form")!)
    expect(data.getAll("tags")).toEqual(["design", "docs"])
  })
})
