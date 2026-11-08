import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { Select } from "./select"
import { Card, CardContent } from "../../card/src/card"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

const FRUITS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "pear", label: "Pear" },
  { value: "kiwi", label: "Kiwi", disabled: true },
  { value: "mango", label: "Mango" },
  { value: "plum", label: "Plum" },
  { value: "grape", label: "Grape" },
  { value: "lime", label: "Lime" },
  { value: "fig", label: "Fig" },
]

const THREE = FRUITS.slice(0, 3)
// Eight options is not searchable (search appears above 8), so keys stay on the trigger.
const EIGHT = FRUITS.slice(0, 8)

const trigger = () => page.getByRole("combobox")
const listbox = () => document.querySelector<HTMLElement>('[role="listbox"]')
const isOpen = () => !!listbox()?.closest("[popover]")?.matches(":popover-open")
const activeOption = () => {
  const el = document.activeElement as HTMLElement | null
  const id = el?.getAttribute("aria-activedescendant")
  return id ? document.getElementById(id)?.textContent?.trim() : undefined
}
const selectedText = () => document.querySelector('[role="combobox"]')?.textContent?.trim()

describe("Select: keyboard (select-only combobox)", () => {
  it("has the combobox ARIA and opens with Enter, Space, ArrowDown and ArrowUp", async () => {
    await render(<Select options={THREE} defaultValue="pear" aria-label="Fruit" />)
    await expect.element(trigger()).toHaveAttribute("aria-haspopup", "listbox")
    await expect.element(trigger()).toHaveAttribute("aria-expanded", "false")
    await expect.element(trigger()).toHaveTextContent("Pear")

    await trigger().element().focus()
    await userEvent.keyboard("{Enter}")
    await expect.element(trigger()).toHaveAttribute("aria-expanded", "true")
    // Opens on the selected option.
    expect(activeOption()).toBe("Pear")
    await expectNoA11yViolations()

    await userEvent.keyboard("{Escape}")
    await userEvent.keyboard(" ")
    expect(isOpen()).toBe(true)
    await userEvent.keyboard("{Escape}")
    await userEvent.keyboard("{ArrowDown}")
    expect(isOpen()).toBe(true)
    await userEvent.keyboard("{Escape}")
    await userEvent.keyboard("{ArrowUp}")
    expect(isOpen()).toBe(true)
  })

  it("moves the active option with arrows, Home and End, and skips disabled options", async () => {
    await render(<Select options={EIGHT} defaultValue="apple" aria-label="Fruit" />)
    await trigger().element().focus()
    await userEvent.keyboard("{ArrowDown}")
    expect(activeOption()).toBe("Apple")
    await userEvent.keyboard("{ArrowDown}")
    expect(activeOption()).toBe("Banana")
    await userEvent.keyboard("{ArrowDown}")
    await userEvent.keyboard("{ArrowDown}")
    expect(activeOption()).toBe("Mango")
    await userEvent.keyboard("{End}")
    expect(activeOption()).toBe("Lime")
    await userEvent.keyboard("{Home}")
    expect(activeOption()).toBe("Apple")
  })

  it("selects with Enter, closes, and returns focus to the trigger", async () => {
    const onChange = vi.fn()
    await render(<Select options={THREE} defaultValue="apple" onChange={onChange} aria-label="Fruit" />)
    await trigger().element().focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{ArrowDown}")
    await userEvent.keyboard("{Enter}")
    expect(onChange).toHaveBeenCalledWith("banana")
    expect(selectedText()).toBe("Banana")
    expect(isOpen()).toBe(false)
    await expect.element(trigger()).toHaveFocus()
  })

  it("typeahead moves to the next option starting with the typed letters", async () => {
    await render(<Select options={EIGHT} defaultValue="apple" aria-label="Fruit" />)
    await trigger().element().focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("l")
    expect(activeOption()).toBe("Lime")
  })

  it("Escape closes without changing the value", async () => {
    const onChange = vi.fn()
    await render(<Select options={THREE} defaultValue="apple" onChange={onChange} aria-label="Fruit" />)
    await trigger().element().focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{ArrowDown}{ArrowDown}")
    await userEvent.keyboard("{Escape}")
    expect(isOpen()).toBe(false)
    expect(onChange).not.toHaveBeenCalled()
    expect(selectedText()).toBe("Apple")
    await expect.element(trigger()).toHaveFocus()
  })

  it("Tab selects the active option and lets focus move on", async () => {
    const onChange = vi.fn()
    await render(
      <div>
        <Select options={THREE} defaultValue="apple" onChange={onChange} aria-label="Fruit" />
        <button>Next</button>
      </div>
    )
    await trigger().element().focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{ArrowDown}")
    await userEvent.keyboard("{Tab}")
    expect(onChange).toHaveBeenCalledWith("banana")
    expect(isOpen()).toBe(false)
    await expect.element(page.getByRole("button", { name: "Next" })).toHaveFocus()
  })
})

describe("Select: search (more than 8 options)", () => {
  it("moves focus to the search field and filters the list", async () => {
    await render(<Select options={FRUITS} defaultValue="apple" aria-label="Fruit" />)
    await trigger().element().focus()
    await userEvent.keyboard("{Enter}")
    await expect.element(page.getByRole("textbox", { name: "Search options" })).toHaveFocus()

    await userEvent.keyboard("pl")
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(2)
    expect(activeOption()).toBe("Apple")
    await userEvent.keyboard("{ArrowDown}")
    expect(activeOption()).toBe("Plum")
    await expectNoA11yViolations()
  })

  it("Enter in the search field selects the active option", async () => {
    const onChange = vi.fn()
    await render(<Select options={FRUITS} defaultValue="apple" onChange={onChange} aria-label="Fruit" />)
    await trigger().element().focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("gr")
    await userEvent.keyboard("{Enter}")
    expect(onChange).toHaveBeenCalledWith("grape")
    expect(isOpen()).toBe(false)
  })

  it("regression (08b0035): the search is cleared when the list reopens after a selection", async () => {
    await render(<Select options={FRUITS} defaultValue="apple" aria-label="Fruit" />)
    await trigger().element().focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("+44x")
    await userEvent.keyboard("{Escape}")
    await userEvent.keyboard("{Enter}")
    expect((page.getByRole("textbox", { name: "Search options" }).element() as HTMLInputElement).value).toBe("")
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(9)

    await userEvent.keyboard("pl")
    await userEvent.keyboard("{Enter}")
    expect(selectedText()).toBe("Apple")
    await userEvent.keyboard("{Enter}")
    expect((page.getByRole("textbox", { name: "Search options" }).element() as HTMLInputElement).value).toBe("")
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(9)
  })
})

describe("Select: layout and forms", () => {
  it("is not clipped inside a Card with overflow hidden", async () => {
    await render(
      <Card className="w-full max-w-sm overflow-hidden">
        <CardContent>
          <Select options={THREE} defaultValue="apple" aria-label="Fruit" />
        </CardContent>
      </Card>
    )
    await trigger().element().focus()
    await userEvent.keyboard("{Enter}")
    const card = trigger().element().closest<HTMLElement>(".overflow-hidden")!.getBoundingClientRect()
    const panel = listbox()!.closest("[popover]")!.getBoundingClientRect()
    expect(panel.bottom).toBeGreaterThan(card.bottom)
    expect(panel.height).toBeGreaterThan(0)
  })

  it("submits the value with a native form through a hidden input", async () => {
    const onSubmit = vi.fn((e: SubmitEvent) => e.preventDefault())
    await render(
      <form onSubmit={onSubmit}>
        <Select name="fruit" options={THREE} defaultValue="pear" aria-label="Fruit" />
        <button type="submit">Send</button>
      </form>
    )
    const form = document.querySelector("form")!
    expect(new FormData(form).get("fruit")).toBe("pear")

    await trigger().element().focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{ArrowUp}{Enter}")
    expect(new FormData(form).get("fruit")).toBe("banana")
  })
})
