"use client"

import { useState } from "react"
import { Button } from "@glob-ui/button"
import { Field } from "@glob-ui/field"
import { Select } from "@glob-ui/select"

const plans = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
]

// `name` writes a hidden input, so a native form submits the value.
export default function SelectForm() {
  const [submitted, setSubmitted] = useState("not submitted")
  return (
    <form
      className="flex w-full max-w-xs flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(new FormData(e.currentTarget).get("plan") as string)
      }}
    >
      <Field label="Plan">
        <Select name="plan" options={plans} defaultValue="pro" />
      </Field>
      <Button type="submit" variant="outline">
        Submit
      </Button>
      <p className="text-sm text-fd-muted-foreground">Submitted plan: {submitted}</p>
    </form>
  )
}
