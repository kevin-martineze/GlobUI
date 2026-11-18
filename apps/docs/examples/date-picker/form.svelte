<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
  import { DatePicker } from "@glob-ui/svelte/date-picker"
  import { Field } from "@glob-ui/svelte/field"
  import { Input } from "@glob-ui/svelte/input"

  let name = $state("Ana")
  let submitted = $state<string | null>(null)

  function onsubmit(e: SubmitEvent & { currentTarget: HTMLFormElement }) {
    e.preventDefault()
    // The hidden input carries the ISO date, so a native FormData sees "YYYY-MM-DD".
    const data = new FormData(e.currentTarget)
    submitted = `${data.get("name")} · ${data.get("start") || "no date"}`
  }
</script>

<form {onsubmit} class="flex w-full max-w-sm flex-col gap-4">
  <Field label="Name">
    <Input name="name" bind:value={name} />
  </Field>
  <Field label="Start date">
    <DatePicker name="start" defaultValue="2026-11-09" />
  </Field>
  <div>
    <Button type="submit">Save</Button>
  </div>
  {#if submitted}<p class="text-sm text-glob-text-secondary">Submitted: {submitted}</p>{/if}
</form>
