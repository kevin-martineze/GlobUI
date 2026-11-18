<script lang="ts">
  import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../../../packages/svelte/src/table"

  let { scrollLabel, striped, stickyHeader }: { scrollLabel?: string; striped?: boolean; stickyHeader?: boolean } = $props()
</script>

<Table {scrollLabel} {striped} {stickyHeader} containerClass="max-h-48">
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
    <TableRow data-state="selected">
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
