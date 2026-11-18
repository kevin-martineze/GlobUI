<script lang="ts">
  import DashboardTemplate from "../../../../../templates/svelte/dashboard/DashboardTemplate.svelte"

  const CARDS = ["Revenue", "Orders", "Customers", "Refunds"]
</script>

<DashboardTemplate title="Orders" description="Every order this month." activeHref="/orders">
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {#each CARDS as card (card)}
      <div class="rounded-xl border p-4">
        <p class="text-sm text-fd-muted-foreground">{card}</p>
        <p class="text-2xl font-semibold">1,240</p>
      </div>
    {/each}
  </div>
  <ul class="flex flex-col gap-2">
    {#each Array.from({ length: 20 }, (_, i) => i) as i (i)}
      <li class="rounded-lg border p-3">Order {1000 + i}</li>
    {/each}
  </ul>
</DashboardTemplate>
