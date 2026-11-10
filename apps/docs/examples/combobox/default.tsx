"use client"

import { useState } from "react"
import { Combobox } from "@glob-ui/combobox"
import { Field } from "@glob-ui/field"

const frameworks = [
  "Angular", "Astro", "Ember", "Next.js", "Nuxt", "Preact", "Qwik", "React", "Remix", "Solid", "Svelte", "Vue", "Lit", "Alpine", "Stimulus",
].map((label) => ({ value: label.toLowerCase().replace(/\W/g, ""), label }))

export default function ComboboxDefault() {
  const [value, setValue] = useState<string | null>(null)
  return (
    <div className="w-full max-w-sm">
      <Field label="Framework" description={value ? `Selected: ${value}` : "Type to search."}>
        <Combobox options={frameworks} value={value} onChange={setValue} placeholder="Search frameworks..." />
      </Field>
    </div>
  )
}
