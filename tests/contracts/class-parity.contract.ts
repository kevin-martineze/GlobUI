// Class parity: the rendered class attribute of the shared layout and dialog parts. Snapshotted per framework
// (tests/contracts/snapshots/class-parity/). A change to any class string, or a framework that renders a part
// differently, makes the snapshot fail. The snapshots were recorded before the recipes move, so passing them
// proves the move changed no output.
import { describe, expect, it, beforeEach } from "vitest"
import { page } from "vitest/browser"
import type { AppShellAdapter, DialogAdapter, PageLayoutAdapter, SheetAdapter, StackedLayoutAdapter } from "./types"

type Parts = AppShellAdapter & DialogAdapter & SheetAdapter & PageLayoutAdapter & StackedLayoutAdapter

const SELECTORS: Record<string, string[]> = {
  "app-shell": ['[data-layout="app-shell"]', '[data-slot="header"]', '[data-slot="sidebar"]', '[data-slot="sidebar-list"]', "main"],
  stacked: ['[data-layout="stacked"]', '[data-slot="header"]', 'main[data-slot="main"]', '[data-slot="footer"]'],
  page: [
    '[data-layout="page"]',
    '[data-slot="content"]',
    '[data-slot="header"]',
    '[data-slot="aside"]',
    '[data-slot="page-header"]',
    '[data-slot="page-header"] h1',
    '[data-slot="page-header"] p',
  ],
  dialog: ["dialog > div", "dialog h2", "dialog p", 'dialog button[aria-label="Close"]'],
  sheet: ["dialog > div", "dialog h2", 'dialog button[aria-label="Close"]'],
}

/** The class attribute of every node matched by each selector, in document order. */
function classes(selectors: string[]): Record<string, string[]> {
  return Object.fromEntries(selectors.map((sel) => [sel, Array.from(document.querySelectorAll(sel)).map((el) => el.getAttribute("class") ?? "")]))
}

export function classParityContract(render: Parts) {
  describe(`class parity (${render.name})`, () => {
    beforeEach(async () => {
      await page.viewport(1280, 800)
    })

    const snapshot = (group: string) => `./snapshots/class-parity/${render.name}-${group}.json`

    it("renders the AppShellLayout parts with the same classes", async () => {
      await render.appShell({ tall: false })
      await expect(JSON.stringify(classes(SELECTORS["app-shell"]), null, 2)).toMatchFileSnapshot(snapshot("app-shell"))
    })

    it("renders the StackedLayout parts with the same classes", async () => {
      await render.stackedLayout()
      await expect(JSON.stringify(classes(SELECTORS.stacked), null, 2)).toMatchFileSnapshot(snapshot("stacked"))
    })

    it("renders the PageLayout and PageHeader parts with the same classes", async () => {
      await render.pageLayout()
      await expect(JSON.stringify(classes(SELECTORS.page), null, 2)).toMatchFileSnapshot(snapshot("page"))
    })

    it("renders the Dialog parts with the same classes", async () => {
      await render.dialog({ title: "Confirm", triggerLabel: "Open dialog" })
      ;(page.getByRole("button", { name: "Open dialog" }).element() as HTMLElement).click()
      await expect.poll(() => (document.querySelector("dialog") as HTMLDialogElement | null)?.open).toBe(true)
      await expect(JSON.stringify(classes(SELECTORS.dialog), null, 2)).toMatchFileSnapshot(snapshot("dialog"))
    })

    it("renders the Sheet parts with the same classes", async () => {
      await render.sheet({ title: "Filters", triggerLabel: "Open sheet" })
      ;(page.getByRole("button", { name: "Open sheet" }).element() as HTMLElement).click()
      await expect.poll(() => (document.querySelector("dialog") as HTMLDialogElement | null)?.open).toBe(true)
      await expect(JSON.stringify(classes(SELECTORS.sheet), null, 2)).toMatchFileSnapshot(snapshot("sheet"))
    })
  })
}
