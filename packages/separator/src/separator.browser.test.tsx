import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-react"
import { page } from "vitest/browser"
import { Separator } from "./separator"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

describe("Separator", () => {
  it("is exposed as a separator and passes axe", async () => {
    await render(
      <div>
        <p>Above</p>
        <Separator decorative={false} />
        <p>Below</p>
      </div>
    )
    await expect.element(page.getByRole("separator")).toBeInTheDocument()
    await expectNoA11yViolations()
  })
})
