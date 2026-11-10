"use client"

import { useState } from "react"
import { DatePicker, type DatePickerPreset } from "@glob-ui/date-picker"
import { Field } from "@glob-ui/field"
import { todayISODate, addDays, toISODate } from "@glob-ui/calendar"

function presets(): DatePickerPreset[] {
  const today = todayISODate()
  const d = new Date()
  const monthStart = toISODate(new Date(d.getFullYear(), d.getMonth(), 1))
  const monthEnd = toISODate(new Date(d.getFullYear(), d.getMonth() + 1, 0))
  return [
    { label: "Today", value: today },
    { label: "Last 7 days", value: { from: addDays(today, -6), to: today } },
    { label: "Last 30 days", value: { from: addDays(today, -29), to: today } },
    { label: "This month", value: { from: monthStart, to: monthEnd } },
  ]
}

export default function DatePickerRange() {
  const [range, setRange] = useState<{ from: string | null; to: string | null }>({ from: null, to: null })
  return (
    <div className="w-full max-w-md">
      <Field label="Stay" description="Choose the first and the last day, or a preset.">
        <DatePicker mode="range" value={range} onChange={setRange} presets={presets()} placeholder="Pick a date range" />
      </Field>
    </div>
  )
}
