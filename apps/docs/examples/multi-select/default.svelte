<script lang="ts">
  import { MultiSelect } from "@glob-ui/svelte/multi-select"

  const tags = [
    { value: "design", label: "Design" },
    { value: "code", label: "Code" },
    { value: "docs", label: "Docs" },
  ]
  let value = $state(["design"])
</script>

<div class="flex w-full max-w-sm flex-col gap-2">
  <MultiSelect options={tags} bind:value aria-label="Tags" />
  <p class="text-sm text-fd-muted-foreground">Selected: {value.join(", ") || "none"}</p>
</div>
