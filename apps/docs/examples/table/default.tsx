import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@glob-ui/table"

const invoices = [
  { id: "INV-1001", client: "Atlas Studio", amount: 1240 },
  { id: "INV-1002", client: "Northwind", amount: 860 },
  { id: "INV-1003", client: "Bluebird Labs", amount: 2310 },
]

const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" })

export default function TableDefault() {
  const total = invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  return (
    <div className="w-full max-w-lg">
      <Table>
        <TableCaption>Invoices, November</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Client</TableHead>
            <TableHead align="right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>{invoice.client}</TableCell>
              <TableCell align="right">{money(invoice.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{money(total)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
