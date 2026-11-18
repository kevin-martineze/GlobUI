<script lang="ts">
  import { Checkbox } from "@glob-ui/svelte/checkbox"

  const labels = ["Email", "SMS"]
  let checked = $state([false, false])
  const all = $derived(checked.every(Boolean))
  const some = $derived(checked.some(Boolean) && !all)
</script>

<div class="flex flex-col gap-2">
  <Checkbox
    label="Select all"
    checked={all}
    indeterminate={some}
    onchange={(e) => {
      const next = e.currentTarget.checked
      checked = [next, next]
    }}
  />
  <div class="ml-6 flex flex-col gap-2">
    {#each labels as label, i (label)}
      <Checkbox {label} bind:checked={checked[i]} />
    {/each}
  </div>
</div>
