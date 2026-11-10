"use client"

import { useState } from "react"
import { Segmented } from "@glob-ui/segmented"

export default function SegmentedDefault() {
  const [range, setRange] = useState("week")
  return (
    <div className="flex flex-col items-center gap-3">
      <Segmented
        aria-label="Range"
        options={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
        ]}
        value={range}
        onChange={setRange}
      />
      <p className="text-sm text-fd-muted-foreground">Showing: {range}</p>
    </div>
  )
}
