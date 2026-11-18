<script lang="ts">
  import { Calendar, type DateRange } from "@glob-ui/svelte/calendar"

  let range = $state<DateRange>({ from: "2026-11-03", to: "2026-11-09" })
</script>

<div class="flex flex-col gap-3">
  <Calendar mode="range" numberOfMonths={2} bind:value={range} defaultMonth="2026-11" />
  <p class="text-sm text-glob-text-secondary">
    {range.from ?? "—"} to {range.to ?? "—"}. The first click sets the start; the second sets the end. Hover previews the range.
  </p>
</div>
