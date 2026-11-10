"use client"

import { useState } from "react"
import { Field } from "@glob-ui/field"
import { Slider } from "@glob-ui/slider"

export default function SliderDefault() {
  const [value, setValue] = useState(40)

  return (
    <div className="w-full max-w-sm">
      <Field label="Volume" description={`Currently ${value}`}>
        <Slider value={value} onValueChange={setValue} />
      </Field>
    </div>
  )
}
