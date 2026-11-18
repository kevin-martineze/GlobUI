"use client"

import { useCallback, useId, useMemo, useRef, useState } from "react"
import { cn } from "@glob-ui/utils"
import { useControllableState, useFloatingPanel, useListbox, isPrintable } from "@glob-ui/hooks"
import { FLOATING_TRANSITION_CLASSES, LISTBOX_CHEVRON_OPEN_CLASSES, LISTBOX_CLASSES, LISTBOX_EMPTY_CLASSES, LISTBOX_OPTION_ACTIVE_CLASSES, LISTBOX_OPTION_CLASSES, LISTBOX_OPTION_DISABLED_CLASSES, LISTBOX_OPTION_ENABLED_CLASSES, LISTBOX_PANEL_CLASSES, LISTBOX_SEARCH_INPUT_CLASSES, LISTBOX_SEARCH_WRAPPER_CLASSES, MULTI_SELECT_CHECK_CHECKED_CLASSES, MULTI_SELECT_CHECK_CLASSES, MULTI_SELECT_CHEVRON_CLASSES, MULTI_SELECT_CHIP_CLASSES, MULTI_SELECT_CHIP_REMOVE_CLASSES, MULTI_SELECT_COMBO_CLASSES, MULTI_SELECT_TRIGGER_CLASSES, SELECT_PLACEHOLDER_CLASSES, SELECT_RADIO_UNCHECKED_CLASSES, MULTI_SELECT_CHIP_SIZE, MULTI_SELECT_TRIGGER_SIZE } from "@glob-ui/recipes"

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
          MULTI_SELECT_TRIGGER_CLASSES,
          disabled && LISTBOX_OPTION_DISABLED_CLASSES,
          MULTI_SELECT_TRIGGER_SIZE[size]
        )}
      >
        {selectedItems.map((item) => (
          <span
            key={item.value}
            className={cn(
              MULTI_SELECT_CHIP_CLASSES,
              MULTI_SELECT_CHIP_SIZE[size]
            )}
          >
            {item.label}
            <button
              type="button"
              aria-label={`Remove ${item.label}`}
              disabled={disabled}
              onClick={() => removeChip(item.value)}
              className={MULTI_SELECT_CHIP_REMOVE_CLASSES}
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
          className={MULTI_SELECT_COMBO_CLASSES}
        >
          {selectedItems.length === 0 ? <span className={SELECT_PLACEHOLDER_CLASSES}>{placeholder}</span> : <span className="sr-only">{selectedItems.length} selected</span>}
          <svg
            className={cn(MULTI_SELECT_CHEVRON_CLASSES, open && LISTBOX_CHEVRON_OPEN_CLASSES)}
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
          LISTBOX_PANEL_CLASSES,
          FLOATING_TRANSITION_CLASSES
        )}
      >
        {searchable && (
          <div className={LISTBOX_SEARCH_WRAPPER_CLASSES}>
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
              className={LISTBOX_SEARCH_INPUT_CLASSES}
            />
          </div>
        )}
        <div
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={ariaLabelledBy ?? id}
          className={LISTBOX_CLASSES}
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
                  LISTBOX_OPTION_CLASSES,
                  isDisabled ? LISTBOX_OPTION_DISABLED_CLASSES : LISTBOX_OPTION_ENABLED_CLASSES,
                  isActive && !isDisabled && LISTBOX_OPTION_ACTIVE_CLASSES,
                  // The check mark shows the selection; the fill colour as text fails contrast on white.
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    MULTI_SELECT_CHECK_CLASSES,
                    isSelected ? MULTI_SELECT_CHECK_CHECKED_CLASSES : SELECT_RADIO_UNCHECKED_CLASSES
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
          <div role="status" className={LISTBOX_EMPTY_CLASSES}>
            No results found
          </div>
        )}
      </div>
    </div>
  )
}
