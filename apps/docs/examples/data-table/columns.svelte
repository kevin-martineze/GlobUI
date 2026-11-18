<script lang="ts">
  import { DataTable, createDataTableColumnHelper, renderSnippet, type DataTableColumn } from "@glob-ui/svelte/data-table"
  import { Button } from "@glob-ui/svelte/button"
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@glob-ui/svelte/dropdown-menu"
  import { toast } from "@glob-ui/svelte/toast"

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
    // A cell renders a snippet (or a component, with renderComponent).
    helper.display({ id: "actions", header: "Actions", cell: ({ row }) => renderSnippet(actions, row.original.name) }),
  ]
</script>

{#snippet actions(name: string)}
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet child(props)}
        <Button variant="ghost" size="sm" aria-label={`Actions for ${name}`} {...props}>Actions</Button>
      {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem onSelect={() => toast(`Opened ${name}`)}>Open</DropdownMenuItem>
      <DropdownMenuItem onSelect={() => toast(`Archived ${name}`)}>Archive</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
{/snippet}

<div class="w-full">
  <DataTable aria-label="Projects" {columns} data={projects} columnVisibility sorting />
</div>
