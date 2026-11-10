"use client"

import { useState } from "react"
import { Calendar, parseISODate } from "@glob-ui/calendar"

const isWeekend = (iso: string) => [0, 6].includes(parseISODate(iso).getDay())

export default function CalendarMinMax() {
  const [value, setValue] = useState<string | null>(null)
  return (
    <div className="flex flex-col gap-3">
      <Calendar
        defaultMonth="2026-11"
        min="2026-11-05"
        max="2026-12-20"
        isDateDisabled={isWeekend}
        value={value}
        onChange={setValue}
      />
      <p className="text-sm text-glob-text-secondary">
        Weekdays from Nov 5 to Dec 20. Days outside are disabled, and the arrows stop at the first and last month.
      </p>
    </div>
  )
}
