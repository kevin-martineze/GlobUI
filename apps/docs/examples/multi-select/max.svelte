<script lang="ts">
  import { MultiSelect } from "@glob-ui/svelte/multi-select"

  const skills = ["TypeScript", "React", "CSS", "Testing", "Accessibility", "Node"].map((label) => ({
    value: label.toLowerCase(),
    label,
  }))
</script>

<!-- `max` disables the other options once two are chosen. Removing a chip re-enables them. -->
<MultiSelect options={skills} defaultValue={["react", "css"]} max={2} name="skills" aria-label="Skills" class="w-full max-w-sm" />
