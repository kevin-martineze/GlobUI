"use client"

import { useId, useMemo, useRef, useState } from "react"
import { cn } from "@glob-ui/utils"
import { useFloatingPanel, useListbox } from "@glob-ui/hooks"
import { countries } from "@glob-ui/core"
import {
  COUNTRY_CHEVRON_CLASSES,
  COUNTRY_DIAL_CLASSES,
  COUNTRY_EMPTY_CLASSES,
  COUNTRY_FLAG_CLASSES,
  COUNTRY_LIST_CLASSES,
  COUNTRY_NAME_CLASSES,
  COUNTRY_OPTION_ACTIVE_CLASSES,
  COUNTRY_OPTION_CLASSES,
  COUNTRY_OPTION_SELECTED_CLASSES,
  COUNTRY_PANEL_CLASSES,
  COUNTRY_SEARCH_INPUT_CLASSES,
  COUNTRY_SEARCH_WRAPPER_CLASSES,
  COUNTRY_SELECT_CLASSES,
  COUNTRY_TRIGGER_CLASSES,
  COUNTRY_TRIGGER_CODE_CLASSES,
  COUNTRY_TRIGGER_SIZE,
  FLOATING_TRANSITION_CLASSES,
  LISTBOX_CHEVRON_OPEN_CLASSES,
} from "@glob-ui/recipes"

interface CountrySelectProps {
  value: string
  onChange: (iso: string) => void
  size?: "sm" | "md" | "lg"
  disabled?: boolean
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
    <div className={COUNTRY_SELECT_CLASSES}>
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
        className={cn(COUNTRY_TRIGGER_CLASSES, COUNTRY_TRIGGER_SIZE[size])}
      >
        <span className={COUNTRY_FLAG_CLASSES} aria-hidden="true">{selected.flag}</span>
        <span className={COUNTRY_TRIGGER_CODE_CLASSES}>{selected.code}</span>
        <svg
          className={cn(COUNTRY_CHEVRON_CLASSES, open && LISTBOX_CHEVRON_OPEN_CLASSES)}
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
        className={cn(COUNTRY_PANEL_CLASSES, FLOATING_TRANSITION_CLASSES)}
      >
        <div className={COUNTRY_SEARCH_WRAPPER_CLASSES}>
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
            className={COUNTRY_SEARCH_INPUT_CLASSES}
          />
        </div>
        <div id={listId} role="listbox" aria-label="Countries" className={COUNTRY_LIST_CLASSES}>
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
                className={cn(COUNTRY_OPTION_CLASSES, isActive && COUNTRY_OPTION_ACTIVE_CLASSES, isSelected && COUNTRY_OPTION_SELECTED_CLASSES)}
              >
                <span className={COUNTRY_FLAG_CLASSES} aria-hidden="true">{country.flag}</span>
                <span className={COUNTRY_NAME_CLASSES}>{country.name}</span>
                <span className={COUNTRY_DIAL_CLASSES}>{country.code}</span>
              </div>
            )
          })}
        </div>
        {filtered.length === 0 && (
          <div role="status" className={COUNTRY_EMPTY_CLASSES}>
            No countries found
          </div>
        )}
      </div>
    </div>
  )
}
