import { Field } from "@glob-ui/field"
import { PhoneInput } from "@glob-ui/phone-input"

export default function PhoneInputWithField() {
  return (
    <Field label="Phone" error="Enter a valid phone number." className="w-full max-w-sm">
      <PhoneInput country="MX" placeholder="555 000 0000" />
    </Field>
  )
}
