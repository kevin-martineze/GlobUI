import { Field } from "@glob-ui/field"
import { Textarea } from "@glob-ui/textarea"

export default function TextareaWithField() {
  return (
    <Field label="Bio" description="Max 200 characters." className="w-full max-w-sm">
      <Textarea placeholder="Tell us about you" />
    </Field>
  )
}
