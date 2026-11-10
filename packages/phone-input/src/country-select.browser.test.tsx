import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { CountrySelect } from "./country-select"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

const trigger = () => page.getByRole("combobox", { name: "Country code" })
const listbox = () => document.querySelector<HTMLElement>('[role="listbox"]')
const isOpen = () => !!listbox()?.closest("[popover]")?.matches(":popover-open")
const search = () => page.getByRole("textbox", { name: "Search countries" }).element() as HTMLInputElement
const options = () => Array.from(document.querySelectorAll('[role="option"]')).map((o) => o.textContent?.trim() ?? "")
const activeOption = () => {
  const id = (document.activeElement as HTMLElement | null)?.getAttribute("aria-activedescendant")
  return id ? document.getElementById(id)?.textContent?.trim() : undefined
}

describe("CountrySelect", () => {
  it("opens with the keyboard and focuses the search field", async () => {
    await render(<CountrySelect value="US" onChange={() => {}} />)
    expect(trigger().element().textContent).toContain("+1")
    await trigger().element().focus()
    await userEvent.keyboard("{ArrowDown}")
    expect(isOpen()).toBe(true)
    await expect.element(page.getByRole("textbox", { name: "Search countries" })).toHaveFocus()
    await expectNoA11yViolations()
  })

  it("searches by name, dial code and ISO code", async () => {
    await render(<CountrySelect value="US" onChange={() => {}} />)
    await trigger().element().focus()
    await userEvent.keyboard("{Enter}")

    await userEvent.keyboard("fin")
    expect(options()).toEqual(["🇫🇮Finland+358"])
    expect(activeOption()).toBe("🇫🇮Finland+358")

    await userEvent.clear(page.getByRole("textbox", { name: "Search countries" }))
    await userEvent.keyboard("+44")
    expect(options()).toEqual(["🇬🇧United Kingdom+44"])

    await userEvent.clear(page.getByRole("textbox", { name: "Search countries" }))
    await userEvent.keyboard("mx")
    expect(options()).toEqual(["🇲🇽Mexico+52"])
  })

  it("moves the active option with arrows and selects it with Enter", async () => {
    const onChange = vi.fn()
    await render(<CountrySelect value="US" onChange={onChange} />)
    await trigger().element().focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{ArrowDown}")
    expect(activeOption()).toBe("🇬🇧United Kingdom+44")
    await userEvent.keyboard("{Enter}")
    expect(onChange).toHaveBeenCalledWith("GB")
    expect(isOpen()).toBe(false)
    await expect.element(trigger()).toHaveFocus()
  })

  it("Escape closes without changing the country", async () => {
    const onChange = vi.fn()
    await render(<CountrySelect value="US" onChange={onChange} />)
    await trigger().element().focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("gb")
    await userEvent.keyboard("{Escape}")
    expect(isOpen()).toBe(false)
    expect(onChange).not.toHaveBeenCalled()
  })

  it("clears the search when the list reopens (same regression as Select)", async () => {
    await render(<CountrySelect value="US" onChange={() => {}} />)
    await trigger().element().focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("+44")
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{Enter}")
    expect(search().value).toBe("")
    expect(options().length).toBeGreaterThan(50)
  })
})
