"use client"

import { useState } from "react"
import { Calendar, type DateRange } from "@glob-ui/calendar"

export default function CalendarRange() {
  const [range, setRange] = useState<DateRange>({ from: "2026-11-03", to: "2026-11-09" })
  return (
    <div className="flex flex-col gap-3">
      <Calendar mode="range" numberOfMonths={2} value={range} onChange={setRange} defaultMonth="2026-11" />
      <p className="text-sm text-glob-text-secondary">
        {range.from ?? "—"} to {range.to ?? "—"}. The first click sets the start; the second sets the end. Hover previews the range.
      </p>
    </div>
  )
}
