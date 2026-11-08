"use client"

import { forwardRef, useState, useCallback } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { CountrySelect } from "./country-select"

const phoneInputVariants = cva(
  "flex items-center rounded-glob-md border border-glob-border bg-glob-surface transition-colors has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-glob-ring has-[input:focus-visible]:ring-offset-0 has-[[aria-disabled=true]]:opacity-50 has-[[aria-disabled=true]]:cursor-not-allowed has-[input[aria-invalid=true]]:border-glob-danger has-[input[aria-invalid=true]]:has-[input:focus-visible]:ring-glob-danger",
  {
    variants: {
      size: {
        sm: "h-8",
        md: "h-10",
        lg: "h-12",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const inputSizeStyles = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
}

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof phoneInputVariants> {
  country?: string
  onCountryChange?: (iso: string) => void
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, size = "md", country, onCountryChange, value, onChange, placeholder, disabled, ...props }, ref) => {
    const [internalCountry, setInternalCountry] = useState("US")
    const selectedIso = country ?? internalCountry

    const handleCountryChange = useCallback(
      (iso: string) => {
        setInternalCountry(iso)
        onCountryChange?.(iso)
      },
      [onCountryChange]
    )

    return (
      <div className={cn(phoneInputVariants({ size, className }))}>
        <CountrySelect
          value={selectedIso}
          onChange={handleCountryChange}
          size={size ?? "md"}
          disabled={disabled}
        />

        <div className="h-5 w-px bg-glob-border" />

        <div className="flex flex-1 items-center pl-2">
          <input
            ref={ref}
            type="tel"
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder ?? "555 000 0000"}
            className={cn(
              "h-full flex-1 bg-transparent text-glob-text outline-none placeholder:text-glob-muted",
              inputSizeStyles[size ?? "md"]
            )}
            {...props}
          />
        </div>
      </div>
    )
  }
)
PhoneInput.displayName = "PhoneInput"

export { PhoneInput, phoneInputVariants }
