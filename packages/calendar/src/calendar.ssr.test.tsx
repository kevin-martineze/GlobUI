import { describe, expect, it } from "vitest"
import { renderToString } from "react-dom/server"
import { Calendar } from "./calendar"

// The server cannot know the browser's locale or today's date, so it renders a fixed fallback.
// The first client render (hydration) uses the same values, which keeps the HTML identical.
describe("Calendar (SSR)", () => {
  it("renders the en-US fallback when no locale is passed", () => {
    const html = renderToString(<Calendar defaultMonth="2026-11" />)
    expect(html).toContain("November 2026")
  })

  it("renders a passed locale on the server", () => {
    const html = renderToString(<Calendar defaultMonth="2026-11" locale="es-ES" />)
    expect(html).toContain("noviembre de 2026")
  })

  it("does not mark today on the server", () => {
    const html = renderToString(<Calendar />)
    expect(html).not.toContain('aria-current="date"')
  })
})
