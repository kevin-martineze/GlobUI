import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@glob-ui/table"

const rows = [
  ["Ana", "Admin"],
  ["Benito", "Editor"],
  ["Dara", "Viewer"],
]

const densities = ["compact", "default", "comfortable"] as const

export default function TableDensity() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      {densities.map((density) => (
        <div key={density} className="flex flex-col gap-2">
          <p className="text-sm font-medium capitalize text-glob-text-secondary">{density}</p>
          <Table density={density}>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(([name, role]) => (
                <TableRow key={name}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  )
}
