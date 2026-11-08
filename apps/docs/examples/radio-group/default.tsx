import { RadioGroup, RadioGroupItem } from "@glob-ui/radio-group"

export default function RadioGroupDefault() {
  return (
    <RadioGroup defaultValue="free" aria-label="Plan">
      <RadioGroupItem value="free" label="Free" />
      <RadioGroupItem value="pro" label="Pro" />
      <RadioGroupItem value="team" label="Team" />
    </RadioGroup>
  )
}
