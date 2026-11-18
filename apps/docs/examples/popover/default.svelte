<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
  import { Field } from "@glob-ui/svelte/field"
  import { Input } from "@glob-ui/svelte/input"
  import { Popover, PopoverContent, PopoverTrigger } from "@glob-ui/svelte/popover"

  let width = $state("320")
  let height = $state("240")
</script>

<Popover>
  <PopoverTrigger>
    {#snippet child(props)}<Button variant="outline" {...props}>Set dimensions</Button>{/snippet}
  </PopoverTrigger>
  <PopoverContent aria-label="Dimensions" class="w-64">
    <div class="flex flex-col gap-3">
      <Field label="Width">
        <Input bind:value={width} />
      </Field>
      <Field label="Height">
        <Input bind:value={height} />
      </Field>
    </div>
  </PopoverContent>
</Popover>
