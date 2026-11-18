<script lang="ts">
  import { Combobox } from "@glob-ui/svelte/combobox"
  import { Field } from "@glob-ui/svelte/field"

  const frameworks = [
    "Angular", "Astro", "Ember", "Next.js", "Nuxt", "Preact", "Qwik", "React", "Remix", "Solid", "Svelte", "Vue", "Lit", "Alpine", "Stimulus",
  ].map((label) => ({ value: label.toLowerCase().replace(/\W/g, ""), label }))

  let value = $state<string | null>(null)
</script>

<div class="w-full max-w-sm">
  <Field label="Framework" description={value ? `Selected: ${value}` : "Type to search."}>
    <Combobox options={frameworks} bind:value placeholder="Search frameworks..." />
  </Field>
</div>
