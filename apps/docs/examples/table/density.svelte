<script lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@glob-ui/svelte/table"

  const rows = [
    ["Ana", "Admin"],
    ["Benito", "Editor"],
    ["Dara", "Viewer"],
  ]
  const densities = ["compact", "default", "comfortable"] as const
</script>

<div class="flex w-full max-w-lg flex-col gap-6">
  {#each densities as density (density)}
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium capitalize text-glob-text-secondary">{density}</p>
      <Table {density}>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {#each rows as [name, role] (name)}
            <TableRow>
              <TableCell>{name}</TableCell>
              <TableCell>{role}</TableCell>
            </TableRow>
          {/each}
        </TableBody>
      </Table>
    </div>
  {/each}
</div>
