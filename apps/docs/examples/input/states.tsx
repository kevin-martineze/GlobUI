import { Input } from "@glob-ui/input"

export default function InputStates() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Input size="sm" placeholder="Small" aria-label="Small" />
      <Input size="md" placeholder="Medium" aria-label="Medium" />
      <Input size="lg" placeholder="Large" aria-label="Large" />
      <Input disabled placeholder="Disabled" aria-label="Disabled" />
    </div>
  )
}
