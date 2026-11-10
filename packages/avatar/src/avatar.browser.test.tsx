import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-react"
import { page } from "vitest/browser"
import { Avatar } from "./avatar"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

// A real image that loads, as a data URL so the test needs no server files.
const OK_SRC = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#0a0"/></svg>'
)

describe("Avatar", () => {
  it("shows initials from alt when the image fails to load", async () => {
    await render(<Avatar src="/does-not-exist.png" alt="Ana Torres" />)
    await expect.element(page.getByText("AT", { exact: true })).toBeVisible()
    await expectNoA11yViolations()
  })

  it("resets when src changes: a new image replaces the fallback", async () => {
    const screen = await render(<Avatar src="/does-not-exist.png" alt="Ana Torres" />)
    await expect.element(page.getByText("AT", { exact: true })).toBeVisible()

    await screen.rerender(<Avatar src={OK_SRC} alt="Ana Torres" />)
    // The fallback stays until the image's load event fires, then it is removed.
    await expect.poll(() => page.getByText("AT", { exact: true }).elements().length).toBe(0)
    await expect.element(page.getByRole("img", { name: "Ana Torres" })).toBeVisible()
  })

  it("goes back to the fallback when the new src is missing", async () => {
    const screen = await render(<Avatar src={OK_SRC} alt="Ana Torres" />)
    await expect.element(page.getByRole("img", { name: "Ana Torres" })).toBeVisible()

    await screen.rerender(<Avatar src="/does-not-exist.png" alt="Ana Torres" />)
    await expect.element(page.getByText("AT", { exact: true })).toBeVisible()
  })
})
