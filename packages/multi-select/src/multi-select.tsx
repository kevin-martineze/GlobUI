"use client"

import { useCallback, useId, useMemo, useRef, useState } from "react"
import { cn } from "@glob-ui/utils"
import { useControllableState, useFloatingPanel, useListbox, isPrintable } from "@glob-ui/hooks"

export interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

/** Above this many options a search field is shown in the list. */
const SEARCH_THRESHOLD = 8

export interface MultiSelectProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, "id" | "aria-invalid" | "aria-describedby" | "aria-labelledby" | "aria-label"> {
  options: MultiSelectOption[]
  /** Controlled selection. */
  value?: string[]
  /** Initial selection when uncontrolled. */
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  /** One hidden input per selected value, for native forms. */
  name?: string
  /** Maximum number of selected options. Further options are disabled until one is removed. */
  max?: number
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
  defaultValue,
  onChange,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  size = "md",
  disabled,
  name,
  max,
  className,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  "aria-label": ariaLabel,
}: MultiSelectProps) {
  const baseId = useId()
  const listId = `${baseId}-listbox`
  const [current, setCurrent] = useControllableState<string[]>(value, defaultValue ?? [], onChange)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)
  const comboRef = useRef<HTMLDivElement | null>(null)
  const searchable = options.length > SEARCH_THRESHOLD

  const selectedItems = options.filter((o) => current.includes(o.value))
  const atMax = max !== undefined && current.length >= max

  const filtered = useMemo(() => {
    if (!search) return options
    const q = search.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, search])

  const listbox = useListbox({
    id: baseId,
    items: filtered,
    getKey: (o) => o.value,
    getText: (o) => o.label,
    isDisabled: (o) => Boolean(o.disabled) || (atMax && !current.includes(o.value)),
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
    matchTriggerWidth: true,
    onShow: () => searchRef.current?.focus({ preventScroll: true }),
  })

  // The panel's trigger is the combobox element; keep a DOM ref too for focus after chip removal.
  const setComboRef = useCallback(
    (el: HTMLDivElement | null) => {
      comboRef.current = el
      setTrigger(el)
    },
    [setTrigger]
  )

  /** Closes the list and clears the search, so the next open starts from the full list. */
  function closeList() {
    setOpen(false)
    setSearch("")
  }

  function openList() {
    if (disabled) return
    listbox.setActiveKey(selectedItems[0]?.value ?? null)
    setOpen(true)
  }

  function toggle(val: string) {
    if (current.includes(val)) setCurrent(current.filter((v) => v !== val))
    else setCurrent([...current, val])
  }

  function removeChip(val: string) {
    setCurrent(current.filter((v) => v !== val))
    comboRef.current?.focus({ preventScroll: true })
  }

  function onComboKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) return
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        openList()
      }
      return
    }
    if (listbox.navigate(e)) return
    if (e.key === "Enter" || e.key === " ") {
      // Toggles without closing: several options can be picked in one go.
      e.preventDefault()
      if (listbox.activeItem) toggle(listbox.activeItem.value)
    } else if (e.key === "Escape") {
      e.preventDefault()
      closeList()
    } else if (e.key === "Tab") {
      closeList()
    } else if (isPrintable(e)) {
      e.preventDefault()
      listbox.typeahead(e.key)
    }
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (listbox.navigate(e, { homeEnd: false })) return
    if (e.key === "Enter") {
      e.preventDefault()
      if (listbox.activeItem) toggle(listbox.activeItem.value)
    } else if (e.key === "Escape") {
      e.preventDefault()
      closeList()
    } else if (e.key === "Tab") {
      closeList()
    } else if (e.key === "Backspace" && search === "" && current.length > 0) {
      // Empty search + Backspace removes the last chip.
      e.preventDefault()
      setCurrent(current.slice(0, -1))
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex w-full flex-wrap items-center gap-1.5 rounded-glob-md border border-glob-border bg-glob-surface px-3 py-1.5 text-sm transition-colors focus-within:ring-2 focus-within:ring-glob-ring has-[[aria-invalid=true]]:border-glob-danger has-[[aria-invalid=true]]:focus-within:ring-glob-danger",
          disabled && "cursor-not-allowed opacity-50",
          triggerSizeStyles[size]
        )}
      >
        {selectedItems.map((item) => (
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
              aria-label={`Remove ${item.label}`}
              disabled={disabled}
              onClick={() => removeChip(item.value)}
              className="inline-flex rounded-glob-sm hover:text-glob-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:cursor-not-allowed"
            >
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}

        <div
          ref={setComboRef}
          id={id}
          role="combobox"
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && !searchable ? listbox.activeDescendant : undefined}
          aria-disabled={disabled || undefined}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          aria-labelledby={ariaLabelledBy}
          aria-label={ariaLabel}
          onPointerDown={() => {
            if (!disabled) triggerHandlers.onPointerDown()
          }}
          onClick={() => {
            if (disabled) return
            if (!open) listbox.setActiveKey(selectedItems[0]?.value ?? null)
            triggerHandlers.onClick()
          }}
          onKeyDown={onComboKeyDown}
          className="flex min-h-6 min-w-16 flex-1 cursor-pointer items-center justify-between gap-2 outline-none"
        >
          {selectedItems.length === 0 ? <span className="text-glob-text-secondary">{placeholder}</span> : <span className="sr-only">{selectedItems.length} selected</span>}
          <svg
            className={cn("ml-auto h-4 w-4 shrink-0 text-glob-muted transition-transform", open && "rotate-180")}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      {name !== undefined &&
        current.map((v) => <input key={v} type="hidden" name={name} value={v} />)}

      <div
        ref={setPanel}
        popover="auto"
        style={floatingStyles}
        className={cn(
          "m-0 overflow-visible rounded-glob-md border border-glob-border bg-glob-surface text-sm text-glob-text shadow-glob-md outline-none",
          "opacity-0 transition-[opacity,overlay,display] transition-discrete duration-150 open:opacity-100 starting:open:opacity-0 motion-reduce:transition-none"
        )}
      >
        {searchable && (
          <div className="border-b border-glob-border p-2">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder={searchPlaceholder}
              aria-label="Search options"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={listbox.activeDescendant}
              autoComplete="off"
              className="w-full rounded-glob-sm border border-glob-border bg-glob-surface-secondary px-2 py-1.5 text-sm text-glob-text placeholder:text-glob-text-secondary outline-none focus:ring-1 focus:ring-glob-ring"
            />
          </div>
        )}
        <div
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={ariaLabelledBy ?? id}
          className="relative max-h-60 overflow-y-auto p-1"
        >
          {filtered.map((option) => {
            const isSelected = current.includes(option.value)
            const isDisabled = Boolean(option.disabled) || (atMax && !isSelected)
            const isActive = listbox.activeKey === option.value
            return (
              <div
                key={option.value}
                id={listbox.optionId(option.value)}
                role="option"
                aria-selected={isSelected}
                aria-disabled={isDisabled || undefined}
                onMouseDown={(e) => e.preventDefault()}
                onPointerMove={() => {
                  if (!isDisabled) listbox.setActiveKey(option.value)
                }}
                onClick={() => {
                  if (!isDisabled) toggle(option.value)
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-glob-sm px-2 py-2 text-left text-sm select-none",
                  isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                  isActive && !isDisabled && "bg-glob-surface-hover",
                  // The check mark shows the selection; orange text on white fails contrast.
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
                    isSelected ? "border-glob-primary bg-glob-primary text-glob-primary-foreground" : "border-glob-border"
                  )}
                >
                  {isSelected && (
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span>{option.label}</span>
              </div>
            )
          })}
        </div>
        {filtered.length === 0 && (
          <div role="status" className="px-3 py-4 text-center text-sm text-glob-text-secondary">
            No results found
          </div>
        )}
      </div>
    </div>
  )
}
