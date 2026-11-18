<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from "@glob-ui/svelte/toggle"
</script>

<ToggleGroup type="single" defaultValue="left" aria-label="Text alignment" variant="outline">
  <ToggleGroupItem value="left" aria-label="Align left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center" aria-label="Align center">Center</ToggleGroupItem>
  <ToggleGroupItem value="right" aria-label="Align right">Right</ToggleGroupItem>
</ToggleGroup>
