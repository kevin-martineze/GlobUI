"use client"

import { useId, useMemo, useRef, useState } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { useControllableState, useFloatingPanel, useListbox, isPrintable } from "@glob-ui/hooks"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

const selectVariants = cva(
  "flex w-full cursor-pointer items-center justify-between rounded-glob-md border bg-glob-surface px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-[invalid=true]:border-glob-danger aria-[invalid=true]:focus-visible:ring-glob-danger",
  {
    variants: {
      variant: {
        default: "border-glob-border",
        ghost: "border-transparent hover:bg-glob-surface-hover",
        outline: "border-glob-border bg-transparent hover:bg-glob-surface-hover",
      },
      size: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

/** Above this many options a search field is shown in the list. */
const SEARCH_THRESHOLD = 8

export interface SelectProps
  extends VariantProps<typeof selectVariants>,
    Pick<React.HTMLAttributes<HTMLDivElement>, "id" | "aria-invalid" | "aria-describedby" | "aria-labelledby" | "aria-label"> {
  options: SelectOption[]
  /** Controlled value. */
  value?: string
  /** Initial value when uncontrolled. */
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  /** Submitted with native forms through a hidden input. */
  name?: string
  className?: string
}

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Select...",
  variant,
  size = "md",
  disabled,
  name,
  className,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  "aria-label": ariaLabel,
}: SelectProps) {
  const baseId = useId()
  const triggerId = id ?? `${baseId}-trigger`
  const listId = `${baseId}-listbox`
  const [current, setCurrent] = useControllableState<string | undefined>(value, defaultValue, (next) => {
    if (next !== undefined) onChange?.(next)
  })
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)
  const searchable = options.length > SEARCH_THRESHOLD

  const selected = options.find((o) => o.value === current)

  const filtered = useMemo(() => {
    if (!search) return options
    const q = search.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q))
  }, [options, search])

  const listbox = useListbox({
    id: baseId,
    items: filtered,
    getKey: (o) => o.value,
    getText: (o) => o.label,
    isDisabled: (o) => Boolean(o.disabled),
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
    // Focus the search field when there is one; otherwise focus stays on the trigger.
    onShow: () => searchRef.current?.focus({ preventScroll: true }),
  })

  /** Closes the list and clears the search, so the next open starts from the full list. */
  function closeList() {
    setOpen(false)
    setSearch("")
  }

  function openList() {
    if (disabled) return
    // Start on the selected option, or the first enabled one.
    listbox.setActiveKey(current ?? null)
    setOpen(true)
  }

  function commit(next: string) {
    setCurrent(next)
    closeList()
  }

  function onTriggerKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) return
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        openList()
      } else if (isPrintable(e)) {
        e.preventDefault()
        openList()
        listbox.typeahead(e.key)
      }
      return
    }
    if (listbox.navigate(e)) return
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (listbox.activeItem) commit(listbox.activeItem.value)
      else closeList()
    } else if (e.key === "Escape") {
      e.preventDefault()
      closeList()
    } else if (e.key === "Tab") {
      // APG: Tab selects the active option and moves focus on (no preventDefault).
      if (listbox.activeItem) setCurrent(listbox.activeItem.value)
      closeList()
    } else if (isPrintable(e)) {
      e.preventDefault()
      listbox.typeahead(e.key)
    }
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Home/End stay with the caret in the text field.
    if (listbox.navigate(e, { homeEnd: false })) return
    if (e.key === "Enter") {
      e.preventDefault()
      if (listbox.activeItem) commit(listbox.activeItem.value)
    } else if (e.key === "Escape") {
      e.preventDefault()
      closeList()
    } else if (e.key === "Tab") {
      if (listbox.activeItem) setCurrent(listbox.activeItem.value)
      closeList()
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div
        ref={setTrigger}
        id={triggerId}
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
          if (!open) listbox.setActiveKey(current ?? null)
          triggerHandlers.onClick()
        }}
        onKeyDown={onTriggerKeyDown}
        className={cn(selectVariants({ variant, size }), !selected && "text-glob-text-secondary")}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <svg
          className={cn("h-4 w-4 shrink-0 text-glob-text-secondary transition-transform", open && "rotate-180")}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {name !== undefined && <input type="hidden" name={name} value={current ?? ""} />}

      <div
        ref={setPanel}
        popover="auto"
        style={floatingStyles}
        className={cn(
          // Reset the UA popover box (inset:0 + margin:auto would center it).
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
              placeholder="Search..."
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
          aria-labelledby={ariaLabelledBy ?? triggerId}
          className="relative max-h-60 overflow-y-auto p-1"
        >
          {filtered.map((option) => {
            const isSelected = option.value === current
            const isActive = listbox.activeKey === option.value
            return (
              <div
                key={option.value}
                id={listbox.optionId(option.value)}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                // Keep focus where it is (trigger or search field) while clicking an option.
                onMouseDown={(e) => e.preventDefault()}
                onPointerMove={() => {
                  if (!option.disabled) listbox.setActiveKey(option.value)
                }}
                onClick={() => {
                  if (!option.disabled) commit(option.value)
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-glob-sm px-2 py-2 text-left text-sm select-none",
                  option.disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                  isActive && !option.disabled && "bg-glob-surface-hover",
                  // The filled indicator shows the selection; the fill colour as text fails contrast on white.
                  isSelected && "font-medium"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                    isSelected ? "border-glob-primary bg-glob-primary" : "border-glob-border"
                  )}
                >
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-glob-primary-foreground" />}
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

export { selectVariants }
