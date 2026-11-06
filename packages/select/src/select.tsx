"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"

export interface SelectOption {
  value: string
  label: string
}

const selectVariants = cva(
  "flex w-full items-center justify-between rounded-glob-md border bg-glob-surface px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-glob-danger aria-[invalid=true]:focus-visible:ring-glob-danger",
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

export interface SelectProps
  extends VariantProps<typeof selectVariants>,
    Pick<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      "id" | "aria-invalid" | "aria-describedby" | "aria-labelledby"
    > {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  variant,
  size = "md",
  disabled,
  className,
  ...triggerProps
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selected = options.find((o) => o.value === value)

  const filtered = useMemo(() => {
    if (!search) return options
    const q = search.toLowerCase()
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    )
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

  function handleSelect(optionValue: string) {
    onChange?.(optionValue)
    setOpen(false)
    setSearch("")
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        {...triggerProps}
        onClick={() => setOpen(!open)}
        className={cn(
          selectVariants({ variant, size }),
          !selected && "text-glob-muted"
        )}
      >
        <span className="truncate">
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={cn("h-4 w-4 shrink-0 text-glob-muted transition-transform", open && "rotate-180")}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-glob-md border border-glob-border bg-glob-surface shadow-glob-md">
          {options.length > 8 && (
            <div className="border-b border-glob-border p-2">
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-glob-sm border border-glob-border bg-glob-surface-secondary px-2 py-1.5 text-sm text-glob-text placeholder:text-glob-muted outline-none focus:ring-1 focus:ring-glob-ring"
              />
            </div>
          )}
          <ul className="max-h-60 overflow-y-auto">
            {filtered.map((option) => {
              const isSelected = option.value === value
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-glob-surface-hover",
                      isSelected && "bg-glob-primary-light"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                        isSelected
                          ? "border-glob-primary bg-glob-primary"
                          : "border-glob-border"
                      )}
                    >
                      {isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span className={cn(isSelected && "text-glob-primary font-medium")}>
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

export { selectVariants }
