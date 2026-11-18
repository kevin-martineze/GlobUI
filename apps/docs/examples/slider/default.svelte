<script lang="ts">
  import { Field } from "@glob-ui/svelte/field"
  import { Slider } from "@glob-ui/svelte/slider"

  let value = $state(40)
</script>

<div class="w-full max-w-sm">
  <Field label="Volume" description={`Currently ${value}`}>
    <Slider bind:value />
  </Field>
</div>
