import { describe, expect, it, beforeEach } from "vitest"
import { page } from "vitest/browser"
import { expectNoA11yViolations } from "../browser/a11y"
import type { PageLayoutAdapter } from "./types"

/** PageLayout: a page inside a scroll region, with a sticky header, the content and an aside. */
export function pageLayoutContract(render: PageLayoutAdapter) {
  describe(`PageLayout (${render.name})`, () => {
    beforeEach(async () => {
      await page.viewport(1280, 800)
    })

    it("renders the header title as the h1 and the aside beside the content", async () => {
      await render.pageLayout()
      const root = document.querySelector('[data-layout="page"]') as HTMLElement
      expect(root).not.toBeNull()
      expect(root.querySelector("h1")?.textContent).toBe("Invoices")
      expect(root.querySelector('[data-slot="header"]')?.getAttribute("data-scroll")).toBe("fixed")
      expect(root.querySelector('[data-slot="aside"]')).not.toBeNull()
      expect(root.querySelector('[data-slot="content"]')?.getAttribute("data-scroll")).toBe("scroll")
    })

    it("passes axe", async () => {
      await render.pageLayout()
      await expectNoA11yViolations()
    })
  })
}
