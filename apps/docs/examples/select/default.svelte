<script lang="ts">
  import { Select } from "@glob-ui/svelte/select"

  const countries = [
    { value: "mx", label: "Mexico" },
    { value: "co", label: "Colombia" },
    { value: "ar", label: "Argentina" },
  ]
  let country = $state("")
</script>

<div class="flex w-full max-w-xs flex-col gap-2">
  <Select aria-label="Country" options={countries} bind:value={country} placeholder="Select a country..." />
  <p class="text-sm text-fd-muted-foreground">Selected: {country || "none"}</p>
</div>
