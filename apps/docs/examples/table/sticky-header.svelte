<script lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@glob-ui/svelte/table"

  const rows = Array.from({ length: 30 }, (_, i) => ({ id: `ORD-${2000 + i}`, status: i % 3 === 0 ? "Shipped" : "Pending" }))
</script>

<div class="w-full max-w-md">
  <!-- The wrapper is the scroll container: it has a height, and the header sticks inside it. -->
  <Table stickyHeader containerClass="max-h-64" scrollLabel="Orders">
    <TableHeader>
      <TableRow>
        <TableHead>Order</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {#each rows as row (row.id)}
        <TableRow>
          <TableCell>{row.id}</TableCell>
          <TableCell>{row.status}</TableCell>
        </TableRow>
      {/each}
    </TableBody>
  </Table>
</div>
