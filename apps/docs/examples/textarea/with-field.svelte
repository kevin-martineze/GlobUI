<script lang="ts">
  import { Field } from "@glob-ui/svelte/field"
  import { Textarea } from "@glob-ui/svelte/textarea"
</script>

<Field label="Bio" description="Max 200 characters." class="w-full max-w-sm">
  <Textarea placeholder="Tell us about you" />
</Field>
