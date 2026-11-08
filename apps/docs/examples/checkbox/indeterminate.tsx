"use client"

import { useState } from "react"
import { Checkbox } from "@glob-ui/checkbox"

export default function CheckboxIndeterminate() {
  const [checked, setChecked] = useState([false, false])
  const all = checked.every(Boolean)
  const some = checked.some(Boolean) && !all

  return (
    <div className="flex flex-col gap-2">
      <Checkbox
        label="Select all"
        checked={all}
        indeterminate={some}
        onChange={(e) => setChecked([e.target.checked, e.target.checked])}
      />
      <div className="ml-6 flex flex-col gap-2">
        {["Email", "SMS"].map((label, i) => (
          <Checkbox
            key={label}
            label={label}
            checked={checked[i]}
            onChange={(e) => setChecked(checked.map((v, j) => (j === i ? e.target.checked : v)))}
          />
        ))}
      </div>
    </div>
  )
}
