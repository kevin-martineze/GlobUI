"use client"

import { useState } from "react"
import { Select } from "@glob-ui/select"

const countries = [
  { value: "mx", label: "Mexico" },
  { value: "co", label: "Colombia" },
  { value: "ar", label: "Argentina" },
]

export default function SelectDefault() {
  const [country, setCountry] = useState("")
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Select
        aria-label="Country"
        options={countries}
        value={country}
        onChange={setCountry}
        placeholder="Select a country..."
      />
      <p className="text-sm text-fd-muted-foreground">Selected: {country || "none"}</p>
    </div>
  )
}
