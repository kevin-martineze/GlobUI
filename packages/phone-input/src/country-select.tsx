"use client"

import { useId, useMemo, useRef, useState } from "react"
import { cn } from "@glob-ui/utils"
import { useFloatingPanel, useListbox } from "@glob-ui/hooks"
import { countries } from "@glob-ui/core"

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
  const baseId = useId()
  const listId = `${baseId}-listbox`
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)

  const selected = countries.find((c) => c.iso === value) ?? countries[0]

  // Matches name, dial code and ISO code.
  const filtered = useMemo(() => {
    if (!search) return countries
    const q = search.toLowerCase()
    return countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.code.includes(q) || c.iso.toLowerCase().includes(q)
    )
  }, [search])

  const listbox = useListbox({
    id: baseId,
    items: filtered,
    getKey: (c) => c.iso,
    getText: (c) => c.name,
    open,
  })

  const { setTrigger, setPanel, floatingStyles, triggerHandlers } = useFloatingPanel({
    open,
    onOpenChange: (next) => {
      setOpen(next)
      if (!next) setSearch("")
    },
    placement: "bottom-start",
    offset: 4,
    onShow: () => searchRef.current?.focus({ preventScroll: true }),
  })

  /** Closes the list and clears the search, so the next open starts from the full list. */
  function closeList() {
    setOpen(false)
    setSearch("")
  }

  function openList() {
    if (disabled) return
    listbox.setActiveKey(value)
    setOpen(true)
  }

  function commit(iso: string) {
    onChange(iso)
    closeList()
  }

  function onTriggerKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled || open) return
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      openList()
    }
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (listbox.navigate(e, { homeEnd: false })) return
    if (e.key === "Enter") {
      e.preventDefault()
      if (listbox.activeItem) commit(listbox.activeItem.iso)
    } else if (e.key === "Escape") {
      e.preventDefault()
      closeList()
    } else if (e.key === "Tab") {
      if (listbox.activeItem) onChange(listbox.activeItem.iso)
      closeList()
    }
  }

  return (
    <div className="relative">
      <div
        ref={setTrigger}
        role="combobox"
        aria-label="Country code"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        onPointerDown={() => {
          if (!disabled) triggerHandlers.onPointerDown()
        }}
        onClick={() => {
          if (disabled) return
          if (!open) listbox.setActiveKey(value)
          triggerHandlers.onClick()
        }}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "flex cursor-pointer items-center gap-1 rounded-l-glob-md border border-r-0 border-glob-border bg-glob-surface px-2 text-glob-text transition-colors hover:bg-glob-surface-hover outline-none focus-visible:ring-2 focus-visible:ring-glob-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
          sizeStyles[size]
        )}
      >
        <span className="text-base leading-none" aria-hidden="true">{selected.flag}</span>
        <span className="text-glob-text-secondary">{selected.code}</span>
        <svg
          className={cn("h-3 w-3 text-glob-text-secondary transition-transform", open && "rotate-180")}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      <div
        ref={setPanel}
        popover="auto"
        style={floatingStyles}
        className={cn(
          "m-0 w-72 overflow-visible rounded-glob-md border border-glob-border bg-glob-surface text-sm text-glob-text shadow-glob-md outline-none",
          "opacity-0 transition-[opacity,overlay,display] transition-discrete duration-150 open:opacity-100 starting:open:opacity-0 motion-reduce:transition-none"
        )}
      >
        <div className="border-b border-glob-border p-2">
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onSearchKeyDown}
            placeholder="Search country..."
            aria-label="Search countries"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={listbox.activeDescendant}
            autoComplete="off"
            className="w-full rounded-glob-sm border border-glob-border bg-glob-surface-secondary px-2 py-1.5 text-sm text-glob-text placeholder:text-glob-text-secondary outline-none focus:ring-1 focus:ring-glob-ring"
          />
        </div>
        <div id={listId} role="listbox" aria-label="Countries" className="relative max-h-60 overflow-y-auto p-1">
          {filtered.map((country) => {
            const isSelected = country.iso === selected.iso
            const isActive = listbox.activeKey === country.iso
            return (
              <div
                key={country.iso}
                id={listbox.optionId(country.iso)}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => e.preventDefault()}
                onPointerMove={() => listbox.setActiveKey(country.iso)}
                onClick={() => commit(country.iso)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-glob-sm px-2 py-2 text-left text-sm select-none",
                  isActive && "bg-glob-surface-hover",
                  // The selected row is marked by font weight; the fill colour as text fails contrast on white.
                  isSelected && "font-medium"
                )}
              >
                <span className="text-base leading-none" aria-hidden="true">{country.flag}</span>
                <span className="flex-1">{country.name}</span>
                <span className="text-glob-text">{country.code}</span>
              </div>
            )
          })}
        </div>
        {filtered.length === 0 && (
          <div role="status" className="px-3 py-4 text-center text-sm text-glob-text-secondary">
            No countries found
          </div>
        )}
      </div>
    </div>
  )
}
