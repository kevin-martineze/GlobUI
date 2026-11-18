// Class parity for the data and date components (phase 10d-4). Each framework renders the same gallery: a Table with
// every part, a DataTable with every feature on, a Calendar in each mode (on a month away from today, so the snapshot
// does not depend on the date), a DatePicker and a PhoneInput. The snapshot lists every element as "tag class", in
// document order. The React snapshot was recorded before the class strings moved into @glob-ui/recipes, so matching it
// proves the move changed no output.
import { describe, expect, it } from "vitest"

export interface DataGalleryAdapter {
  readonly name: string
  /** The gallery: every 10d-4 component inside `[data-testid="data-gallery"]`. */
  dataGallery(): Promise<void>
}

const rowsOf = (root: Element) =>
  Array.from(root.querySelectorAll("*")).map((el) => `${el.tagName.toLowerCase()} ${el.getAttribute("class") ?? ""}`.trim())

export function dataParityContract(render: DataGalleryAdapter) {
  describe(`data class parity (${render.name})`, () => {
    it("renders the data and date components with the same elements and classes", async () => {
      await render.dataGallery()
      const root = document.querySelector('[data-testid="data-gallery"]')
      expect(root).not.toBeNull()
      // The calendars switch to the browser locale after mount; wait for the grids and the data table rows.
      await expect.poll(() => root!.querySelectorAll('[role="grid"]').length).toBe(3)
      await expect.poll(() => root!.querySelectorAll("tbody tr").length).toBeGreaterThan(5)
      await expect(JSON.stringify(rowsOf(root!), null, 2)).toMatchFileSnapshot(`./snapshots/data-parity/${render.name}.json`)
    })
  })
}
