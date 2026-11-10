"use client"

import { useEffect, useRef, useState } from "react"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@glob-ui/command"
import { Spinner } from "@glob-ui/spinner"

const pages = ["Getting started", "Installation", "Button", "Dialog", "Combobox", "Command", "Theming", "Changelog"]

export default function CommandAsync() {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<string[]>(pages)
  const [loading, setLoading] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  // filter={false}: the list is whatever the search returns. This stands in for a server call.
  function onSearch(next: string) {
    setSearch(next)
    window.clearTimeout(timer.current)
    setLoading(true)
    timer.current = window.setTimeout(() => {
      const q = next.trim().toLowerCase()
      setResults(pages.filter((p) => p.toLowerCase().includes(q)))
      setLoading(false)
    }, 400)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <Command
      filter={false}
      search={search}
      onSearchChange={onSearch}
      className="w-full max-w-sm overflow-hidden rounded-glob-lg border border-glob-border bg-glob-surface shadow-glob-md"
    >
      <CommandInput placeholder="Search the docs..." />
      <CommandList>
        {!loading && results.map((page) => <CommandItem key={page} value={page}>{page}</CommandItem>)}
        {loading && (
          <div className="flex items-center gap-2 px-2 py-3 text-sm text-glob-text-secondary">
            <Spinner size="sm" aria-hidden="true" />
            <span>Searching...</span>
          </div>
        )}
      </CommandList>
      {!loading && <CommandEmpty>No pages match.</CommandEmpty>}
    </Command>
  )
}
