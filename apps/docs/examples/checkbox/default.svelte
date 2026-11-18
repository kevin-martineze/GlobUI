<script lang="ts">
  import { Checkbox } from "@glob-ui/svelte/checkbox"

  let updates = $state(true)
</script>

<Checkbox label="Send me product updates" bind:checked={updates} />
