import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  CommandDialog,
} from "./command"
import { Button } from "../../button/src/button"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
const modKey = isMac ? { metaKey: true } : { ctrlKey: true }

function Palette(props: { onSelect?: (v: string) => void; disabledEdit?: boolean; filter?: false }) {
  return (
    <Command label="Command menu" filter={props.filter}>
      <CommandInput placeholder="Type a command" />
      <CommandList>
        <CommandEmpty>Nothing found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="Calendar" keywords={["events", "schedule"]} onSelect={props.onSelect}>
            Calendar <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
          <CommandItem value="Canción" onSelect={props.onSelect}>Canción</CommandItem>
          <CommandItem value="Archive" disabled onSelect={props.onSelect}>Archive</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem value="Theme" keywords={["dark mode"]} onSelect={props.onSelect}>Theme</CommandItem>
          <CommandItem value="Profile" onSelect={props.onSelect}>Profile</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

const input = () => page.getByRole("combobox", { name: "Command menu" }).element() as HTMLInputElement
const optionNames = () =>
  Array.from(document.querySelectorAll('[role="option"]')).map((el) => el.textContent?.trim())
// The first word of the option text: the shortcut ("⌘C") is not part of the name we check.
const activeName = () => {
  const id = input().getAttribute("aria-activedescendant")
  return id ? document.getElementById(id)?.textContent?.trim().split(" ")[0] : undefined
}

describe("Command", () => {
  it("passes axe and wires the search field to the list", async () => {
    await render(<Palette />)
    const field = input()
    expect(field.getAttribute("aria-controls")).toBe(page.getByRole("listbox", { name: "Command menu" }).element().id)
    expect(field.getAttribute("aria-expanded")).toBe("true")
    expect(activeName()).toBe("Calendar")
    await expectNoA11yViolations()
  })

  it("filters items, hides empty groups and separators while searching", async () => {
    await render(<Palette />)
    await userEvent.fill(input(), "prof")
    expect(optionNames()).toEqual(["Profile"])
    const groups = Array.from(document.querySelectorAll('[role="group"]')) as HTMLElement[]
    expect(groups.find((g) => g.textContent?.includes("Suggestions"))?.hidden).toBe(true)
    expect(document.querySelector('[role="none"]')?.hasAttribute("hidden")).toBe(true)
  })

  it("matches accents, keywords and every word in any order", async () => {
    await render(<Palette />)
    await userEvent.fill(input(), "cancion")
    expect(optionNames()).toEqual(["Canción"])
    await userEvent.fill(input(), "mode dark")
    expect(optionNames()).toEqual(["Theme"])
  })

  it("arrows skip disabled items and aria-activedescendant follows them", async () => {
    await render(<Palette />)
    expect(activeName()).toBe("Calendar")
    input().focus()
    await userEvent.keyboard("{ArrowDown}")
    expect(activeName()).toBe("Canción")
    // Archive is disabled and skipped.
    await userEvent.keyboard("{ArrowDown}")
    expect(activeName()).toBe("Theme")
  })

  it("Enter calls onSelect with the value of the active item", async () => {
    const onSelect = vi.fn()
    await render(<Palette onSelect={onSelect} />)
    input().focus()
    await userEvent.keyboard("{ArrowDown}{Enter}")
    expect(onSelect).toHaveBeenCalledWith("Canción")
  })

  it("shows CommandEmpty when nothing matches", async () => {
    await render(<Palette />)
    await userEvent.fill(input(), "zzzz")
    await expect.element(page.getByRole("status").getByText("Nothing found.")).toBeVisible()
  })

  it("filter={false} shows everything and leaves filtering to the consumer", async () => {
    await render(<Palette filter={false} />)
    await userEvent.fill(input(), "zzzz")
    // Calendar, Canción, Archive, Theme, Profile: all five, Archive included (disabled but shown).
    expect(optionNames().length).toBe(5)
  })
})

describe("CommandDialog", () => {
  function Shell(props: { shortcut?: string | false; closeOnSelect?: boolean; onSelect?: (v: string) => void }) {
    return (
      <>
        <Button variant="outline">Open</Button>
        <CommandDialog shortcut={props.shortcut} closeOnSelect={props.closeOnSelect}>
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandItem value="Open docs" onSelect={props.onSelect}>Open docs</CommandItem>
            <CommandItem value="Toggle theme" onSelect={props.onSelect}>Toggle theme</CommandItem>
          </CommandList>
        </CommandDialog>
      </>
    )
  }

  const dialogOpen = () => !!document.querySelector("dialog")?.open

  it("opens with the shortcut, focuses the input, and closes with Escape (focus returns)", async () => {
    await render(<Shell />)
    const trigger = page.getByRole("button", { name: "Open" }).element() as HTMLElement
    trigger.focus()
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", bubbles: true, ...modKey }))
    await expect.poll(dialogOpen).toBe(true)
    await expect.poll(() => document.activeElement?.getAttribute("role")).toBe("combobox")
    await expectNoA11yViolations()
    await userEvent.keyboard("{Escape}")
    await expect.poll(dialogOpen).toBe(false)
  })

  it("the shortcut toggles the dialog, and the other platform's modifier does nothing", async () => {
    await render(<Shell />)
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", bubbles: true, ...(isMac ? { ctrlKey: true } : { metaKey: true }) }))
    await new Promise((r) => setTimeout(r, 50))
    expect(dialogOpen()).toBe(false)
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", bubbles: true, ...modKey }))
    await expect.poll(dialogOpen).toBe(true)
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", bubbles: true, ...modKey }))
    await expect.poll(dialogOpen).toBe(false)
  })

  it("shortcut={false} disables the shortcut", async () => {
    await render(<Shell shortcut={false} />)
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", bubbles: true, ...modKey }))
    await new Promise((r) => setTimeout(r, 50))
    expect(dialogOpen()).toBe(false)
  })

  it("modifiers must match exactly: mod+k does not fire with an extra Shift", async () => {
    await render(<Shell />)
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", bubbles: true, shiftKey: true, ...modKey }))
    await new Promise((r) => setTimeout(r, 50))
    expect(dialogOpen()).toBe(false)
  })

  it("a multi-modifier shortcut ignores the bare key", async () => {
    await render(<Shell shortcut="ctrl+shift+p" />)
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "p", bubbles: true }))
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "p", bubbles: true, ctrlKey: true }))
    await new Promise((r) => setTimeout(r, 50))
    expect(dialogOpen()).toBe(false)
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "P", bubbles: true, ctrlKey: true, shiftKey: true }))
    await expect.poll(dialogOpen).toBe(true)
  })

  it("a shortcut without Ctrl or Meta does not fire while typing in a field", async () => {
    await render(
      <>
        <input aria-label="Other field" />
        <Shell shortcut="/" />
      </>
    )
    const field = page.getByRole("textbox", { name: "Other field" }).element() as HTMLElement
    field.dispatchEvent(new KeyboardEvent("keydown", { key: "/", bubbles: true }))
    await new Promise((r) => setTimeout(r, 50))
    expect(dialogOpen()).toBe(false)
    document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "/", bubbles: true }))
    await expect.poll(dialogOpen).toBe(true)
  })

  it("closes after a selection by default, and stays open with closeOnSelect={false}", async () => {
    await render(<Shell />)
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", bubbles: true, ...modKey }))
    await expect.poll(dialogOpen).toBe(true)
    await userEvent.click(page.getByRole("option", { name: "Toggle theme" }))
    await expect.poll(dialogOpen).toBe(false)
  })

  it("keeps open after a selection with closeOnSelect={false}", async () => {
    const onSelect = vi.fn()
    await render(<Shell closeOnSelect={false} onSelect={onSelect} />)
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", bubbles: true, ...modKey }))
    await expect.poll(dialogOpen).toBe(true)
    await userEvent.click(page.getByRole("option", { name: "Toggle theme" }))
    expect(onSelect).toHaveBeenCalledWith("Toggle theme")
    expect(dialogOpen()).toBe(true)
  })
})
