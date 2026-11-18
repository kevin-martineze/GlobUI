<script lang="ts">
  import { AppShellLayout } from "@glob-ui/svelte/app-shell-layout"
  import { PageLayout, PageHeader } from "@glob-ui/svelte/page-layout"

  const ITEMS = Array.from({ length: 16 }, (_, i) => `Item ${i + 1}`)
</script>

<!-- PageLayout lives inside a shell's main region. The page passes content only: no wrapper, padding or height. -->
<AppShellLayout>
  {#snippet header()}<strong>Acme</strong>{/snippet}
  <PageLayout>
    {#snippet header()}
      <PageHeader title="Invoices" description="Open and paid, this month">
        {#snippet actions()}<span class="rounded-md border px-3 py-1.5 text-sm">New invoice</span>{/snippet}
      </PageHeader>
    {/snippet}
    {#snippet aside()}
      <div class="rounded-xl border p-4 text-sm">
        <p class="font-medium">Filters</p>
        <p class="text-fd-muted-foreground">Status, client, date range.</p>
      </div>
    {/snippet}
    <ul class="flex flex-col gap-2">
      {#each ITEMS as item (item)}
        <li class="rounded-lg border p-3">{item}</li>
      {/each}
    </ul>
  </PageLayout>
</AppShellLayout>
