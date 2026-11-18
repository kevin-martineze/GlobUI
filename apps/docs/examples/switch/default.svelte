<script lang="ts">
  import { Switch } from "@glob-ui/svelte/switch"

  let on = $state(true)
</script>

<div class="flex items-center gap-3">
  <Switch id="notify" aria-label="Notifications" bind:checked={on} />
  <span class="text-sm">Notifications {on ? "on" : "off"}</span>
</div>
