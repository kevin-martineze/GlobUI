// Class parity for the navigation components (phase 10d-3). Each framework renders the same gallery: Tabs in both
// variants and orientations, an Accordion with an open, a closed and a disabled item, and a Pagination with every
// part. The snapshot lists every element as "tag class", in document order. The React snapshot was recorded before
// the class strings moved into @glob-ui/recipes, so matching it proves the move changed no output.
import { describe, expect, it } from "vitest"

export interface NavigationGalleryAdapter {
  readonly name: string
  /** The gallery: Tabs, Accordion and Pagination inside `[data-testid="navigation-gallery"]`. */
  navigationGallery(): Promise<void>
}

const rowsOf = (root: Element) =>
  Array.from(root.querySelectorAll("*")).map((el) => `${el.tagName.toLowerCase()} ${el.getAttribute("class") ?? ""}`.trim())

export function navigationParityContract(render: NavigationGalleryAdapter) {
  describe(`navigation class parity (${render.name})`, () => {
    it("renders the navigation components with the same elements and classes", async () => {
      await render.navigationGallery()
      const root = document.querySelector('[data-testid="navigation-gallery"]')
      expect(root).not.toBeNull()
      await expect(JSON.stringify(rowsOf(root!), null, 2)).toMatchFileSnapshot(`./snapshots/navigation-parity/${render.name}.json`)
    })
  })
}
