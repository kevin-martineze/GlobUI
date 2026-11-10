import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { useState } from "react"
import { Combobox, type ComboboxOption, type ComboboxProps } from "./combobox"
import { Field } from "../../field/src/field"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

const OPTIONS: ComboboxOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "cancion", label: "Canción" },
  { value: "svelte", label: "Svelte", disabled: true },
  { value: "angular", label: "Angular", description: "Google's framework" },
]

function Basic(props: Partial<ComboboxProps> & { label?: string }) {
  const [value, setValue] = useState<string | null>(props.defaultValue ?? null)
  return (
    <Field label={props.label ?? "Framework"}>
      <Combobox options={OPTIONS} {...props} value={props.value ?? value} onChange={(v) => { setValue(v); props.onChange?.(v) }} />
    </Field>
  )
}

const input = () => page.getByRole("combobox").element() as HTMLInputElement
const optionNames = () => Array.from(document.querySelectorAll('[role="option"]')).map((el) => el.textContent?.trim())
const isExpanded = () => input().getAttribute("aria-expanded") === "true"

describe("Combobox", () => {
  it("wires the combobox ARIA attributes and passes axe closed and open", async () => {
    await render(<Basic />)
    const field = page.getByRole("combobox", { name: "Framework" })
    await expect.element(field).toHaveAttribute("aria-expanded", "false")
    await expectNoA11yViolations()

    await userEvent.click(field)
    await expect.element(field).toHaveAttribute("aria-expanded", "true")
    const listbox = page.getByRole("listbox", { name: "Framework" }).element()
    expect(input().getAttribute("aria-controls")).toBe(listbox.id)
    const active = document.getElementById(input().getAttribute("aria-activedescendant") ?? "")
    expect(active?.getAttribute("role")).toBe("option")
    expect(active?.textContent).toContain("React")
    await expectNoA11yViolations()
  })

  it("filters as you type, ignoring accents", async () => {
    await render(<Basic />)
    await userEvent.fill(input(), "cancion")
    expect(optionNames()).toEqual(["Canción"])
    await userEvent.fill(input(), "")
    expect(optionNames().length).toBe(5)
  })

  it("arrows and Enter select the option, call onChange and show its label", async () => {
    const onChange = vi.fn()
    await render(<Basic onChange={onChange} />)
    await userEvent.click(page.getByRole("combobox"))
    await userEvent.keyboard("{ArrowDown}{Enter}")
    expect(onChange).toHaveBeenLastCalledWith("vue")
    expect(input().value).toBe("Vue")
    expect(isExpanded()).toBe(false)
  })

  it("skips a disabled option with the arrows and does not select it on click", async () => {
    const onChange = vi.fn()
    await render(<Basic onChange={onChange} />)
    await userEvent.click(page.getByRole("combobox"))
    // React, Vue, Canción, (Svelte is disabled), Angular
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}")
    const active = document.getElementById(input().getAttribute("aria-activedescendant") ?? "")
    expect(active?.textContent).toContain("Angular")
    // A disabled option is not actionable for the user; a plain click must not select it.
    ;(page.getByRole("option", { name: "Svelte" }).element() as HTMLElement).click()
    expect(onChange).not.toHaveBeenCalledWith("svelte")
  })

  it("Escape closes the list, and a second Escape clears the text and the value", async () => {
    const onChange = vi.fn()
    await render(<Basic defaultValue="vue" onChange={onChange} />)
    await userEvent.click(page.getByRole("combobox"))
    await expect.poll(isExpanded).toBe(true)
    await userEvent.keyboard("{Escape}")
    await expect.poll(isExpanded).toBe(false)
    await userEvent.keyboard("{Escape}")
    await expect.poll(() => input().value).toBe("")
    expect(onChange).toHaveBeenLastCalledWith(null)
  })

  it("restores the selected label on blur when the text is not committed", async () => {
    await render(<Basic defaultValue="react" />)
    await userEvent.fill(input(), "zzz")
    await userEvent.click(document.body, { position: { x: 4, y: 4 } })
    await expect.poll(() => input().value).toBe("React")
  })

  it("commits free text with allowCustomValue", async () => {
    const onChange = vi.fn()
    await render(<Basic allowCustomValue onChange={onChange} />)
    await userEvent.fill(input(), "Qwik")
    await expect.element(page.getByRole("option", { name: 'Use "Qwik"' })).toBeVisible()
    await userEvent.keyboard("{Enter}")
    expect(onChange).toHaveBeenLastCalledWith("Qwik")
    expect(input().value).toBe("Qwik")
  })

  it("the clear button empties the field, clears the value and refocuses the input", async () => {
    const onChange = vi.fn()
    await render(<Basic defaultValue="vue" onChange={onChange} />)
    await userEvent.click(page.getByRole("button", { name: "Clear" }))
    expect(input().value).toBe("")
    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(document.activeElement).toBe(input())
  })

  it("announces loading and empty states in a status region", async () => {
    await render(<Basic loading />)
    await userEvent.click(page.getByRole("combobox"))
    await expect.element(page.getByRole("status").getByText("Loading…")).toBeVisible()
  })

  it("shows the empty message when nothing matches", async () => {
    await render(<Basic />)
    await userEvent.fill(input(), "nothing matches this")
    await expect.element(page.getByRole("status").getByText("No results.")).toBeVisible()
  })

  it("names the field from its Field label and shows descriptions", async () => {
    await render(<Basic />)
    await userEvent.click(page.getByRole("combobox"))
    const angular = page.getByRole("option", { name: /Angular/ }).element()
    expect(angular.textContent).toContain("Google's framework")
  })
})
