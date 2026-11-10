import { describe, expect, it } from "vitest"
import { renderToString } from "react-dom/server"
import { Progress } from "./progress"

describe("Progress (SSR)", () => {
  it("exposes the value, the max and the default text", () => {
    const html = renderToString(<Progress aria-label="Upload" value={40} />)
    expect(html).toContain('role="progressbar"')
    expect(html).toContain('aria-valuemin="0"')
    expect(html).toContain('aria-valuemax="100"')
    expect(html).toContain('aria-valuenow="40"')
    expect(html).toContain('aria-valuetext="40%"')
  })

  it("clamps the value to the range", () => {
    expect(renderToString(<Progress aria-label="x" value={250} />)).toContain('aria-valuenow="100"')
    expect(renderToString(<Progress aria-label="x" value={-5} />)).toContain('aria-valuenow="0"')
  })

  it("is indeterminate without aria-valuenow when value is null", () => {
    const html = renderToString(<Progress aria-label="Working" value={null} />)
    expect(html).toContain('role="progressbar"')
    expect(html).not.toContain("aria-valuenow")
    expect(html).not.toContain("aria-valuetext")
  })

  it("uses getValueLabel for the text", () => {
    const html = renderToString(<Progress aria-label="Files" value={2} max={5} getValueLabel={(v, m) => `${v} of ${m} files`} />)
    expect(html).toContain('aria-valuetext="2 of 5 files"')
    expect(html).toContain('aria-valuemax="5"')
  })
})
