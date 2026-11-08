import { RadioGroup, RadioGroupItem } from "@glob-ui/radio-group"

export default function RadioGroupHorizontal() {
  return (
    <RadioGroup defaultValue="monthly" orientation="horizontal" aria-label="Billing">
      <RadioGroupItem value="monthly" label="Monthly" />
      <RadioGroupItem value="yearly" label="Yearly" />
      <RadioGroupItem value="lifetime" label="Lifetime" disabled />
    </RadioGroup>
  )
}
