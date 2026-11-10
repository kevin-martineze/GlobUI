import { Field } from "@glob-ui/field"
import { Slider } from "@glob-ui/slider"

export default function SliderSteps() {
  return (
    <div className="w-full max-w-sm">
      <Field label="Budget" description="In steps of 10">
        <Slider min={0} max={100} step={10} defaultValue={30} />
      </Field>
    </div>
  )
}
