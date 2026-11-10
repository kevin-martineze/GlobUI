import { Field } from "@glob-ui/field"
import { Input } from "@glob-ui/input"

export default function FieldError() {
  return (
    <Field label="Username" error="This username is taken." required>
      <Input defaultValue="ana" />
    </Field>
  )
}
