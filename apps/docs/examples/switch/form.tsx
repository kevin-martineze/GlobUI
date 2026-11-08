"use client"

import { useState } from "react"
import { Switch } from "@glob-ui/switch"

export default function SwitchForm() {
  const [submitted, setSubmitted] = useState("not submitted")
  return (
    <form
      className="flex flex-col items-start gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(new FormData(e.currentTarget).get("newsletter") ? "subscribed" : "not subscribed")
      }}
    >
      <div className="flex items-center gap-3">
        <Switch name="newsletter" value="yes" defaultChecked aria-label="Newsletter" />
        <span className="text-sm">Subscribe to the newsletter</span>
      </div>
      <button type="submit" className="rounded-md border border-fd-border px-3 py-1.5 text-sm hover:bg-fd-muted">
        Submit
      </button>
      <p className="text-sm text-fd-muted-foreground">Submitted: {submitted}</p>
    </form>
  )
}
