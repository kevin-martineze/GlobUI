import { Field } from "@glob-ui/field"
import { Input } from "@glob-ui/input"

export default function FieldDefault() {
  return (
    <Field label="Username" description="Lowercase letters and numbers.">
      <Input placeholder="ana.torres" />
    </Field>
  )
}
