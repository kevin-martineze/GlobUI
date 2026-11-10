"use client"

import { useEffect, useRef, useState } from "react"
import { Combobox, type ComboboxOption } from "@glob-ui/combobox"
import { Field } from "@glob-ui/field"

const cities = ["Amsterdam", "Berlin", "Bogotá", "Buenos Aires", "Cancún", "Lima", "Lisbon", "London", "Madrid", "Mexico City", "Montevideo", "Paris", "Rome", "São Paulo", "Tokyo"]

/** A stand-in for a server search: 400 ms, then the matches. */
function searchCities(query: string) {
  return new Promise<ComboboxOption[]>((resolve) => {
    window.setTimeout(() => {
      const q = query.trim().toLowerCase()
      resolve(cities.filter((c) => c.toLowerCase().includes(q)).map((c) => ({ value: c, label: c })))
    }, 400)
  })
}

export default function ComboboxAsync() {
  const [text, setText] = useState("")
  const [value, setValue] = useState<string | null>(null)
  const [options, setOptions] = useState<ComboboxOption[]>([])
  const [loading, setLoading] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  // Debounce: ask the server after a pause in typing. The latest request wins.
  function onText(next: string) {
    setText(next)
    window.clearTimeout(timer.current)
    if (!next.trim()) {
      setOptions([])
      setLoading(false)
      return
    }
    setLoading(true)
    timer.current = window.setTimeout(() => {
      searchCities(next).then((results) => {
        setOptions(results)
        setLoading(false)
      })
    }, 250)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <div className="w-full max-w-sm">
      <Field label="City" description="Type two letters or more.">
        <Combobox
          options={options}
          filter={false}
          inputValue={text}
          onInputChange={onText}
          value={value}
          onChange={setValue}
          loading={loading}
          emptyMessage="No cities match."
          placeholder="Search cities..."
        />
      </Field>
    </div>
  )
}
