import { describe, expect, it, beforeEach } from "vitest"
import { page, userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "../browser/a11y"
import type { DialogAdapter } from "./types"

/** Dialog: a modal on the native dialog element. It names itself, locks the page scroll, closes on Escape and returns focus. */
export function dialogContract(render: DialogAdapter) {
  describe(`Dialog (${render.name})`, () => {
    beforeEach(async () => {
      await page.viewport(1280, 800)
    })

    const trigger = (label: string) => page.getByRole("button", { name: label }).element() as HTMLElement
    const dialogEl = () => document.querySelector("dialog") as HTMLDialogElement

    it("opens as a modal named by its title, and locks the page scroll", async () => {
      await render.dialog({ title: "Confirm", triggerLabel: "Open dialog" })
      trigger("Open dialog").click()
      await expect.poll(() => dialogEl()?.open).toBe(true)
      expect(dialogEl().getAttribute("aria-labelledby")).toBeTruthy()
      expect(document.documentElement.style.overflow).toBe("hidden")
    })

    it("closes on Escape, unlocks the page scroll and returns focus to the trigger", async () => {
      await render.dialog({ title: "Confirm", triggerLabel: "Open dialog" })
      const opener = trigger("Open dialog")
      opener.focus()
      opener.click()
      await expect.poll(() => dialogEl()?.open).toBe(true)
      await userEvent.keyboard("{Escape}")
      await expect.poll(() => dialogEl()?.open).toBe(false)
      expect(document.documentElement.style.overflow).not.toBe("hidden")
      expect(document.activeElement).toBe(opener)
    })

    it("passes axe while open", async () => {
      await render.dialog({ title: "Confirm", triggerLabel: "Open dialog" })
      trigger("Open dialog").click()
      await expect.poll(() => dialogEl()?.open).toBe(true)
      await expectNoA11yViolations()
    })
  })
}
