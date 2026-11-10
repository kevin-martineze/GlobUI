"use client"

import { useState } from "react"
import { MultiSelect } from "@glob-ui/multi-select"

const tags = [
  { value: "design", label: "Design" },
  { value: "code", label: "Code" },
  { value: "docs", label: "Docs" },
]

export default function MultiSelectDefault() {
  const [value, setValue] = useState<string[]>(["design"])
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <MultiSelect options={tags} value={value} onChange={setValue} aria-label="Tags" />
      <p className="text-sm text-fd-muted-foreground">Selected: {value.join(", ") || "none"}</p>
    </div>
  )
}
