<script lang="ts">
  import { Checkbox } from "@glob-ui/svelte/checkbox"
</script>

<div class="flex flex-col gap-2">
  <Checkbox label="Disabled, unchecked" disabled />
  <Checkbox label="Disabled, checked" disabled checked />
</div>
