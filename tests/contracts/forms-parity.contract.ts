// Class parity for the form and primitive components (phase 10d-1). Each framework renders the same gallery: every
// component, in a few variants. The snapshot lists every element inside it as "tag class", in document order, so a
// changed class string, a missing wrapper or an extra element in any framework fails it. The React snapshot was
// recorded before the class strings moved into @glob-ui/recipes, so matching it proves the move changed no output.
import { describe, expect, it } from "vitest"

export interface FormsGalleryAdapter {
  readonly name: string
  /** The gallery: every 10d-1 component inside `[data-testid="forms-gallery"]`. */
  formsGallery(): Promise<void>
}

export function formsParityContract(render: FormsGalleryAdapter) {
  describe(`forms class parity (${render.name})`, () => {
    it("renders the form and primitive components with the same elements and classes", async () => {
      await render.formsGallery()
      const root = document.querySelector('[data-testid="forms-gallery"]')
      expect(root).not.toBeNull()
      const rows = Array.from(root!.querySelectorAll("*")).map((el) =>
        `${el.tagName.toLowerCase()} ${el.getAttribute("class") ?? ""}`.trim()
      )
      await expect(JSON.stringify(rows, null, 2)).toMatchFileSnapshot(`./snapshots/forms-parity/${render.name}.json`)
    })
  })
}
