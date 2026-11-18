<script lang="ts">
  import { Field } from "@glob-ui/svelte/field"
  import { Input } from "@glob-ui/svelte/input"

  let username = $state("ana")
</script>

<Field label="Username" error="This username is taken." required>
  <Input bind:value={username} />
</Field>
