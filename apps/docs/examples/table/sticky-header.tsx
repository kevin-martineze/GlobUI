import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@glob-ui/table"

const rows = Array.from({ length: 30 }, (_, i) => ({ id: `ORD-${2000 + i}`, status: i % 3 === 0 ? "Shipped" : "Pending" }))

export default function TableStickyHeader() {
  return (
    <div className="w-full max-w-md">
      {/* The wrapper is the scroll container: it has a height, and the header sticks inside it. */}
      <Table stickyHeader containerClassName="max-h-64" scrollLabel="Orders">
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
