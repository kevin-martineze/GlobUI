"use client"

import { DataTable, createDataTableColumnHelper, type DataTableColumn } from "@glob-ui/data-table"
import { Button } from "@glob-ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@glob-ui/dropdown-menu"
import { toast } from "@glob-ui/toast"

type Project = { id: string; name: string; owner: string; status: string; updated: string }

const projects: Project[] = [
  { id: "p1", name: "Website", owner: "Ana", status: "Live", updated: "2026-10-02" },
  { id: "p2", name: "Mobile app", owner: "Benito", status: "Review", updated: "2026-10-14" },
  { id: "p3", name: "Docs", owner: "Dara", status: "Draft", updated: "2026-11-01" },
  { id: "p4", name: "Billing", owner: "Eli", status: "Live", updated: "2026-09-21" },
]

const helper = createDataTableColumnHelper<Project>()
const columns: DataTableColumn<Project>[] = [
  helper.accessor("name", { header: "Project" }),
  helper.accessor("owner", { header: "Owner" }),
  helper.accessor("status", { header: "Status" }),
  helper.accessor("updated", { header: "Updated" }),
  helper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" aria-label={`Actions for ${row.original.name}`}>
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => toast(`Opened ${row.original.name}`)}>Open</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toast(`Archived ${row.original.name}`)}>Archive</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
]

export default function DataTableColumns() {
  return (
    <div className="w-full">
      <DataTable aria-label="Projects" columns={columns} data={projects} columnVisibility sorting />
    </div>
  )
}
