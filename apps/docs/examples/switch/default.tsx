"use client"

import { useState } from "react"
import { Switch } from "@glob-ui/switch"

export default function SwitchDefault() {
  const [on, setOn] = useState(true)
  return (
    <div className="flex items-center gap-3">
      <Switch id="notify" aria-label="Notifications" checked={on} onCheckedChange={setOn} />
      <span className="text-sm">Notifications {on ? "on" : "off"}</span>
    </div>
  )
}
