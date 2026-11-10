"use client"

import { useState } from "react"
import { DatePicker } from "@glob-ui/date-picker"
import { Field } from "@glob-ui/field"

export default function DatePickerDefault() {
  const [value, setValue] = useState<string | null>(null)
  return (
    <div className="w-full max-w-xs">
      <Field label="Due date" description="Pick a day from the calendar.">
        <DatePicker value={value} onChange={setValue} placeholder="Pick a date" />
      </Field>
    </div>
  )
}
