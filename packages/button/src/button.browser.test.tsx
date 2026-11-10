import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-react"
import { page } from "vitest/browser"
import { Button } from "./button"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

describe("Button", () => {
  it("keeps its width while loading and sets aria-busy", async () => {
    const idle = await render(<Button>Save changes</Button>)
    const idleWidth = page.getByRole("button", { name: "Save changes" }).element().getBoundingClientRect().width
    await idle.unmount()

    await render(<Button loading>Save changes</Button>)
    // While loading the spinner's "Loading" status is part of the name.
    const button = page.getByRole("button", { name: /Save changes/ })
    await expect.element(button).toHaveAttribute("aria-busy", "true")
    await expect.element(button).toBeDisabled()
    const loadingWidth = button.element().getBoundingClientRect().width
    expect(Math.round(loadingWidth)).toBe(Math.round(idleWidth))
  })

  it("renders an <a> with the button styles when asChild is set", async () => {
    await render(
      <Button asChild>
        <a href="#docs">Read the docs</a>
      </Button>
    )
    await expect.element(page.getByRole("link", { name: "Read the docs" })).toHaveAttribute("href", "#docs")
    expect(page.getByRole("button").elements()).toHaveLength(0)
    await expectNoA11yViolations()
  })

  it("does not fire onClick when disabled", async () => {
    let clicks = 0
    await render(<Button disabled onClick={() => clicks++}>Off</Button>)
    await expect.element(page.getByRole("button", { name: "Off" })).toBeDisabled()
    expect(clicks).toBe(0)
  })
})
