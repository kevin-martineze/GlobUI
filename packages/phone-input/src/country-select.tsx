"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { cn } from "@glob-ui/utils"
import { countries } from "./country-data"

interface CountrySelectProps {
  value: string
  onChange: (iso: string) => void
  size?: "sm" | "md" | "lg"
  disabled?: boolean
}

const sizeStyles = {
  sm: "h-8 text-xs",
  md: "h-10 text-sm",
  lg: "h-12 text-base",
}

export function CountrySelect({ value, onChange, size = "md", disabled }: CountrySelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selected = countries.find((c) => c.iso === value) ?? countries[0]

  const filtered = useMemo(() => {
    if (!search) return countries
    const q = search.toLowerCase()
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.includes(q) ||
        c.iso.toLowerCase().includes(q)
    )
  }, [search])

  useEffect(() => {
    if (open) searchRef.current?.focus()
  }, [open])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 rounded-l-glob-md border border-r-0 border-glob-border bg-glob-surface px-2 text-glob-text transition-colors hover:bg-glob-surface-hover disabled:opacity-50",
          sizeStyles[size]
        )}
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="text-glob-text-secondary">{selected.code}</span>
        <svg
          className={cn("h-3 w-3 text-glob-muted transition-transform", open && "rotate-180")}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-glob-md border border-glob-border bg-glob-surface shadow-glob-md">
          <div className="border-b border-glob-border p-2">
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full rounded-glob-sm border border-glob-border bg-glob-surface-secondary px-2 py-1.5 text-sm text-glob-text placeholder:text-glob-muted outline-none focus:ring-1 focus:ring-glob-ring"
            />
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {filtered.map((country) => {
              const isSelected = country.iso === selected.iso
              return (
                <li key={country.iso}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(country.iso)
                      setOpen(false)
                      setSearch("")
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-glob-primary-light text-glob-primary"
                        : "text-glob-text hover:bg-glob-surface-hover"
                    )}
                  >
                    <span className="text-base leading-none">{country.flag}</span>
                    <span className="flex-1">{country.name}</span>
                    <span className="text-glob-text-secondary">{country.code}</span>
                  </button>
                </li>
              )
            })}
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-glob-muted">
                No countries found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
