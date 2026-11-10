"use client"

import { useState } from "react"
import { Combobox, type ComboboxOption } from "@glob-ui/combobox"
import { Field } from "@glob-ui/field"

const plans: ComboboxOption[] = [
  { value: "free", label: "Free", description: "For side projects. Up to 3 members." },
  { value: "pro", label: "Pro", description: "For teams. Unlimited members and audit logs." },
  { value: "enterprise", label: "Enterprise", description: "SSO and a support contract.", disabled: true },
]

export default function ComboboxDescriptions() {
  const [value, setValue] = useState<string | null>("free")
  return (
    <div className="w-full max-w-sm">
      <Field label="Plan" description="Enterprise needs a sales call, so it is not available here.">
        <Combobox options={plans} value={value} onChange={setValue} />
      </Field>
    </div>
  )
}
