<script lang="ts">
  import { Calendar, parseISODate } from "@glob-ui/svelte/calendar"

  const isWeekend = (iso: string) => [0, 6].includes(parseISODate(iso).getDay())
  let value = $state<string | null>(null)
</script>

<div class="flex flex-col gap-3">
  <Calendar defaultMonth="2026-11" min="2026-11-05" max="2026-12-20" isDateDisabled={isWeekend} bind:value />
  <p class="text-sm text-glob-text-secondary">
    Weekdays from Nov 5 to Dec 20. Days outside are disabled, and the arrows stop at the first and last month.
  </p>
</div>
