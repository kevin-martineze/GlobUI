import { describe, expect, it, beforeEach } from "vitest"
import { page } from "vitest/browser"
import { expectNoA11yViolations } from "../browser/a11y"
import type { AppShellAdapter } from "./types"

const main = () => document.querySelector("main") as HTMLElement
const docScroll = () => document.scrollingElement as HTMLElement

/** AppShellLayout: the viewport never scrolls, only the main region does, and the page is accessible. */
export function appShellLayoutContract(render: AppShellAdapter) {
  describe(`AppShellLayout (${render.name})`, () => {
    beforeEach(async () => {
      await page.viewport(1280, 800)
    })

    it("never scrolls the viewport: only the main region scrolls", async () => {
      await render.appShell({ tall: true })
      expect(docScroll().scrollHeight).toBeLessThanOrEqual(window.innerHeight + 1)
      expect(main().scrollHeight).toBeGreaterThan(main().clientHeight)
      main().scrollTop = 200
      expect(main().scrollTop).toBeGreaterThan(0)
      expect(docScroll().scrollTop).toBe(0)
    })

    it("declares each slot's scroll behaviour in the DOM", async () => {
      await render.appShell({ tall: true })
      expect(document.querySelector('[data-slot="header"]')?.getAttribute("data-scroll")).toBe("fixed")
      expect(document.querySelector('[data-slot="sidebar"]')?.getAttribute("data-scroll")).toBe("fixed")
      expect(document.querySelector('[data-slot="sidebar-list"]')?.getAttribute("data-scroll")).toBe("scroll")
      expect(main().getAttribute("data-scroll")).toBe("scroll")
    })

    it("exposes the navigation and main landmarks", async () => {
      await render.appShell({ tall: false })
      expect(document.querySelector('nav[aria-label="Main navigation"]')).not.toBeNull()
      expect(main()).not.toBeNull()
    })

    it("passes axe in its initial state", async () => {
      await render.appShell({ tall: false })
      await expectNoA11yViolations()
    })
  })
}
