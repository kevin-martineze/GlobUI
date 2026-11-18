// Phase 10d-2 contracts: the behaviour and accessibility of the overlays (Popover, Tooltip, DropdownMenu, AlertDialog,
// Toast, Select, Combobox, MultiSelect, Command), written once and run in every framework that ports them. They come
// from the React package tests. Left React-only: Select search placeholder contrast in both themes (it checks the
// shared class string, which the parity snapshot already pins), and "the danger item colour" (same reason).
//
// Pointer timing: React derives onPointerEnter and onPointerLeave from pointerover and pointerout, while other
// frameworks listen to pointerenter and pointerleave. The synthetic events below dispatch both, so each framework
// sees exactly one enter or leave.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "../browser/a11y"
import type { OverlayOption, OverlaysAdapter } from "./types"

/** Lets the framework commit work queued by an event or a fake timer. Each message is a macrotask. */
async function flush() {
  for (let i = 0; i < 3; i++) {
    await new Promise<void>((resolve) => {
      const channel = new MessageChannel()
      channel.port1.onmessage = () => {
        channel.port1.close()
        resolve()
      }
      channel.port2.postMessage(null)
    })
  }
}

async function waitUntil(condition: () => boolean, attempts = 50) {
  for (let i = 0; i < attempts; i++) {
    if (condition()) return
    await flush()
  }
  throw new Error("condition not met after flushing")
}

async function advance(ms: number) {
  vi.advanceTimersByTime(ms)
  await flush()
}

function pointerEnter(el: Element) {
  el.dispatchEvent(new PointerEvent("pointerover", { bubbles: true, pointerType: "mouse", relatedTarget: document.body }))
  el.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "mouse", relatedTarget: document.body }))
}

function pointerLeave(el: Element) {
  el.dispatchEvent(new PointerEvent("pointerout", { bubbles: true, pointerType: "mouse", relatedTarget: document.body }))
  el.dispatchEvent(new PointerEvent("pointerleave", { pointerType: "mouse", relatedTarget: document.body }))
}

const isPopoverOpen = (selector: string) => !!document.querySelector(`${selector}:popover-open`)

/** The option named by the focused element's aria-activedescendant. */
const activeOption = () => {
  const id = (document.activeElement as HTMLElement | null)?.getAttribute("aria-activedescendant")
  return id ? document.getElementById(id)?.textContent?.trim() : undefined
}
const listbox = () => document.querySelector<HTMLElement>('[role="listbox"]')
const listOpen = () => !!listbox()?.closest("[popover]")?.matches(":popover-open")
const optionNames = () => Array.from(document.querySelectorAll('[role="option"]')).map((el) => el.textContent?.trim())
const hiddenValues = (name: string) =>
  Array.from(document.querySelectorAll<HTMLInputElement>(`input[type="hidden"][name="${name}"]`)).map((i) => i.value)

const FRUITS: OverlayOption[] = [
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
const THREE_FRUITS = FRUITS.slice(0, 3)
// Eight options is not searchable (search appears above 8), so keys stay on the trigger.
const EIGHT_FRUITS = FRUITS.slice(0, 8)

const FRAMEWORKS: OverlayOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "cancion", label: "Canción" },
  { value: "svelte", label: "Svelte", disabled: true },
  { value: "angular", label: "Angular", description: "Google's framework" },
]

const TAGS: OverlayOption[] = ["Design", "Code", "Docs", "Ops", "QA", "UX", "Data", "Sales", "Legal"].map((label) => ({
  value: label.toLowerCase(),
  label,
}))
const THREE_TAGS = TAGS.slice(0, 3)

const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
const modKey = isMac ? { metaKey: true } : { ctrlKey: true }
const pressShortcut = (init: KeyboardEventInit, target: EventTarget = document) =>
  target.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, ...init }))

export function overlaysContract(render: OverlaysAdapter) {
  describe(`Popover (${render.name})`, () => {
    const popoverOpen = () => isPopoverOpen('[role="dialog"]')
    const trigger = () => page.getByRole("button", { name: "Filters" })

    it("opens with the trigger, moves focus inside, and reports aria-expanded", async () => {
      await render.popover({})
      await expect.element(trigger()).toHaveAttribute("aria-expanded", "false")
      await userEvent.click(trigger())
      await expect.poll(popoverOpen).toBe(true)
      await expect.element(trigger()).toHaveAttribute("aria-expanded", "true")
      await expect.element(page.getByRole("button", { name: "Apply" })).toHaveFocus()
      await expect.element(page.getByRole("dialog", { name: "Filters" })).toBeInTheDocument()
      await expectNoA11yViolations()
    })

    it("closes when the trigger is clicked again (does not reopen)", async () => {
      await render.popover({})
      await userEvent.click(trigger())
      await expect.poll(popoverOpen).toBe(true)
      await userEvent.click(trigger())
      await expect.poll(popoverOpen).toBe(false)
      await expect.element(trigger()).toHaveAttribute("aria-expanded", "false")
    })

    it("closes on Escape and returns focus to the trigger", async () => {
      await render.popover({})
      await userEvent.click(trigger())
      await expect.element(page.getByRole("button", { name: "Apply" })).toHaveFocus()
      await userEvent.keyboard("{Escape}")
      await expect.poll(popoverOpen).toBe(false)
      await expect.element(trigger()).toHaveFocus()
    })

    it("light-dismisses on an outside click without reopening", async () => {
      const onOpenChange = vi.fn()
      await render.popover({ onOpenChange })
      await userEvent.click(trigger())
      await expect.poll(popoverOpen).toBe(true)
      await userEvent.click(page.getByText("Outside text"))
      await expect.poll(popoverOpen).toBe(false)
      expect(onOpenChange).toHaveBeenLastCalledWith(false)
    })

    it("focuses the [data-autofocus] element inside the content, not the first focusable one", async () => {
      await render.popover({ autofocus: true })
      await expect.poll(() => document.activeElement?.textContent).toBe("Chosen")
    })
  })

  describe(`Tooltip (${render.name})`, () => {
    const tooltipOpen = () => isPopoverOpen('[role="tooltip"]')

    it("opens at once on keyboard focus (focus-visible)", async () => {
      await render.tooltip({ content: "Keyboard help", label: "Info" })
      await userEvent.tab()
      await expect.element(page.getByRole("tooltip", { name: "Keyboard help" })).toBeVisible()
      await expect.element(page.getByRole("button", { name: "Info" })).toHaveAccessibleDescription("Keyboard help")
      await expectNoA11yViolations()
    })

    it("closes on Escape", async () => {
      await render.tooltip({ content: "Escape me", label: "Info" })
      await userEvent.tab()
      await expect.element(page.getByRole("tooltip", { name: "Escape me" })).toBeVisible()
      await userEvent.keyboard("{Escape}")
      await expect.poll(tooltipOpen).toBe(false)
    })

    describe("timing (fake timers)", () => {
      beforeEach(() => vi.useFakeTimers())
      afterEach(() => vi.useRealTimers())

      it("opens on hover only after delayDuration (500 ms)", async () => {
        await render.tooltip({ content: "Help text", label: "Hover me" })
        pointerEnter(page.getByRole("button", { name: "Hover me" }).element())
        await waitUntil(() => vi.getTimerCount() > 0)
        await advance(499)
        expect(tooltipOpen()).toBe(false)
        await advance(1)
        expect(tooltipOpen()).toBe(true)
      })

      it("stays open while the pointer moves onto it, and closes 150 ms after leaving it", async () => {
        await render.tooltip({ content: "Hoverable", label: "Trigger" })
        const button = page.getByRole("button", { name: "Trigger" }).element()
        pointerEnter(button)
        await waitUntil(() => vi.getTimerCount() > 0)
        await advance(500)
        expect(tooltipOpen()).toBe(true)

        const tip = document.querySelector<HTMLElement>('[role="tooltip"]')!
        pointerLeave(button)
        pointerEnter(tip)
        await flush()
        await advance(1000)
        expect(tooltipOpen()).toBe(true)

        pointerLeave(tip)
        await waitUntil(() => vi.getTimerCount() > 0)
        await advance(149)
        expect(tooltipOpen()).toBe(true)
        await advance(1)
        expect(tooltipOpen()).toBe(false)
      })

      it("does not open for touch pointers", async () => {
        await render.tooltip({ content: "Touch", label: "Tap" })
        const trigger = page.getByRole("button", { name: "Tap" }).element()
        trigger.dispatchEvent(new PointerEvent("pointerover", { pointerType: "touch", bubbles: true }))
        trigger.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "touch" }))
        await advance(2000)
        expect(tooltipOpen()).toBe(false)
      })
    })
  })

  describe(`DropdownMenu (${render.name})`, () => {
    const menuOpen = () => isPopoverOpen('[role="menu"]')
    // The item's own text, without its shortcut hint.
    const focused = () => {
      const el = document.activeElement
      if (!el) return ""
      return [...el.childNodes]
        .filter((n) => n.nodeType === Node.TEXT_NODE)
        .map((n) => n.textContent)
        .join("")
        .trim()
    }
    const trigger = () => page.getByRole("button", { name: "Actions" })
    const openAndFocusProfile = async () => {
      await userEvent.click(trigger())
      await expect.poll(menuOpen).toBe(true)
      ;(page.getByRole("menuitem", { name: /^Profile/ }).element() as HTMLElement).focus()
    }

    it("has the menu ARIA: trigger haspopup + expanded, menu named by the trigger", async () => {
      await render.dropdownMenu({})
      await expect.element(trigger()).toHaveAttribute("aria-haspopup", "menu")
      await expect.element(trigger()).toHaveAttribute("aria-expanded", "false")
      await userEvent.click(trigger())
      await expect.element(page.getByRole("menu", { name: "Actions" })).toBeVisible()
      await expect.element(trigger()).toHaveAttribute("aria-expanded", "true")
      await expectNoA11yViolations()
    })

    it("Enter and Space on the trigger open the menu and focus the first item", async () => {
      await render.dropdownMenu({})
      ;(trigger().element() as HTMLElement).focus()
      await userEvent.keyboard("{Enter}")
      await expect.poll(menuOpen).toBe(true)
      await expect.poll(focused).toBe("Profile")

      await userEvent.keyboard("{Escape}")
      await expect.poll(menuOpen).toBe(false)
      ;(trigger().element() as HTMLElement).focus()
      await userEvent.keyboard(" ")
      await expect.poll(menuOpen).toBe(true)
      await expect.poll(focused).toBe("Profile")
    })

    it("ArrowDown opens on the first item and ArrowUp opens on the last", async () => {
      await render.dropdownMenu({})
      ;(trigger().element() as HTMLElement).focus()
      await userEvent.keyboard("{ArrowDown}")
      await expect.poll(menuOpen).toBe(true)
      await expect.poll(focused).toBe("Profile")

      await userEvent.keyboard("{Escape}")
      await expect.poll(menuOpen).toBe(false)
      ;(trigger().element() as HTMLElement).focus()
      await userEvent.keyboard("{ArrowUp}")
      await expect.poll(menuOpen).toBe(true)
      await expect.poll(focused).toBe("Delete")
    })

    it("moves with arrows, loops, and skips the disabled item", async () => {
      await render.dropdownMenu({})
      await openAndFocusProfile()
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
      await render.dropdownMenu({})
      await openAndFocusProfile()
      await userEvent.keyboard("b")
      expect(focused()).toBe("Billing")
    })

    it("Escape closes and returns focus to the trigger", async () => {
      await render.dropdownMenu({})
      await openAndFocusProfile()
      await userEvent.keyboard("{Escape}")
      await expect.poll(menuOpen).toBe(false)
      await expect.element(trigger()).toHaveFocus()
    })

    it("Tab closes the menu and lets focus move on", async () => {
      await render.dropdownMenu({})
      await openAndFocusProfile()
      await userEvent.keyboard("{Tab}")
      await expect.poll(menuOpen).toBe(false)
      await expect.element(page.getByRole("button", { name: "After" })).toHaveFocus()
    })

    it("Enter selects the item and closes the menu", async () => {
      const onSelect = vi.fn()
      await render.dropdownMenu({ onSelect })
      await openAndFocusProfile()
      await userEvent.keyboard("{Enter}")
      expect(onSelect).toHaveBeenCalledWith("Profile")
      await expect.poll(menuOpen).toBe(false)
    })

    it("a mouse-opened menu focuses the menu container, and ArrowDown then enters the items", async () => {
      await render.dropdownMenu({})
      await userEvent.click(trigger())
      await expect.element(page.getByRole("menu", { name: "Actions" })).toHaveFocus()
      await userEvent.keyboard("{ArrowDown}")
      expect(focused()).toBe("Profile")
    })

    it("a checkbox item toggles and stays open", async () => {
      const onCheckedChange = vi.fn()
      await render.dropdownMenu({ onCheckedChange })
      await userEvent.click(trigger())
      ;(page.getByRole("menuitemcheckbox", { name: "Status bar" }).element() as HTMLElement).focus()
      await userEvent.keyboard(" ")
      expect(onCheckedChange).toHaveBeenCalledWith(true)
      await expect.element(page.getByRole("menuitemcheckbox", { name: "Status bar" })).toHaveAttribute("aria-checked", "true")
      expect(menuOpen()).toBe(true)
    })

    it("a radio group changes the checked item with Enter, and stays open", async () => {
      const onRadio = vi.fn()
      await render.dropdownMenu({ onRadio })
      await userEvent.click(trigger())
      ;(page.getByRole("menuitemradio", { name: "Light" }).element() as HTMLElement).focus()
      await userEvent.keyboard("{Enter}")
      expect(onRadio).toHaveBeenCalledWith("light")
      await expect.element(page.getByRole("menuitemradio", { name: "Light" })).toHaveAttribute("aria-checked", "true")
      await expect.element(page.getByRole("menuitemradio", { name: "System" })).toHaveAttribute("aria-checked", "false")
      expect(menuOpen()).toBe(true)
    })

    it("preventDefault in onSelect keeps the menu open", async () => {
      const onSelect = vi.fn()
      await render.dropdownMenu({ keepOpen: true, onSelect })
      await userEvent.click(trigger())
      ;(page.getByRole("menuitem", { name: "Keep open" }).element() as HTMLElement).focus()
      await userEvent.keyboard("{Enter}")
      expect(onSelect).toHaveBeenCalledWith("Keep")
      expect(menuOpen()).toBe(true)
    })
  })

  describe(`AlertDialog (${render.name})`, () => {
    const dialogOpen = () => !!document.querySelector("dialog")?.open
    const openIt = () => userEvent.click(page.getByRole("button", { name: "Delete account" }))

    it("has role alertdialog, named and described, with no close icon", async () => {
      await render.alertDialog({})
      await openIt()
      const dialog = page.getByRole("alertdialog", { name: "Delete your account?" })
      await expect.element(dialog).toBeVisible()
      await expect.element(dialog).toHaveAccessibleDescription("This cannot be undone.")
      expect(page.getByRole("button", { name: "Close" }).elements()).toHaveLength(0)
      await expectNoA11yViolations()
    })

    it("starts focus on Cancel", async () => {
      await render.alertDialog({})
      await openIt()
      await expect.poll(dialogOpen).toBe(true)
      await expect.poll(() => document.activeElement?.textContent?.trim()).toBe("Cancel")
    })

    it("does not close on a backdrop click", async () => {
      await render.alertDialog({})
      await openIt()
      await expect.poll(dialogOpen).toBe(true)
      await userEvent.click(document.body, { position: { x: 4, y: 4 } })
      await new Promise((r) => setTimeout(r, 50))
      expect(dialogOpen()).toBe(true)
    })

    it("closes on Escape", async () => {
      await render.alertDialog({})
      await openIt()
      await expect.poll(dialogOpen).toBe(true)
      await userEvent.keyboard("{Escape}")
      await expect.poll(dialogOpen).toBe(false)
    })

    it("the action closes it and calls onClick", async () => {
      const onConfirm = vi.fn()
      await render.alertDialog({ onConfirm })
      await openIt()
      await userEvent.click(page.getByRole("button", { name: "Delete", exact: true }))
      expect(onConfirm).toHaveBeenCalledTimes(1)
      await expect.poll(dialogOpen).toBe(false)
    })

    it("preventDefault in onClick keeps it open", async () => {
      await render.alertDialog({ onConfirm: (e) => e.preventDefault() })
      await openIt()
      await userEvent.click(page.getByRole("button", { name: "Delete", exact: true }))
      await new Promise((r) => setTimeout(r, 50))
      expect(dialogOpen()).toBe(true)
    })
  })

  describe(`Toast (${render.name})`, () => {
    const { toast } = render
    const items = () => Array.from(document.querySelectorAll("[data-glob-toaster] li"))
    const region = (role: "status" | "alert") =>
      document.querySelector(`[data-glob-toaster] [role="${role}"]`)?.textContent?.replace(/\s+/g, " ").trim() ?? ""
    const toasterOpen = () => !!document.querySelector("[data-glob-toaster] section:popover-open")
    const texts = () => items().map((li) => li.textContent?.trim())

    // The store is module state, so every test starts from an empty store. Fake timers drive durations and the
    // 200 ms exit animation.
    beforeEach(() => vi.useFakeTimers())
    afterEach(async () => {
      toast.dismiss()
      if (vi.isFakeTimers()) {
        vi.advanceTimersByTime(300)
        await flush()
        vi.useRealTimers()
      }
      await vi.waitFor(() => expect(document.querySelectorAll("[data-glob-toaster] li")).toHaveLength(0))
    })

    it("routes polite variants to role=status and urgent ones to role=alert", async () => {
      await render.toaster({ max: 5 })
      toast({ title: "Default one" })
      toast.success("Saved")
      toast.info("FYI")
      toast.warning("Careful")
      toast.error("Broke")
      await flush()
      expect(region("status")).toContain("Default one")
      expect(region("status")).toContain("Saved")
      expect(region("status")).toContain("FYI")
      expect(region("status")).not.toContain("Careful")
      expect(region("alert")).toContain("Careful")
      expect(region("alert")).toContain("Broke")
      expect(items()).toHaveLength(5)
      // axe schedules its own timers, which the fake clock would never run.
      vi.useRealTimers()
      await expectNoA11yViolations()
    })

    it("keeps both live regions in the DOM before any toast arrives", async () => {
      await render.toaster({})
      await flush()
      await expect.element(page.getByRole("status")).toBeInTheDocument()
      await expect.element(page.getByRole("alert")).toBeInTheDocument()
      expect(region("status")).toBe("")
      expect(toasterOpen()).toBe(false)
    })

    it("shows the title and description; the string overload takes options", async () => {
      await render.toaster({})
      toast({ title: "Upload", description: "3 files" })
      toast("Plain title", { description: "with options" })
      await flush()
      await expect.element(page.getByText("Upload")).toBeVisible()
      await expect.element(page.getByText("3 files")).toBeVisible()
      await expect.element(page.getByText("Plain title")).toBeVisible()
      await expect.element(page.getByText("with options")).toBeVisible()
    })

    it("auto-dismisses after its duration", async () => {
      await render.toaster({})
      toast({ title: "Short", duration: 1000 })
      await flush()
      expect(items()).toHaveLength(1)
      await advance(999)
      expect(items()).toHaveLength(1)
      await advance(1 + 200)
      expect(items()).toHaveLength(0)
    })

    it("keeps a sticky toast (duration Infinity) until it is closed", async () => {
      await render.toaster({})
      toast({ title: "Sticky", duration: Infinity })
      await flush()
      await advance(60_000)
      expect(items()).toHaveLength(1)
      await userEvent.click(page.getByRole("button", { name: "Close notification" }))
      await advance(300)
      expect(items()).toHaveLength(0)
    })

    it("pauses while hovered and resumes the remaining time on leave", async () => {
      await render.toaster({})
      toast({ title: "Hover me", duration: 1000 })
      await flush()
      await userEvent.hover(items()[0])
      await flush()
      await advance(5000)
      expect(items()).toHaveLength(1)

      await userEvent.hover(document.body, { position: { x: 4, y: 4 } })
      await flush()
      await advance(999)
      expect(items()).toHaveLength(1)
      await advance(1 + 200)
      expect(items()).toHaveLength(0)
    })

    it("dismiss(id) removes only that toast; dismiss() removes all", async () => {
      await render.toaster({})
      const keep = toast("keep", { duration: Infinity })
      const drop = toast("drop", { duration: Infinity })
      toast.dismiss(drop)
      await advance(300)
      expect(texts()).toEqual(["keep"])
      toast.dismiss()
      await advance(300)
      expect(items()).toHaveLength(0)
      expect(keep).not.toBe(drop)
    })

    it("runs the action and dismisses the toast", async () => {
      const onClick = vi.fn()
      await render.toaster({})
      toast({ title: "Archived", duration: Infinity, action: { label: "Undo", onClick } })
      await flush()
      await userEvent.click(page.getByRole("button", { name: "Undo" }))
      expect(onClick).toHaveBeenCalledOnce()
      await advance(300)
      expect(items()).toHaveLength(0)
    })

    it("shows max toasts at once and queues the rest", async () => {
      await render.toaster({ max: 3 })
      for (let i = 1; i <= 5; i++) toast({ title: `Toast ${i}`, duration: Infinity })
      await flush()
      expect(texts()).toEqual(["Toast 1", "Toast 2", "Toast 3"])
      expect(page.getByText("Toast 4").elements()).toHaveLength(0)

      await userEvent.click(page.getByRole("button", { name: "Close notification" }).first().element())
      await advance(300)
      expect(texts()).toEqual(["Toast 2", "Toast 3", "Toast 4"])
    })

    it("the Toaster position prop places the container", async () => {
      await render.toaster({ position: "top-left" })
      toast("Positioned")
      await flush()
      const section = document.querySelector("[data-glob-toaster] section") as HTMLElement
      expect(section.className).toContain("top-0")
      expect(section.className).toContain("left-0")
    })

    it("inside a modal dialog: shown above it, not inert, and its buttons are clickable", async () => {
      vi.useRealTimers()
      const onUndo = vi.fn()
      await render.toaster({
        inDialog: { onSave: () => toast({ title: "Draft saved", duration: Infinity, action: { label: "Undo", onClick: onUndo } }) },
      })
      await userEvent.click(page.getByRole("button", { name: "Open dialog" }))
      await expect.element(page.getByRole("dialog", { name: "Settings" })).toBeVisible()
      await userEvent.click(page.getByRole("button", { name: "Save draft" }))
      await expect.element(page.getByRole("button", { name: "Undo" })).toBeVisible()

      const host = document.querySelector("[data-glob-toaster]")!
      await expect.poll(() => host.parentElement?.tagName).toBe("DIALOG")
      expect(host.closest("[inert]")).toBeNull()

      const undo = page.getByRole("button", { name: "Undo" }).element() as HTMLElement
      const rect = undo.getBoundingClientRect()
      const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
      expect(undo.contains(hit)).toBe(true)

      await userEvent.click(page.getByRole("button", { name: "Undo" }))
      expect(onUndo).toHaveBeenCalledOnce()
      expect((document.querySelector("dialog") as HTMLDialogElement).open).toBe(true)
    })
  })

  describe(`Select (${render.name})`, () => {
    const trigger = () => page.getByRole("combobox")
    const selectedText = () => document.querySelector('[role="combobox"]')?.textContent?.trim()
    const focusTrigger = () => (trigger().element() as HTMLElement).focus()

    it("has the combobox ARIA and opens with Enter, Space, ArrowDown and ArrowUp", async () => {
      await render.select({ options: THREE_FRUITS, defaultValue: "pear" })
      await expect.element(trigger()).toHaveAttribute("aria-haspopup", "listbox")
      await expect.element(trigger()).toHaveAttribute("aria-expanded", "false")
      await expect.element(trigger()).toHaveTextContent("Pear")

      focusTrigger()
      await userEvent.keyboard("{Enter}")
      await expect.element(trigger()).toHaveAttribute("aria-expanded", "true")
      expect(activeOption()).toBe("Pear")
      await expectNoA11yViolations()

      await userEvent.keyboard("{Escape}")
      await userEvent.keyboard(" ")
      await expect.poll(listOpen).toBe(true)
      await userEvent.keyboard("{Escape}")
      await userEvent.keyboard("{ArrowDown}")
      await expect.poll(listOpen).toBe(true)
      await userEvent.keyboard("{Escape}")
      await userEvent.keyboard("{ArrowUp}")
      await expect.poll(listOpen).toBe(true)
    })

    it("moves the active option with arrows, Home and End, and skips disabled options", async () => {
      await render.select({ options: EIGHT_FRUITS, defaultValue: "apple" })
      focusTrigger()
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
      await render.select({ options: THREE_FRUITS, defaultValue: "apple", onChange })
      focusTrigger()
      await userEvent.keyboard("{Enter}")
      await userEvent.keyboard("{ArrowDown}")
      await userEvent.keyboard("{Enter}")
      expect(onChange).toHaveBeenCalledWith("banana")
      expect(selectedText()).toBe("Banana")
      await expect.poll(listOpen).toBe(false)
      await expect.element(trigger()).toHaveFocus()
    })

    it("typeahead moves to the next option starting with the typed letters", async () => {
      await render.select({ options: EIGHT_FRUITS, defaultValue: "apple" })
      focusTrigger()
      await userEvent.keyboard("{Enter}")
      await userEvent.keyboard("l")
      expect(activeOption()).toBe("Lime")
    })

    it("Escape closes without changing the value", async () => {
      const onChange = vi.fn()
      await render.select({ options: THREE_FRUITS, defaultValue: "apple", onChange })
      focusTrigger()
      await userEvent.keyboard("{Enter}")
      await userEvent.keyboard("{ArrowDown}{ArrowDown}")
      await userEvent.keyboard("{Escape}")
      await expect.poll(listOpen).toBe(false)
      expect(onChange).not.toHaveBeenCalled()
      expect(selectedText()).toBe("Apple")
      await expect.element(trigger()).toHaveFocus()
    })

    it("Tab selects the active option and lets focus move on", async () => {
      const onChange = vi.fn()
      await render.select({ options: THREE_FRUITS, defaultValue: "apple", onChange, withNext: true })
      focusTrigger()
      await userEvent.keyboard("{Enter}")
      await userEvent.keyboard("{ArrowDown}")
      await userEvent.keyboard("{Tab}")
      expect(onChange).toHaveBeenCalledWith("banana")
      await expect.poll(listOpen).toBe(false)
      await expect.element(page.getByRole("button", { name: "Next" })).toHaveFocus()
    })

    it("above 8 options: moves focus to the search field and filters the list", async () => {
      await render.select({ options: FRUITS, defaultValue: "apple" })
      focusTrigger()
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
      await render.select({ options: FRUITS, defaultValue: "apple", onChange })
      focusTrigger()
      await userEvent.keyboard("{Enter}")
      await userEvent.keyboard("gr")
      await userEvent.keyboard("{Enter}")
      expect(onChange).toHaveBeenCalledWith("grape")
      await expect.poll(listOpen).toBe(false)
    })

    it("clears the search when the list reopens after a selection", async () => {
      await render.select({ options: FRUITS, defaultValue: "apple" })
      focusTrigger()
      await userEvent.keyboard("{Enter}")
      await userEvent.keyboard("+44x")
      await userEvent.keyboard("{Escape}")
      await userEvent.keyboard("{Enter}")
      const search = () => page.getByRole("textbox", { name: "Search options" }).element() as HTMLInputElement
      expect(search().value).toBe("")
      expect(document.querySelectorAll('[role="option"]')).toHaveLength(9)

      await userEvent.keyboard("pl")
      await userEvent.keyboard("{Enter}")
      expect(selectedText()).toBe("Apple")
      await userEvent.keyboard("{Enter}")
      expect(search().value).toBe("")
      expect(document.querySelectorAll('[role="option"]')).toHaveLength(9)
    })

    it("submits the value with a native form through a hidden input", async () => {
      await render.select({ options: THREE_FRUITS, defaultValue: "pear", name: "fruit", inForm: true })
      const form = document.querySelector("form")!
      expect(new FormData(form).get("fruit")).toBe("pear")
      focusTrigger()
      await userEvent.keyboard("{Enter}")
      await userEvent.keyboard("{ArrowUp}{Enter}")
      await expect.poll(() => new FormData(form).get("fruit")).toBe("banana")
    })
  })

  describe(`Combobox (${render.name})`, () => {
    const input = () => page.getByRole("combobox").element() as HTMLInputElement
    const isExpanded = () => input().getAttribute("aria-expanded") === "true"

    it("wires the combobox ARIA attributes and passes axe closed and open", async () => {
      await render.combobox({ options: FRAMEWORKS })
      const field = page.getByRole("combobox", { name: "Framework" })
      await expect.element(field).toHaveAttribute("aria-expanded", "false")
      await expectNoA11yViolations()

      await userEvent.click(field)
      await expect.element(field).toHaveAttribute("aria-expanded", "true")
      const list = page.getByRole("listbox", { name: "Framework" }).element()
      expect(input().getAttribute("aria-controls")).toBe(list.id)
      const active = document.getElementById(input().getAttribute("aria-activedescendant") ?? "")
      expect(active?.getAttribute("role")).toBe("option")
      expect(active?.textContent).toContain("React")
      await expectNoA11yViolations()
    })

    it("filters as you type, ignoring accents", async () => {
      await render.combobox({ options: FRAMEWORKS })
      await userEvent.fill(input(), "cancion")
      expect(optionNames()).toEqual(["Canción"])
      await userEvent.fill(input(), "")
      expect(optionNames().length).toBe(5)
    })

    it("arrows and Enter select the option, call onChange and show its label", async () => {
      const onChange = vi.fn()
      await render.combobox({ options: FRAMEWORKS, onChange })
      await userEvent.click(page.getByRole("combobox"))
      await userEvent.keyboard("{ArrowDown}{Enter}")
      expect(onChange).toHaveBeenLastCalledWith("vue")
      await expect.poll(() => input().value).toBe("Vue")
      expect(isExpanded()).toBe(false)
    })

    it("skips a disabled option with the arrows and does not select it on click", async () => {
      const onChange = vi.fn()
      await render.combobox({ options: FRAMEWORKS, onChange })
      await userEvent.click(page.getByRole("combobox"))
      await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}")
      const active = document.getElementById(input().getAttribute("aria-activedescendant") ?? "")
      expect(active?.textContent).toContain("Angular")
      ;(page.getByRole("option", { name: "Svelte" }).element() as HTMLElement).click()
      expect(onChange).not.toHaveBeenCalledWith("svelte")
    })

    it("Escape closes the list, and a second Escape clears the text and the value", async () => {
      const onChange = vi.fn()
      await render.combobox({ options: FRAMEWORKS, defaultValue: "vue", onChange })
      await userEvent.click(page.getByRole("combobox"))
      await expect.poll(isExpanded).toBe(true)
      await userEvent.keyboard("{Escape}")
      await expect.poll(isExpanded).toBe(false)
      await userEvent.keyboard("{Escape}")
      await expect.poll(() => input().value).toBe("")
      expect(onChange).toHaveBeenLastCalledWith(null)
    })

    it("restores the selected label on blur when the text is not committed", async () => {
      await render.combobox({ options: FRAMEWORKS, defaultValue: "react" })
      await userEvent.fill(input(), "zzz")
      await userEvent.click(document.body, { position: { x: 4, y: 4 } })
      await expect.poll(() => input().value).toBe("React")
    })

    it("commits free text with allowCustomValue", async () => {
      const onChange = vi.fn()
      await render.combobox({ options: FRAMEWORKS, allowCustomValue: true, onChange })
      await userEvent.fill(input(), "Qwik")
      await expect.element(page.getByRole("option", { name: 'Use "Qwik"' })).toBeVisible()
      await userEvent.keyboard("{Enter}")
      expect(onChange).toHaveBeenLastCalledWith("Qwik")
      await expect.poll(() => input().value).toBe("Qwik")
    })

    it("the clear button empties the field, clears the value and refocuses the input", async () => {
      const onChange = vi.fn()
      await render.combobox({ options: FRAMEWORKS, defaultValue: "vue", onChange })
      await userEvent.click(page.getByRole("button", { name: "Clear" }))
      await expect.poll(() => input().value).toBe("")
      expect(onChange).toHaveBeenLastCalledWith(null)
      expect(document.activeElement).toBe(input())
    })

    it("announces loading and empty states in a status region", async () => {
      await render.combobox({ options: FRAMEWORKS, loading: true })
      await userEvent.click(page.getByRole("combobox"))
      await expect.element(page.getByRole("status").getByText("Loading…")).toBeVisible()
      await userEvent.fill(input(), "nothing matches this")
      await expect.element(page.getByRole("status").getByText("Loading…")).toBeVisible()
    })

    it("shows the empty message when nothing matches, and option descriptions", async () => {
      await render.combobox({ options: FRAMEWORKS })
      await userEvent.click(page.getByRole("combobox"))
      expect(page.getByRole("option", { name: /Angular/ }).element().textContent).toContain("Google's framework")
      await userEvent.fill(input(), "nothing matches this")
      await expect.element(page.getByRole("status").getByText("No results.")).toBeVisible()
    })
  })

  describe(`MultiSelect (${render.name})`, () => {
    const combo = () => page.getByRole("combobox")
    const focusCombo = () => (combo().element() as HTMLElement).focus()
    const optionState = (label: string) => {
      const opt = Array.from(document.querySelectorAll('[role="option"]')).find((o) => o.textContent?.trim() === label)
      return { selected: opt?.getAttribute("aria-selected"), disabled: opt?.getAttribute("aria-disabled") }
    }

    it("has the listbox ARIA and Enter/Space toggle options without closing", async () => {
      const onChange = vi.fn()
      await render.multiSelect({ options: THREE_TAGS, defaultValue: [], onChange, name: "tags" })
      focusCombo()
      await userEvent.keyboard("{Enter}")
      await expect.element(combo()).toHaveAttribute("aria-expanded", "true")
      expect(listbox()?.getAttribute("aria-multiselectable")).toBe("true")
      await expectNoA11yViolations()

      await userEvent.keyboard(" ")
      expect(onChange).toHaveBeenLastCalledWith(["design"])
      expect(listOpen()).toBe(true)
    })

    it("keeps the list open while several options are toggled, and Escape closes it", async () => {
      await render.multiSelect({ options: THREE_TAGS, defaultValue: ["design"], name: "tags" })
      focusCombo()
      await userEvent.keyboard("{Enter}")
      await userEvent.keyboard("{ArrowDown}{Enter}")
      await userEvent.keyboard("{ArrowDown}{Enter}")
      await expect.poll(() => hiddenValues("tags")).toEqual(["design", "code", "docs"])
      expect(listOpen()).toBe(true)
      await userEvent.keyboard("{Escape}")
      await expect.poll(listOpen).toBe(false)
    })

    it("moves with arrows and Home/End over the list", async () => {
      await render.multiSelect({ options: THREE_TAGS, defaultValue: [], name: "tags" })
      focusCombo()
      await userEvent.keyboard("{Enter}")
      expect(activeOption()).toBe("Design")
      await userEvent.keyboard("{End}")
      expect(activeOption()).toBe("Docs")
      await userEvent.keyboard("{Home}")
      expect(activeOption()).toBe("Design")
    })

    it("Tab closes the list and lets focus move on", async () => {
      await render.multiSelect({ options: THREE_TAGS, defaultValue: [], name: "tags", withNext: true })
      focusCombo()
      await userEvent.keyboard("{Enter}")
      await userEvent.keyboard("{Tab}")
      await expect.poll(listOpen).toBe(false)
      await expect.element(page.getByRole("button", { name: "Next" })).toHaveFocus()
    })

    it("removes a chip with its keyboard-reachable Remove button", async () => {
      await render.multiSelect({ options: THREE_TAGS, defaultValue: ["design", "code"], name: "tags" })
      ;(page.getByRole("button", { name: "Remove Design" }).element() as HTMLElement).focus()
      await userEvent.keyboard("{Enter}")
      await expect.poll(() => hiddenValues("tags")).toEqual(["code"])
      await expect.element(page.getByRole("button", { name: "Remove Design" })).not.toBeInTheDocument()
    })

    it("Backspace in an empty search removes the last chip", async () => {
      await render.multiSelect({ options: TAGS, defaultValue: ["design", "code"], name: "tags" })
      focusCombo()
      await userEvent.keyboard("{Enter}")
      await expect.element(page.getByRole("textbox", { name: "Search options" })).toHaveFocus()
      await userEvent.keyboard("{Backspace}")
      await expect.poll(() => hiddenValues("tags")).toEqual(["design"])
    })

    it("filters with search above 8 options and toggles the active match with Enter", async () => {
      await render.multiSelect({ options: TAGS, defaultValue: [], name: "tags" })
      focusCombo()
      await userEvent.keyboard("{Enter}")
      await userEvent.keyboard("da")
      expect(document.querySelectorAll('[role="option"]')).toHaveLength(1)
      expect(activeOption()).toBe("Data")
      await userEvent.keyboard("{Enter}")
      await expect.poll(() => hiddenValues("tags")).toEqual(["data"])
    })

    it("disables unselected options once max is reached", async () => {
      await render.multiSelect({ options: THREE_TAGS, defaultValue: ["design", "code"], max: 2, name: "tags" })
      focusCombo()
      await userEvent.keyboard("{Enter}")
      expect(optionState("Design").selected).toBe("true")
      expect(optionState("Code").selected).toBe("true")
      expect(optionState("Docs").disabled).toBe("true")
      expect(optionState("Code").disabled).toBeNull()
    })

    it("submits one hidden input per value with a native form", async () => {
      await render.multiSelect({ options: THREE_TAGS, defaultValue: ["design", "docs"], name: "tags", inForm: true })
      expect(new FormData(document.querySelector("form")!).getAll("tags")).toEqual(["design", "docs"])
    })
  })

  describe(`Command (${render.name})`, () => {
    const input = () => page.getByRole("combobox", { name: "Command menu" }).element() as HTMLInputElement
    // The first word of the option text: the shortcut is not part of the name checked.
    const activeName = () => {
      const id = input().getAttribute("aria-activedescendant")
      return id ? document.getElementById(id)?.textContent?.trim().split(" ")[0] : undefined
    }

    it("passes axe and wires the search field to the list", async () => {
      await render.command({})
      expect(input().getAttribute("aria-controls")).toBe(page.getByRole("listbox", { name: "Command menu" }).element().id)
      expect(input().getAttribute("aria-expanded")).toBe("true")
      await expect.poll(activeName).toBe("Calendar")
      await expectNoA11yViolations()
    })

    it("filters items, hides empty groups and separators while searching", async () => {
      await render.command({})
      await userEvent.fill(input(), "prof")
      await expect.poll(optionNames).toEqual(["Profile"])
      const groups = Array.from(document.querySelectorAll('[role="group"]')) as HTMLElement[]
      expect(groups.find((g) => g.textContent?.includes("Suggestions"))?.hidden).toBe(true)
      expect(document.querySelector('[role="none"]')?.hasAttribute("hidden")).toBe(true)
    })

    it("matches accents, keywords and every word in any order", async () => {
      await render.command({})
      await userEvent.fill(input(), "cancion")
      await expect.poll(optionNames).toEqual(["Canción"])
      await userEvent.fill(input(), "mode dark")
      await expect.poll(optionNames).toEqual(["Theme"])
    })

    it("arrows skip disabled items and aria-activedescendant follows them", async () => {
      await render.command({})
      await expect.poll(activeName).toBe("Calendar")
      input().focus()
      await userEvent.keyboard("{ArrowDown}")
      expect(activeName()).toBe("Canción")
      await userEvent.keyboard("{ArrowDown}")
      expect(activeName()).toBe("Theme")
    })

    it("Enter calls onSelect with the value of the active item", async () => {
      const onSelect = vi.fn()
      await render.command({ onSelect })
      await expect.poll(activeName).toBe("Calendar")
      input().focus()
      await userEvent.keyboard("{ArrowDown}{Enter}")
      expect(onSelect).toHaveBeenCalledWith("Canción")
    })

    it("shows CommandEmpty when nothing matches", async () => {
      await render.command({})
      await userEvent.fill(input(), "zzzz")
      await expect.element(page.getByRole("status").getByText("Nothing found.")).toBeVisible()
    })

    it("filter={false} shows everything and leaves filtering to the consumer", async () => {
      await render.command({ filter: false })
      await userEvent.fill(input(), "zzzz")
      expect(optionNames().length).toBe(5)
    })
  })

  describe(`CommandDialog (${render.name})`, () => {
    const dialogOpen = () => !!document.querySelector("dialog")?.open
    const settle = () => new Promise((r) => setTimeout(r, 50))

    it("opens with the shortcut, focuses the input, and closes with Escape", async () => {
      await render.commandDialog({})
      ;(page.getByRole("button", { name: "Open" }).element() as HTMLElement).focus()
      pressShortcut({ key: "k", ...modKey })
      await expect.poll(dialogOpen).toBe(true)
      await expect.poll(() => document.activeElement?.getAttribute("role")).toBe("combobox")
      await expectNoA11yViolations()
      await userEvent.keyboard("{Escape}")
      await expect.poll(dialogOpen).toBe(false)
    })

    it("the shortcut toggles the dialog, and the other platform's modifier does nothing", async () => {
      await render.commandDialog({})
      pressShortcut({ key: "k", ...(isMac ? { ctrlKey: true } : { metaKey: true }) })
      await settle()
      expect(dialogOpen()).toBe(false)
      pressShortcut({ key: "k", ...modKey })
      await expect.poll(dialogOpen).toBe(true)
      pressShortcut({ key: "k", ...modKey })
      await expect.poll(dialogOpen).toBe(false)
    })

    it("shortcut={false} disables the shortcut", async () => {
      await render.commandDialog({ shortcut: false })
      pressShortcut({ key: "k", ...modKey })
      await settle()
      expect(dialogOpen()).toBe(false)
    })

    it("modifiers must match exactly: mod+k does not fire with an extra Shift", async () => {
      await render.commandDialog({})
      pressShortcut({ key: "k", shiftKey: true, ...modKey })
      await settle()
      expect(dialogOpen()).toBe(false)
    })

    it("a multi-modifier shortcut ignores the bare key", async () => {
      await render.commandDialog({ shortcut: "ctrl+shift+p" })
      pressShortcut({ key: "p" })
      pressShortcut({ key: "p", ctrlKey: true })
      await settle()
      expect(dialogOpen()).toBe(false)
      pressShortcut({ key: "P", ctrlKey: true, shiftKey: true })
      await expect.poll(dialogOpen).toBe(true)
    })

    it("a shortcut without Ctrl or Meta does not fire while typing in a field", async () => {
      await render.commandDialog({ shortcut: "/", withField: true })
      pressShortcut({ key: "/" }, page.getByRole("textbox", { name: "Other field" }).element())
      await settle()
      expect(dialogOpen()).toBe(false)
      pressShortcut({ key: "/" }, document.body)
      await expect.poll(dialogOpen).toBe(true)
    })

    it("closes after a selection by default", async () => {
      const onSelect = vi.fn()
      await render.commandDialog({ onSelect })
      pressShortcut({ key: "k", ...modKey })
      await expect.poll(dialogOpen).toBe(true)
      await userEvent.click(page.getByRole("option", { name: "Toggle theme" }))
      expect(onSelect).toHaveBeenCalledWith("Toggle theme")
      await expect.poll(dialogOpen).toBe(false)
    })

    it("stays open after a selection with closeOnSelect={false}", async () => {
      await render.commandDialog({ closeOnSelect: false })
      pressShortcut({ key: "k", ...modKey })
      await expect.poll(dialogOpen).toBe(true)
      await userEvent.click(page.getByRole("option", { name: "Toggle theme" }))
      await settle()
      expect(dialogOpen()).toBe(true)
    })
  })
}
