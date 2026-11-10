import { describe, expect, it } from "vitest"
import { renderToString } from "react-dom/server"
import { Separator } from "./separator"

describe("Separator (SSR)", () => {
  it("is decorative by default", () => {
    const html = renderToString(<Separator />)
    expect(html).toContain('role="none"')
    expect(html).not.toContain("aria-orientation")
  })

  it("is a separator with orientation when not decorative", () => {
    const html = renderToString(<Separator decorative={false} orientation="vertical" />)
    expect(html).toContain('role="separator"')
    expect(html).toContain('aria-orientation="vertical"')
    expect(html).toContain("w-px")
  })
})
