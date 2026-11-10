"use client"

import { useState } from "react"
import { Calendar } from "@glob-ui/calendar"

export default function CalendarDefault() {
  const [value, setValue] = useState<string | null>("2026-11-09")
  return (
    <div className="flex flex-col gap-3">
      <Calendar value={value} onChange={setValue} />
      <p className="text-sm text-glob-text-secondary">Selected: {value ?? "none"}</p>
    </div>
  )
}
