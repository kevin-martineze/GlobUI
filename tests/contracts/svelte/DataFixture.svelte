<script lang="ts">
  // One fixture per adapter method of the 10d-4 contracts, chosen by `kind`. `props` is the contract's fixture object.
  import { Calendar, type DateRange } from "../../../packages/svelte/src/calendar"
  import { DataTable } from "../../../packages/svelte/src/data-table"
  import { DatePicker } from "../../../packages/svelte/src/date-picker"
  import { Field } from "../../../packages/svelte/src/field"
  import { PhoneInput } from "../../../packages/svelte/src/phone-input"
  import { columns } from "./data-columns"
  import Invoices from "./Invoices.svelte"

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let { kind, props }: { kind: string; props: any } = $props()

  // The DatePicker fixtures hold the value and pass it back, as a parent with state would.
  // svelte-ignore state_referenced_locally
  let single = $state<string | null>(props.value ?? null)
  let range = $state<DateRange>({ from: null, to: null })
</script>

{#if kind === "table"}
  <Invoices {...props} />
{:else if kind === "dataTable"}
  <DataTable aria-label="Users" {columns} {...props} />
{:else if kind === "calendar"}
  {#if props.mode === "range"}
    <Calendar {...props} mode="range" />
  {:else}
    <Calendar {...props} mode="single" />
  {/if}
{:else if kind === "datePicker"}
  <Field label="Due date">
    {#if props.mode === "range"}
      <DatePicker
        mode="range"
        locale="en-US"
        name="stay"
        presets={props.presets}
        value={range}
        onChange={(next) => {
          range = next
          props.onChange?.(next)
        }}
      />
    {:else}
      <DatePicker
        mode="single"
        locale="en-US"
        name="due"
        value={single}
        onChange={(next) => {
          single = next
          props.onChange?.(next)
        }}
      />
    {/if}
  </Field>
{:else if kind === "phoneInput"}
  <PhoneInput aria-label="Phone" country={props.country} onCountryChange={props.onCountryChange} />
{/if}
