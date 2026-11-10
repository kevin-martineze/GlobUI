import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-react"
import { page } from "vitest/browser"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./table"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

function Invoices(props: { scrollLabel?: string; striped?: boolean; stickyHeader?: boolean }) {
  return (
    <Table scrollLabel={props.scrollLabel} striped={props.striped} stickyHeader={props.stickyHeader} containerClassName="max-h-48">
      <TableCaption>Invoices, November</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead align="right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV-001</TableCell>
          <TableCell align="right">$120</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>INV-002</TableCell>
          <TableCell align="right">$80</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell align="right">$200</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

describe("Table", () => {
  it("passes axe with a caption and a footer", async () => {
    await render(<Invoices />)
    await expect.element(page.getByRole("table")).toBeInTheDocument()
    await expectNoA11yViolations()
  })

  it("with scrollLabel the wrapper is a focusable region with that name", async () => {
    await render(<Invoices scrollLabel="Invoices table" />)
    const region = page.getByRole("region", { name: "Invoices table" }).element() as HTMLElement
    expect(region.tabIndex).toBe(0)
    region.focus()
    expect(document.activeElement).toBe(region)
    await expectNoA11yViolations()
  })

  it("striped and sticky-header tables render and pass axe", async () => {
    await render(<Invoices striped stickyHeader />)
    await expectNoA11yViolations()
  })

  it("aligns numeric cells to the right", async () => {
    await render(<Invoices />)
    const cell = page.getByRole("cell", { name: "$120" }).element() as HTMLElement
    expect(cell.className).toContain("text-right")
  })
})
