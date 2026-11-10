import { ToggleGroup, ToggleGroupItem } from "@glob-ui/toggle"

export default function ToggleGroupMultiple() {
  return (
    <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Text style" variant="outline">
      <ToggleGroupItem value="bold" aria-label="Bold"><span className="font-bold">B</span></ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic"><span className="italic">I</span></ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline"><span className="underline">U</span></ToggleGroupItem>
    </ToggleGroup>
  )
}
