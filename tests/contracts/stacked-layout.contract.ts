import { describe, expect, it, beforeEach } from "vitest"
import { page } from "vitest/browser"
import { expectNoA11yViolations } from "../browser/a11y"
import type { StackedLayoutAdapter } from "./types"

/** StackedLayout: the document scrolls, the header stays on top, and main is a plain flow element. */
export function stackedLayoutContract(render: StackedLayoutAdapter) {
  describe(`StackedLayout (${render.name})`, () => {
    beforeEach(async () => {
      await page.viewport(1280, 800)
    })

    it("lets the document scroll and keeps the header sticky", async () => {
      await render.stackedLayout()
      const root = document.querySelector('[data-layout="stacked"]') as HTMLElement
      expect(root).not.toBeNull()
      expect(root.getAttribute("data-scroll-mode")).toBe("document")
      expect(document.querySelector('[data-slot="header"]')?.getAttribute("data-scroll")).toBe("fixed")
      expect(document.querySelector('main[data-slot="main"]')?.getAttribute("data-scroll")).toBe("scroll")
    })

    it("passes axe", async () => {
      await render.stackedLayout()
      await expectNoA11yViolations()
    })
  })
}
