import { describe, expect, it } from "vitest"
import { renderToString } from "react-dom/server"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"

describe("Table (SSR)", () => {
  it("renders the wrapper and a table with the header, body and cell roles", () => {
    const html = renderToString(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead align="right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow data-state="selected">
            <TableCell align="right">$10</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(html).toContain("<table")
    expect(html).toContain("<thead")
    expect(html).toContain("<tbody")
    expect(html).toContain("text-right")
    expect(html).toContain('data-state="selected"')
  })

  it("is not focusable or named as a region without scrollLabel", () => {
    const html = renderToString(<Table />)
    expect(html).not.toContain('role="region"')
    expect(html).not.toContain("tabindex")
  })

  it("with scrollLabel the wrapper is a named, focusable region", () => {
    const html = renderToString(<Table scrollLabel="Invoices" />)
    expect(html).toContain('role="region"')
    expect(html).toContain('aria-label="Invoices"')
    expect(html).toContain('tabindex="0"')
  })
})
