import { Segmented } from "@glob-ui/segmented"

const options = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
]

export default function SegmentedSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Segmented size="sm" aria-label="Small" options={options} defaultValue="a" />
      <Segmented size="md" aria-label="Medium" options={options} defaultValue="a" />
      <Segmented size="lg" aria-label="Large" options={options} defaultValue="a" />
    </div>
  )
}
