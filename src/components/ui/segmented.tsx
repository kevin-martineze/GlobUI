"use client"

import { cn } from "@/lib/utils"

export interface SegmentedOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SegmentedProps {
  options: SegmentedOption[]
  value: string
  onChange: (value: string) => void
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
}

const sizeStyles = {
  sm: "h-8 text-xs px-3",
  md: "h-10 text-sm px-4",
  lg: "h-12 text-base px-5",
}

export function Segmented({ options, value, onChange, size = "md", disabled, className }: SegmentedProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-glob-md border border-glob-border bg-glob-surface-secondary p-0.5",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled || option.disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-glob-sm font-medium transition-all",
              sizeStyles[size],
              isActive
                ? "bg-glob-primary text-white shadow-sm"
                : "text-glob-text-secondary hover:text-glob-text"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
