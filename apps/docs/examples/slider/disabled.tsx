import { Field } from "@glob-ui/field"
import { Slider } from "@glob-ui/slider"

export default function SliderDisabled() {
  return (
    <div className="w-full max-w-sm">
      <Field label="Locked by your plan">
        <Slider disabled defaultValue={70} />
      </Field>
    </div>
  )
}
