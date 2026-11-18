<script lang="ts">
  import { AppShellLayout } from "@glob-ui/svelte/app-shell-layout"
  import DetailPageTemplate from "../../../../../templates/svelte/detail-page/DetailPageTemplate.svelte"
</script>

<AppShellLayout>
  {#snippet header()}<strong>Acme</strong>{/snippet}
  {#snippet sidebar()}<a href="#orders" class="rounded-md px-3 py-2 text-sm no-underline hover:bg-fd-accent">Orders</a>{/snippet}
  <DetailPageTemplate title="Order 1042" backHref="#orders">
    {#snippet breadcrumbs()}<span>Orders / Order 1042</span>{/snippet}
    {#snippet actions()}<span class="rounded-md border px-3 py-1.5 text-sm">Print</span>{/snippet}
    {#snippet aside()}
      <dl class="grid gap-2 text-sm">
        <dt class="text-fd-muted-foreground">Paid on</dt>
        <dd>Nov 2</dd>
        <dt class="text-fd-muted-foreground">Client</dt>
        <dd>Atlas Studio</dd>
      </dl>
    {/snippet}
    <ul class="flex flex-col gap-2">
      {#each Array.from({ length: 18 }, (_, i) => i) as i (i)}
        <li class="rounded-lg border p-3">Line item {i + 1}</li>
      {/each}
    </ul>
  </DetailPageTemplate>
</AppShellLayout>
