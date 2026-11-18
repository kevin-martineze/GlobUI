// Class parity for the overlays (phase 10d-2). Each framework renders the same gallery: every overlay with its panel
// in the DOM (closed), plus a Command whose first item is active. The Toaster renders outside the gallery, in its
// own host, so it gets a second snapshot with a few toasts on screen. Each snapshot lists every element as
// "tag class", in document order. The React snapshots were recorded before the class strings moved into
// @glob-ui/recipes, so matching them proves the move changed no output.
import { afterEach, describe, expect, it } from "vitest"
import type { ContractToast } from "./types"

export interface OverlaysGalleryAdapter {
  readonly name: string
  readonly toast: ContractToast
  /** The gallery: every 10d-2 overlay inside `[data-testid="overlays-gallery"]`. */
  overlaysGallery(): Promise<void>
  /** A Toaster with default props. */
  toaster(fixture: object): Promise<void>
}

const rowsOf = (root: Element) =>
  Array.from(root.querySelectorAll("*")).map((el) => `${el.tagName.toLowerCase()} ${el.getAttribute("class") ?? ""}`.trim())

export function overlaysParityContract(render: OverlaysGalleryAdapter) {
  describe(`overlays class parity (${render.name})`, () => {
    afterEach(async () => {
      render.toast.dismiss()
      await expect.poll(() => document.querySelectorAll("[data-glob-toaster] li").length).toBe(0)
    })

    it("renders the overlays with the same elements and classes", async () => {
      await render.overlaysGallery()
      const root = document.querySelector('[data-testid="overlays-gallery"]')
      expect(root).not.toBeNull()
      // The Command marks its first item active once the items have registered.
      await expect.poll(() => root!.querySelector('[role="option"][aria-selected="true"]')).not.toBeNull()
      await expect(JSON.stringify(rowsOf(root!), null, 2)).toMatchFileSnapshot(`./snapshots/overlays-parity/${render.name}.json`)
    })

    it("renders the toaster and its toasts with the same elements and classes", async () => {
      await render.toaster({})
      render.toast({ title: "Saved", description: "All changes stored", duration: Infinity })
      render.toast.error("Upload failed")
      render.toast({ title: "Archived", duration: Infinity, action: { label: "Undo", onClick: () => {} } })
      await expect.poll(() => document.querySelectorAll("[data-glob-toaster] li").length).toBe(3)
      const host = document.querySelector("[data-glob-toaster]")!
      await expect(JSON.stringify(rowsOf(host), null, 2)).toMatchFileSnapshot(
        `./snapshots/overlays-parity/${render.name}-toaster.json`
      )
    })
  })
}
