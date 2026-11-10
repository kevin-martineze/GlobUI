"use client"

import { DataTable, createDataTableColumnHelper, type DataTableColumn } from "@glob-ui/data-table"

type Member = { id: string; name: string; team: string; role: string; joined: number }

const firstNames = ["Ana", "Benito", "Canción", "Dara", "Eli", "Fátima", "Gus", "Hana", "Ivo", "Jun", "Kai", "Lia"]
const teams = ["Design", "Platform", "Growth", "Support"]
const roles = ["Admin", "Editor", "Viewer"]

// Deterministic, so the server and the browser render the same rows.
const members: Member[] = Array.from({ length: 40 }, (_, i) => ({
  id: `m${i + 1}`,
  name: `${firstNames[i % firstNames.length]} ${String.fromCharCode(65 + (i % 26))}.`,
  team: teams[i % teams.length],
  role: roles[(i * 7) % roles.length],
  joined: 2019 + (i % 7),
}))

const helper = createDataTableColumnHelper<Member>()
const columns: DataTableColumn<Member>[] = [
  helper.accessor("name", { header: "Name" }),
  helper.accessor("team", { header: "Team" }),
  helper.accessor("role", { header: "Role" }),
  helper.accessor("joined", { header: "Joined" }),
]

export default function DataTableDefault() {
  return (
    <div className="w-full">
      <DataTable aria-label="Members" columns={columns} data={members} sorting globalFilter pagination pageSize={10} />
    </div>
  )
}
