<script lang="ts">
  import { Field } from "@glob-ui/svelte/field"
  import { Slider } from "@glob-ui/svelte/slider"
</script>

<div class="w-full max-w-sm">
  <Field label="Budget" description="In steps of 10">
    <Slider min={0} max={100} step={10} defaultValue={30} />
  </Field>
</div>
