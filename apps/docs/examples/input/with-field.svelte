<script lang="ts">
  import { Field } from "@glob-ui/svelte/field"
  import { Input } from "@glob-ui/svelte/input"
</script>

<Field label="Email" description="We never share it." error="Enter a valid email address.">
  <Input type="email" placeholder="you@example.com" />
</Field>
