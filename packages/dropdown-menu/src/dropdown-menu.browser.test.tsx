import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "./dropdown-menu"
import { Button } from "../../button/src/button"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

// Menu items are role=menuitem* and have no open state of their own; the menu's popover tells us if it is shown.
const menuOpen = () => !!document.querySelector('[role="menu"]:popover-open')
// The item's own text, without its shortcut hint.
const focused = () => {
  const el = document.activeElement
  if (!el) return ""
  return [...el.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE).map((n) => n.textContent).join("").trim()
}

function Menu(props: {
  onSelect?: (label: string) => void
  onRadio?: (value: string) => void
  keepOpen?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent aria-label="Actions menu">
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => props.onSelect?.("Profile")}>
            Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => props.onSelect?.("Billing")}>Billing</DropdownMenuItem>
          <DropdownMenuItem disabled onSelect={() => props.onSelect?.("Disabled")}>
            Disabled item
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              if (props.keepOpen) e.preventDefault()
              props.onSelect?.("Keep")
            }}
          >
            Keep open
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem defaultChecked={props.defaultChecked} onCheckedChange={props.onCheckedChange}>
            Status bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup defaultValue="system" onValueChange={props.onRadio}>
            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="danger" onSelect={() => props.onSelect?.("Delete")}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <button>After</button>
    </div>
  )
}

const trigger = () => page.getByRole("button", { name: "Actions" })

describe("DropdownMenu: opening", () => {
  it("has the menu ARIA: trigger haspopup + expanded, menu named by the trigger", async () => {
    await render(<Menu />)
    await expect.element(trigger()).toHaveAttribute("aria-haspopup", "menu")
    await expect.element(trigger()).toHaveAttribute("aria-expanded", "false")
    await userEvent.click(trigger())
    await expect.element(page.getByRole("menu", { name: "Actions" })).toBeVisible()
    await expect.element(trigger()).toHaveAttribute("aria-expanded", "true")
    await expectNoA11yViolations()
  })

  it("Enter and Space on the trigger open the menu and focus the first item", async () => {
    await render(<Menu />)
    await trigger().element().focus()
    await userEvent.keyboard("{Enter}")
    await expect.poll(menuOpen).toBe(true)
    expect(focused()).toBe("Profile")

    await userEvent.keyboard("{Escape}")
    await expect.poll(menuOpen).toBe(false)
    await trigger().element().focus()
    await userEvent.keyboard(" ")
    await expect.poll(menuOpen).toBe(true)
    expect(focused()).toBe("Profile")
  })

  it("ArrowDown opens on the first item and ArrowUp opens on the last", async () => {
    await render(<Menu />)
    await trigger().element().focus()
    await userEvent.keyboard("{ArrowDown}")
    await expect.poll(menuOpen).toBe(true)
    expect(focused()).toBe("Profile")

    await userEvent.keyboard("{Escape}")
    await expect.poll(menuOpen).toBe(false)
    await trigger().element().focus()
    await userEvent.keyboard("{ArrowUp}")
    await expect.poll(menuOpen).toBe(true)
    expect(focused()).toBe("Delete")
  })
})

describe("DropdownMenu: keyboard inside", () => {
  it("moves with arrows, loops, and skips the disabled item", async () => {
    await render(<Menu />)
    await userEvent.click(trigger())
    await page.getByRole("menuitem", { name: /^Profile/ }).element().focus()
    await userEvent.keyboard("{ArrowDown}")
    expect(focused()).toBe("Billing")
    await userEvent.keyboard("{ArrowDown}")
    expect(focused()).toBe("Keep open")
    await userEvent.keyboard("{Home}")
    expect(focused()).toBe("Profile")
    await userEvent.keyboard("{End}")
    expect(focused()).toBe("Delete")
    await userEvent.keyboard("{ArrowDown}")
    expect(focused()).toBe("Profile")
  })

  it("typeahead jumps to the next item starting with the typed letter", async () => {
    await render(<Menu />)
    await userEvent.click(trigger())
    await page.getByRole("menuitem", { name: /^Profile/ }).element().focus()
    await userEvent.keyboard("b")
    expect(focused()).toBe("Billing")
  })

  it("Escape closes and returns focus to the trigger", async () => {
    await render(<Menu />)
    await userEvent.click(trigger())
    await page.getByRole("menuitem", { name: /^Profile/ }).element().focus()
    await userEvent.keyboard("{Escape}")
    await expect.poll(menuOpen).toBe(false)
    await expect.element(trigger()).toHaveFocus()
  })

  it("Tab closes the menu and lets focus move on", async () => {
    await render(<Menu />)
    await userEvent.click(trigger())
    await page.getByRole("menuitem", { name: /^Profile/ }).element().focus()
    await userEvent.keyboard("{Tab}")
    await expect.poll(menuOpen).toBe(false)
    await expect.element(page.getByRole("button", { name: "After" })).toHaveFocus()
  })
})

describe("DropdownMenu: selecting", () => {
  it("Enter selects the item and closes the menu", async () => {
    const onSelect = vi.fn()
    await render(<Menu onSelect={onSelect} />)
    await userEvent.click(trigger())
    await page.getByRole("menuitem", { name: /^Profile/ }).element().focus()
    await userEvent.keyboard("{Enter}")
    expect(onSelect).toHaveBeenCalledWith("Profile")
    await expect.poll(menuOpen).toBe(false)
  })

  it("a mouse-opened menu focuses the menu container, and ArrowDown then enters the items", async () => {
    await render(<Menu />)
    await userEvent.click(trigger())
    await expect.element(page.getByRole("menu", { name: "Actions" })).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    expect(focused()).toBe("Profile")
  })

  it("a checkbox item toggles and stays open", async () => {
    const onCheckedChange = vi.fn()
    await render(<Menu onCheckedChange={onCheckedChange} />)
    await userEvent.click(trigger())
    await page.getByRole("menuitemcheckbox", { name: "Status bar" }).element().focus()
    await userEvent.keyboard(" ")
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    await expect.element(page.getByRole("menuitemcheckbox", { name: "Status bar" })).toHaveAttribute("aria-checked", "true")
    expect(menuOpen()).toBe(true)
  })

  it("a radio group changes the checked item with Enter, and stays open", async () => {
    const onRadio = vi.fn()
    await render(<Menu onRadio={onRadio} />)
    await userEvent.click(trigger())
    await page.getByRole("menuitemradio", { name: "Light" }).element().focus()
    await userEvent.keyboard("{Enter}")
    expect(onRadio).toHaveBeenCalledWith("light")
    await expect.element(page.getByRole("menuitemradio", { name: "Light" })).toHaveAttribute("aria-checked", "true")
    await expect.element(page.getByRole("menuitemradio", { name: "System" })).toHaveAttribute("aria-checked", "false")
    expect(menuOpen()).toBe(true)
  })

  it("preventDefault in onSelect keeps the menu open", async () => {
    const onSelect = vi.fn()
    await render(<Menu keepOpen onSelect={onSelect} />)
    await userEvent.click(trigger())
    await page.getByRole("menuitem", { name: "Keep open" }).element().focus()
    await userEvent.keyboard("{Enter}")
    expect(onSelect).toHaveBeenCalledWith("Keep")
    expect(menuOpen()).toBe(true)
  })

  it("the danger item renders with the danger variant text", async () => {
    await render(<Menu />)
    await userEvent.click(trigger())
    const del = page.getByRole("menuitem", { name: "Delete" }).element() as HTMLElement
    expect(getComputedStyle(del).color).not.toBe(getComputedStyle(page.getByRole("menuitem", { name: "Billing" }).element()).color)
  })
})
