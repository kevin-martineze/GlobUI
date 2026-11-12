import { describe, expect, it, beforeEach } from "vitest"
import { page, userEvent } from "vitest/browser"
import type { AppShellAdapter } from "./types"

/**
 * Mobile navigation: below `lg` the sidebar is not inline. The header trigger opens it in a Sheet,
 * Escape closes it, and focus returns to the trigger. Reuses the AppShell fixture.
 */
export function mobileNavContract(render: AppShellAdapter) {
  describe(`mobile navigation (${render.name})`, () => {
    beforeEach(async () => {
      await page.viewport(500, 800)
    })

    const trigger = () => page.getByRole("button", { name: "Open navigation" }).element() as HTMLElement
    const dialogEl = () => document.querySelector("dialog") as HTMLDialogElement

    it("hides the inline sidebar and shows the trigger", async () => {
      await render.appShell({ tall: false })
      const inline = document.querySelector('[data-slot="sidebar"]') as HTMLElement
      expect(getComputedStyle(inline).display).toBe("none")
      expect(getComputedStyle(trigger()).display).not.toBe("none")
    })

    it("opens the navigation in a dialog and closes it on Escape, returning focus to the trigger", async () => {
      await render.appShell({ tall: false })
      const opener = trigger()
      opener.focus()
      opener.click()
      await expect.poll(() => dialogEl()?.open).toBe(true)
      expect(dialogEl().querySelector('a[href="#orders"]')).not.toBeNull()
      await userEvent.keyboard("{Escape}")
      await expect.poll(() => dialogEl()?.open).toBe(false)
      expect(document.activeElement).toBe(opener)
    })
  })
}
