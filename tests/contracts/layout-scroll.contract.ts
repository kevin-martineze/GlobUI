import { describe, expect, it, beforeEach } from "vitest"
import { page } from "vitest/browser"
import type { LayoutScrollAdapter } from "./types"

/**
 * useLayoutScroll: inside AppShellLayout it is the main scroll region; inside StackedLayout (a document
 * layout) it is the document scrolling element. The probe reports the tagName it received.
 */
export function layoutScrollContract(render: LayoutScrollAdapter) {
  describe(`useLayoutScroll (${render.name})`, () => {
    beforeEach(async () => {
      await page.viewport(1280, 800)
    })

    const probe = () => document.querySelector('[data-testid="probe"]')?.textContent

    it("returns the main scroll region inside AppShellLayout", async () => {
      await render.appShellProbe()
      // The probe reads the scroll element after mount, so poll until it reports.
      await expect.poll(probe).toBe("MAIN")
    })

    it("returns the document scrolling element inside StackedLayout", async () => {
      await render.stackedProbe()
      await expect.poll(probe).toBe("HTML")
    })
  })
}
