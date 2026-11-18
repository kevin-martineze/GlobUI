<script lang="ts">
  import { DatePicker } from "@glob-ui/svelte/date-picker"
  import { Field } from "@glob-ui/svelte/field"

  let value = $state<string | null>(null)
</script>

<div class="w-full max-w-xs">
  <Field label="Due date" description="Pick a day from the calendar.">
    <DatePicker bind:value placeholder="Pick a date" />
  </Field>
</div>
