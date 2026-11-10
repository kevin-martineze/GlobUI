"use client"

import { useState } from "react"
import { Calendar } from "@glob-ui/calendar"

export default function CalendarLocale() {
  const [value, setValue] = useState<string | null>(null)
  return (
    <div className="flex flex-col gap-3">
      <Calendar locale="es-ES" defaultMonth="2026-11" value={value} onChange={setValue} />
      <p className="text-sm text-glob-text-secondary">
        The week starts on Monday and the names follow the locale (es-ES). Pass <code>weekStartsOn</code> to override it.
      </p>
    </div>
  )
}
