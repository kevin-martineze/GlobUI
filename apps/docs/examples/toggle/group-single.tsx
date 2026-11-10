import { ToggleGroup, ToggleGroupItem } from "@glob-ui/toggle"

export default function ToggleGroupSingle() {
  return (
    <ToggleGroup type="single" defaultValue="left" aria-label="Text alignment" variant="outline">
      <ToggleGroupItem value="left" aria-label="Align left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">Right</ToggleGroupItem>
    </ToggleGroup>
  )
}
