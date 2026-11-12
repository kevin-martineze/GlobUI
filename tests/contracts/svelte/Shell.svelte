<script lang="ts">
  import { AppShellLayout } from "../../../packages/svelte/src/app-shell-layout"
  import { LayoutNavTrigger } from "../../../packages/svelte/src/layout"

  let { tall = true }: { tall?: boolean } = $props()
  const rows = Array.from({ length: 60 }, (_, i) => i)
</script>

<AppShellLayout>
  {#snippet header()}
    <LayoutNavTrigger />
    <strong>Acme</strong>
  {/snippet}
  {#snippet sidebar()}
    <a href="#orders" aria-current="page">Orders</a>
    <a href="#customers">Customers</a>
  {/snippet}
  <h2>Orders</h2>
  {#if tall}{#each rows as row (row)}<p>Row {row}</p>{/each}{/if}
</AppShellLayout>
