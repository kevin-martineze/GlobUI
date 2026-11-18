<script lang="ts">
  import { AppShellLayout } from "@glob-ui/svelte/app-shell-layout"
  import { LayoutNavTrigger } from "@glob-ui/svelte/layout"
  import { PageLayout, PageHeader } from "@glob-ui/svelte/page-layout"

  const ROWS = Array.from({ length: 24 }, (_, i) => `Order ${1000 + i}`)
</script>

<AppShellLayout>
  {#snippet header()}
    <LayoutNavTrigger />
    <strong>Acme</strong>
  {/snippet}
  {#snippet sidebar()}
    <a href="#overview" aria-current="page" class="rounded-md px-3 py-2 text-sm no-underline hover:bg-fd-accent">Overview</a>
    <a href="#orders" class="rounded-md px-3 py-2 text-sm no-underline hover:bg-fd-accent">Orders</a>
    <a href="#customers" class="rounded-md px-3 py-2 text-sm no-underline hover:bg-fd-accent">Customers</a>
  {/snippet}
  <PageLayout>
    {#snippet header()}<PageHeader title="Orders" />{/snippet}
    <ul class="flex flex-col gap-2">
      {#each ROWS as row (row)}
        <li class="rounded-lg border p-3">{row}</li>
      {/each}
    </ul>
  </PageLayout>
</AppShellLayout>
