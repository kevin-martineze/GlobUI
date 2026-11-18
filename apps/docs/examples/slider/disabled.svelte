<script lang="ts">
  import { Field } from "@glob-ui/svelte/field"
  import { Slider } from "@glob-ui/svelte/slider"
</script>

<div class="w-full max-w-sm">
  <Field label="Locked by your plan">
    <Slider disabled defaultValue={70} />
  </Field>
</div>
