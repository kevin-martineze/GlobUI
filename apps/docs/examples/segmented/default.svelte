<script lang="ts">
  import { Segmented } from "@glob-ui/svelte/segmented"

  let range = $state("week")
</script>

<div class="flex flex-col items-center gap-3">
  <Segmented
    aria-label="Range"
    options={[
      { value: "day", label: "Day" },
      { value: "week", label: "Week" },
      { value: "month", label: "Month" },
    ]}
    bind:value={range}
  />
  <p class="text-sm text-fd-muted-foreground">Showing: {range}</p>
</div>
