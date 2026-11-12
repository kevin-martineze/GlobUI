import { describe, expect, it, beforeEach } from "vitest"
import { page, userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "../browser/a11y"
import type { SheetAdapter } from "./types"

/** Sheet: a Dialog pinned to an edge. Same modal behaviour: named, scroll lock, Escape, focus return, axe. */
export function sheetContract(render: SheetAdapter) {
  describe(`Sheet (${render.name})`, () => {
    beforeEach(async () => {
      await page.viewport(1280, 800)
    })

    const trigger = (label: string) => page.getByRole("button", { name: label }).element() as HTMLElement
    const dialogEl = () => document.querySelector("dialog") as HTMLDialogElement

    it("opens as a modal named by its title, and locks the page scroll", async () => {
      await render.sheet({ title: "Filters", triggerLabel: "Open sheet" })
      trigger("Open sheet").click()
      await expect.poll(() => dialogEl()?.open).toBe(true)
      expect(dialogEl().getAttribute("aria-labelledby")).toBeTruthy()
      expect(document.documentElement.style.overflow).toBe("hidden")
    })

    it("closes on Escape and returns focus to the trigger", async () => {
      await render.sheet({ title: "Filters", triggerLabel: "Open sheet" })
      const opener = trigger("Open sheet")
      opener.focus()
      opener.click()
      await expect.poll(() => dialogEl()?.open).toBe(true)
      await userEvent.keyboard("{Escape}")
      await expect.poll(() => dialogEl()?.open).toBe(false)
      expect(document.activeElement).toBe(opener)
    })

    it("passes axe while open", async () => {
      await render.sheet({ title: "Filters", triggerLabel: "Open sheet" })
      trigger("Open sheet").click()
      await expect.poll(() => dialogEl()?.open).toBe(true)
      await expectNoA11yViolations()
    })
  })
}
