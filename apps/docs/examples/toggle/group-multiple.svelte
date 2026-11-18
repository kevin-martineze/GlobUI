<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from "@glob-ui/svelte/toggle"
</script>

<ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Text style" variant="outline">
  <ToggleGroupItem value="bold" aria-label="Bold"><span class="font-bold">B</span></ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Italic"><span class="italic">I</span></ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Underline"><span class="underline">U</span></ToggleGroupItem>
</ToggleGroup>
