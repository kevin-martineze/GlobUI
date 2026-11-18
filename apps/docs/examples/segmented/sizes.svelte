<script lang="ts">
  import { Segmented } from "@glob-ui/svelte/segmented"

  const options = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta" },
  ]
</script>

<div class="flex flex-wrap items-center gap-3">
  <Segmented size="sm" aria-label="Small" {options} defaultValue="a" />
  <Segmented size="md" aria-label="Medium" {options} defaultValue="a" />
  <Segmented size="lg" aria-label="Large" {options} defaultValue="a" />
</div>
