import { Field } from "@glob-ui/field"
import { Input } from "@glob-ui/input"

export default function InputWithField() {
  return (
    <Field label="Email" description="We never share it." error="Enter a valid email address.">
      <Input type="email" placeholder="you@example.com" />
    </Field>
  )
}
