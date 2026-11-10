import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-react"
import { page } from "vitest/browser"
import { Progress } from "./progress"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

describe("Progress", () => {
  it("is named by aria-labelledby and passes axe", async () => {
    await render(
      <div>
        <span id="upload-label">Upload</span>
        <Progress aria-labelledby="upload-label" value={60} tone="success" />
      </div>
    )
    await expect.element(page.getByRole("progressbar", { name: "Upload" })).toHaveAttribute("aria-valuenow", "60")
    await expectNoA11yViolations()
  })
})
