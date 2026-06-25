"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"

export interface MultiSelectOption {
  value: string
  label: string
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
}

const triggerSizeStyles = {
  sm: "min-h-8 text-xs",
  md: "min-h-10 text-sm",
  lg: "min-h-12 text-base",
}

const chipSizeStyles = {
  sm: "h-6 text-xs",
  md: "h-7 text-sm",
  lg: "h-8 text-sm",
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  size = "md",
  disabled,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    if (!search) return options
    const q = search.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, search])

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

  function toggleValue(val: string) {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val))
    } else {
      onChange([...value, val])
    }
  }

  function removeValue(val: string) {
    onChange(value.filter((v) => v !== val))
  }

  const selectedItems = options.filter((o) => value.includes(o.value))

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => { if (!disabled) setOpen(!open) }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!disabled) setOpen(!open) } }}
        className={cn(
          "flex min-h-10 w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-glob-md border border-glob-border bg-glob-surface px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring",
          disabled && "cursor-not-allowed opacity-50",
          triggerSizeStyles[size]
        )}
      >
        {selectedItems.length > 0 ? (
          selectedItems.map((item) => (
            <span
              key={item.value}
              className={cn(
                "inline-flex items-center gap-1 rounded-glob-sm bg-glob-primary-light px-2 text-glob-primary",
                chipSizeStyles[size]
              )}
            >
              {item.label}
              <button
                type="button"
                tabIndex={-1}
                disabled={disabled}
                onClick={(e) => { e.stopPropagation(); removeValue(item.value) }}
                className="inline-flex hover:text-glob-primary-hover"
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))
        ) : (
          <span className="text-glob-muted">{placeholder}</span>
        )}
        <svg
          className={cn("ml-auto h-4 w-4 text-glob-muted transition-transform", open && "rotate-180")}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-glob-md border border-glob-border bg-glob-surface shadow-glob-md">
          {options.length > 8 && (
            <div className="border-b border-glob-border p-2">
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-glob-sm border border-glob-border bg-glob-surface-secondary px-2 py-1.5 text-sm text-glob-text placeholder:text-glob-muted outline-none focus:ring-1 focus:ring-glob-ring"
              />
            </div>
          )}
          <ul className="max-h-60 overflow-y-auto">
            {filtered.map((option) => {
              const isSelected = value.includes(option.value)
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => toggleValue(option.value)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-glob-surface-hover",
                      isSelected && "bg-glob-primary-light"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
                        isSelected
                          ? "border-glob-primary bg-glob-primary text-white"
                          : "border-glob-border"
                      )}
                    >
                      {isSelected && (
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className={cn(isSelected ? "text-glob-primary" : "text-glob-text")}>
                      {option.label}
                    </span>
                  </button>
                </li>
              )
            })}
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-glob-muted">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
