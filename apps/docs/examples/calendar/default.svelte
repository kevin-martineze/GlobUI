<script lang="ts">
  import { Calendar } from "@glob-ui/svelte/calendar"

  let value = $state<string | null>("2026-11-09")
</script>

<div class="flex flex-col gap-3">
  <Calendar bind:value />
  <p class="text-sm text-glob-text-secondary">Selected: {value ?? "none"}</p>
</div>
