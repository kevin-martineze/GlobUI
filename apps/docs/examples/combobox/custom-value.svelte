<script lang="ts">
  import { Combobox } from "@glob-ui/svelte/combobox"
  import { Field } from "@glob-ui/svelte/field"

  const suggestions = [
    { value: "design", label: "design" },
    { value: "docs", label: "docs" },
    { value: "release", label: "release" },
  ]
  let tag = $state<string | null>(null)
</script>

<div class="flex w-full max-w-sm flex-col gap-3">
  <Field label="Tag" description="Pick a suggestion or type your own and press Enter.">
    <Combobox options={suggestions} bind:value={tag} allowCustomValue placeholder="Add a tag..." />
  </Field>
  <p class="text-sm text-glob-text-secondary">Tag: {tag ?? "none"}</p>
</div>
