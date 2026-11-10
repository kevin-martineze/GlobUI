"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@glob-ui/button"
import { DatePicker } from "@glob-ui/date-picker"
import { Field } from "@glob-ui/field"
import { Input } from "@glob-ui/input"

export default function DatePickerForm() {
  const [submitted, setSubmitted] = useState<string | null>(null)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // The hidden input carries the ISO date, so a native FormData sees "YYYY-MM-DD".
    const data = new FormData(e.currentTarget)
    setSubmitted(`${data.get("name")} · ${data.get("start") || "no date"}`)
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-4">
      <Field label="Name">
        <Input name="name" defaultValue="Ana" />
      </Field>
      <Field label="Start date">
        <DatePicker name="start" defaultValue="2026-11-09" />
      </Field>
      <div>
        <Button type="submit">Save</Button>
      </div>
      {submitted && <p className="text-sm text-glob-text-secondary">Submitted: {submitted}</p>}
    </form>
  )
}
