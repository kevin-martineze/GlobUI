"use client"

import { useId, useMemo, useRef, useState } from "react"
import { cn, matchesSearch, normalizeText } from "@glob-ui/utils"
import { useControllableState, useFloatingPanel, useListbox, isPrintable } from "@glob-ui/hooks"
import { inputVariants } from "@glob-ui/input"
import { Spinner } from "@glob-ui/spinner"

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
  /** A second, muted line under the label. Searched too. */
  description?: string
}

export interface ComboboxProps {
  options: ComboboxOption[]
  /** Selected option value, or `null` for none. */
  value?: string | null
  defaultValue?: string | null
  /** Called with the selected value, or `null` when cleared. */
  onChange?: (value: string | null) => void
  /** The text in the field. Pass it (with onInputChange) to search on a server. */
  inputValue?: string
  onInputChange?: (text: string) => void
  /** Commit the typed text as the value when no option is active (Enter), or on blur. */
  allowCustomValue?: boolean
  /** `false`: the consumer filters `options` itself. A function: `(option, query) => boolean`. Default: accent-insensitive word match on label, value and description. */
  filter?: false | ((option: ComboboxOption, query: string) => boolean)
  /** Shows a "Loading…" row with a spinner under the options, announced to screen readers. */
  loading?: boolean
  /** Shown when nothing matches. Default "No results.". */
  emptyMessage?: React.ReactNode
  placeholder?: string
  disabled?: boolean
  /** Submitted with native forms through a hidden input. */
  name?: string
  /** Shows an X button while there is text. Default true. */
  clearable?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
  id?: string
  "aria-invalid"?: boolean | "true" | "false"
  "aria-describedby"?: string
  "aria-labelledby"?: string
  "aria-label"?: string
}

const CUSTOM_KEY = "\u0000custom"

type Row = { key: string; label: string; disabled?: boolean; option?: ComboboxOption }

/** The label with the first occurrence of the query in `<mark>`. Cosmetic: the name stays the label. */
function highlight(label: string, query: string) {
  const q = query.trim()
  if (!q) return label
  const index = label.toLowerCase().indexOf(q.toLowerCase())
  if (index < 0) return label
  return (
    <>
      {label.slice(0, index)}
      <mark className="bg-transparent font-semibold text-glob-text">{label.slice(index, index + q.length)}</mark>
      {label.slice(index + q.length)}
    </>
  )
}

/**
 * An editable combobox (WAI-ARIA list autocomplete). Focus stays in the input; the active option is
 * announced through aria-activedescendant.
 */
export function Combobox({
  options,
  value,
  defaultValue = null,
  onChange,
  inputValue,
  onInputChange,
  allowCustomValue = false,
  filter,
  loading = false,
  emptyMessage = "No results.",
  placeholder,
  disabled = false,
  name,
  clearable = true,
  size,
  className,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  "aria-label": ariaLabel,
}: ComboboxProps) {
  const baseId = useId()
  const inputId = id ?? `${baseId}-input`
  const listId = `${baseId}-listbox`
  const inputRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useControllableState<string | null>(value, defaultValue, onChange)
  const [open, setOpen] = useState(false)
  // null: not editing, so the field shows the selected label. A string: what the user typed.
  const [typed, setTyped] = useState<string | null>(null)
  const controlledText = inputValue !== undefined

  const selectedOption = options.find((o) => o.value === selected)
  const selectedLabel = selectedOption?.label ?? selected ?? ""
  const text = controlledText ? inputValue : (typed ?? selectedLabel)
  const query = controlledText ? inputValue : (typed ?? "")

  function setText(next: string) {
    if (!controlledText) setTyped(next)
    onInputChange?.(next)
  }

  const visible = useMemo(() => {
    if (filter === false) return options
    const match = filter ?? ((o: ComboboxOption, q: string) => matchesSearch(q, o.label, o.value, o.description ?? ""))
    return options.filter((o) => match(o, query))
  }, [options, filter, query])

  const trimmed = text.trim()
  const hasExact = options.some((o) => normalizeText(o.label) === normalizeText(trimmed))
  // The "Use ..." row goes last, so with matches the first match stays the active option.
  const rows: Row[] = [
    ...visible.map((option) => ({ key: option.value, label: option.label, disabled: option.disabled, option })),
    ...(allowCustomValue && trimmed !== "" && !hasExact ? [{ key: CUSTOM_KEY, label: trimmed }] : []),
  ]

  const listbox = useListbox({
    id: baseId,
    items: rows,
    getKey: (row) => row.key,
    getText: (row) => row.label,
    isDisabled: (row) => Boolean(row.disabled),
    open,
  })

  const { setTrigger, setPanel, floatingStyles } = useFloatingPanel({
    open,
    onOpenChange: setOpen,
    placement: "bottom-start",
    offset: 4,
    matchTriggerWidth: true,
    // Focus stays in the input, so the browser must not return focus on close.
    restoreFocus: false,
  })

  function openList(active: string | null) {
    if (disabled) return
    listbox.setActiveKey(active)
    setOpen(true)
  }

  function commitValue(next: string | null, label: string) {
    setSelected(next)
    setTyped(null)
    setOpen(false)
    if (controlledText) onInputChange?.(label)
  }

  function commitRow(row: Row) {
    if (row.key === CUSTOM_KEY) commitValue(row.label, row.label)
    else if (row.option) commitValue(row.option.value, row.option.label)
  }

  function clear() {
    setSelected(null)
    setText("")
    setOpen(false)
    inputRef.current?.focus()
  }

  function onBlur() {
    setOpen(false)
    if (allowCustomValue) {
      // The typed text is the value: never leave text that looks selected but is not.
      if (trimmed === "") {
        if (selected !== null) commitValue(null, "")
        else setText("")
      } else if (trimmed !== selected) {
        commitValue(trimmed, trimmed)
      } else {
        setTyped(null)
      }
      return
    }
    // Not committed: show the selected label again (or nothing).
    setTyped(null)
    if (controlledText && text !== selectedLabel) onInputChange?.(selectedLabel)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (disabled) return
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault()
        openList(selected)
        return
      }
    } else if (listbox.navigate(e, { homeEnd: false })) {
      return
    }

    if (e.key === "Enter" && open) {
      e.preventDefault()
      if (listbox.activeItem) commitRow(listbox.activeItem)
      else if (allowCustomValue && trimmed !== "") commitValue(trimmed, trimmed)
      else setOpen(false)
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault()
        setOpen(false)
      } else if (text !== "" || selected !== null) {
        e.preventDefault()
        clear()
      }
    } else if (isPrintable(e) && !open) {
      // Typing opens the list (the change handler filters it).
      setOpen(true)
    }
  }

  const hasText = text !== ""

  return (
    <div className={cn("relative w-full", className)}>
      <div ref={setTrigger} className="relative w-full">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open ? listbox.activeDescendant : undefined}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          aria-labelledby={ariaLabelledBy}
          aria-label={ariaLabel}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          placeholder={placeholder}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setOpen(true)
            listbox.setActiveKey(null)
          }}
          onClick={() => {
            if (!open) openList(selected)
          }}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          className={cn(inputVariants({ size }), "pr-16")}
        />
        {clearable && hasText && !disabled && (
          <button
            type="button"
            aria-label="Clear"
            // Keep focus in the input while clicking.
            onMouseDown={(e) => e.preventDefault()}
            onClick={clear}
            className="absolute right-8 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-glob-sm text-glob-text-secondary hover:bg-glob-surface-hover hover:text-glob-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        <button
          type="button"
          aria-label="Show options"
          tabIndex={-1}
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            if (open) setOpen(false)
            else openList(selected)
            inputRef.current?.focus()
          }}
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-glob-text-secondary disabled:opacity-50"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {name !== undefined && <input type="hidden" name={name} value={selected ?? ""} />}

      <div
        ref={setPanel}
        popover="manual"
        style={floatingStyles}
        className={cn(
          // Reset the UA popover box (inset:0 + margin:auto would center it).
          "m-0 overflow-visible rounded-glob-md border border-glob-border bg-glob-surface text-sm text-glob-text shadow-glob-md outline-none",
          "opacity-0 transition-[opacity,overlay,display] transition-discrete duration-150 open:opacity-100 starting:open:opacity-0 motion-reduce:transition-none"
        )}
      >
        <div id={listId} role="listbox" aria-labelledby={ariaLabelledBy ?? inputId} className="max-h-60 overflow-y-auto p-1">
          {rows.map((row) => {
            const isSelected = row.key !== CUSTOM_KEY && row.key === selected
            const isActive = listbox.activeKey === row.key
            const isCustom = row.key === CUSTOM_KEY
            return (
              <div
                key={row.key}
                id={listbox.optionId(row.key)}
                role="option"
                aria-selected={isSelected}
                aria-disabled={row.disabled || undefined}
                onMouseDown={(e) => e.preventDefault()}
                onPointerMove={() => {
                  if (!row.disabled) listbox.setActiveKey(row.key)
                }}
                onClick={() => {
                  if (!row.disabled) commitRow(row)
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2 rounded-glob-sm px-2 py-2 text-left text-sm select-none",
                  row.disabled && "cursor-not-allowed opacity-50",
                  isActive && !row.disabled && "bg-glob-surface-hover",
                  isSelected && "font-medium"
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate">
                    {isCustom ? `Use "${row.label}"` : highlight(row.label, query)}
                  </span>
                  {row.option?.description && (
                    <span className="block truncate text-xs text-glob-text-secondary">{row.option.description}</span>
                  )}
                </span>
              </div>
            )
          })}
        </div>
        {/* Always mounted, so screen readers hear loading and empty states as they appear. */}
        <div role="status" aria-live="polite" className="empty:hidden">
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-3 text-sm text-glob-text-secondary">
              <Spinner size="sm" aria-hidden="true" />
              <span>Loading…</span>
            </div>
          ) : rows.length === 0 ? (
            <div className="px-3 py-3 text-sm text-glob-text-secondary">{emptyMessage}</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
