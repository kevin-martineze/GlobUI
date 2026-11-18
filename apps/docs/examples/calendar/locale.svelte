<script lang="ts">
  import { Calendar } from "@glob-ui/svelte/calendar"

  let value = $state<string | null>(null)
</script>

<div class="flex flex-col gap-3">
  <Calendar locale="es-ES" defaultMonth="2026-11" bind:value />
  <p class="text-sm text-glob-text-secondary">
    The week starts on Monday and the names follow the locale (es-ES). Pass <code>weekStartsOn</code> to override it.
  </p>
</div>
