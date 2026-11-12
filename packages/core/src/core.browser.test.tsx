// Core controllers against the DOM, with no framework. Each one is driven by plain DOM calls.
import { afterEach, describe, expect, it, vi } from "vitest"
import { attachRovingFocus, createFloatingPanel, getLayoutScroll, lockScroll, scrollLockCount } from "./index"

const nodes: HTMLElement[] = []
function add<T extends HTMLElement>(el: T): T {
  document.body.appendChild(el)
  nodes.push(el)
  return el
}
afterEach(() => {
  nodes.splice(0).forEach((el) => el.remove())
  document.documentElement.style.overflow = ""
  document.documentElement.style.paddingRight = ""
})

describe("lockScroll", () => {
  it("locks while any lock is held and unlocks after the last release", () => {
    const first = lockScroll()
    const second = lockScroll()
    expect(document.documentElement.style.overflow).toBe("hidden")
    first()
    expect(document.documentElement.style.overflow).toBe("hidden")
    second()
    expect(document.documentElement.style.overflow).not.toBe("hidden")
    expect(scrollLockCount()).toBe(0)
  })

  it("ignores a second release of the same lock", () => {
    const release = lockScroll()
    release()
    release()
    expect(scrollLockCount()).toBe(0)
  })
})

describe("getLayoutScroll", () => {
  it("returns the nearest scroll region, or the document scroller outside a layout", () => {
    const region = add(document.createElement("div"))
    region.dataset.scroll = "scroll"
    const child = document.createElement("span")
    region.appendChild(child)
    expect(getLayoutScroll(child)).toBe(region)
    expect(getLayoutScroll(null)).toBe(document.scrollingElement)
  })

  it("ignores fixed regions", () => {
    const fixed = add(document.createElement("div"))
    fixed.dataset.scroll = "fixed"
    expect(getLayoutScroll(fixed)).toBe(document.scrollingElement)
  })
})

describe("attachRovingFocus", () => {
  it("moves focus between items with the arrow keys and calls onNavigate", () => {
    const root = add(document.createElement("div"))
    const items = ["One", "Two", "Three"].map((label) => {
      const button = document.createElement("button")
      button.dataset.rovingItem = ""
      button.textContent = label
      root.appendChild(button)
      return button
    })
    const onNavigate = vi.fn()
    const detach = attachRovingFocus(root, { onNavigate })
    items[0].focus()
    items[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }))
    expect(document.activeElement).toBe(items[1])
    expect(onNavigate).toHaveBeenCalledWith(items[1])
    detach()
  })
})

describe("createFloatingPanel", () => {
  it("shows the popover while open, and reports a browser close to onOpenChange", async () => {
    const trigger = add(document.createElement("button"))
    trigger.textContent = "Open"
    const panel = add(document.createElement("div"))
    panel.setAttribute("popover", "manual")
    const onOpenChange = vi.fn()
    const onPosition = vi.fn()
    const controller = createFloatingPanel(trigger, panel, { open: true, onOpenChange, onPosition, restoreFocus: false })
    expect(panel.matches(":popover-open")).toBe(true)
    await vi.waitFor(() => expect(onPosition).toHaveBeenCalled())
    expect(onPosition.mock.lastCall?.[0]).toMatchObject({ isPositioned: true })

    panel.hidePopover()
    // The toggle event is dispatched asynchronously after hidePopover().
    await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
    controller.destroy()
  })

  it("hides the popover when open becomes false", () => {
    const trigger = add(document.createElement("button"))
    const panel = add(document.createElement("div"))
    panel.setAttribute("popover", "manual")
    const onOpenChange = vi.fn()
    const controller = createFloatingPanel(trigger, panel, { open: true, onOpenChange })
    controller.update({ open: false, onOpenChange })
    expect(panel.matches(":popover-open")).toBe(false)
    expect(onOpenChange).not.toHaveBeenCalled()
    controller.destroy()
  })
})
