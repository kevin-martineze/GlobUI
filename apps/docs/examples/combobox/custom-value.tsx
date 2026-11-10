"use client"

import { useState } from "react"
import { Combobox } from "@glob-ui/combobox"
import { Field } from "@glob-ui/field"

const suggestions = [
  { value: "design", label: "design" },
  { value: "docs", label: "docs" },
  { value: "release", label: "release" },
]

export default function ComboboxCustomValue() {
  const [tag, setTag] = useState<string | null>(null)
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Field label="Tag" description="Pick a suggestion or type your own and press Enter.">
        <Combobox options={suggestions} value={tag} onChange={setTag} allowCustomValue placeholder="Add a tag..." />
      </Field>
      <p className="text-sm text-glob-text-secondary">Tag: {tag ?? "none"}</p>
    </div>
  )
}
