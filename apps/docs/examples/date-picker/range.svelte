<script lang="ts">
  import { DatePicker, type DatePickerPreset } from "@glob-ui/svelte/date-picker"
  import { Field } from "@glob-ui/svelte/field"
  import { addDays, toISODate, todayISODate, type DateRange } from "@glob-ui/svelte/calendar"

  function presets(): DatePickerPreset[] {
    const today = todayISODate()
    const d = new Date()
    const monthStart = toISODate(new Date(d.getFullYear(), d.getMonth(), 1))
    const monthEnd = toISODate(new Date(d.getFullYear(), d.getMonth() + 1, 0))
    return [
      { label: "Today", value: today },
      { label: "Last 7 days", value: { from: addDays(today, -6), to: today } },
      { label: "Last 30 days", value: { from: addDays(today, -29), to: today } },
      { label: "This month", value: { from: monthStart, to: monthEnd } },
    ]
  }

  let range = $state<DateRange>({ from: null, to: null })
</script>

<div class="w-full max-w-md">
  <Field label="Stay" description="Choose the first and the last day, or a preset.">
    <DatePicker mode="range" bind:value={range} presets={presets()} placeholder="Pick a date range" />
  </Field>
</div>
