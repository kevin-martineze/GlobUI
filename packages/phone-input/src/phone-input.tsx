"use client"

import { forwardRef, useState, useCallback } from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { CountrySelect } from "./country-select"
import {
  PHONE_INPUT_DIVIDER_CLASSES,
  PHONE_INPUT_FIELD_CLASSES,
  PHONE_INPUT_FIELD_WRAPPER_CLASSES,
  PHONE_INPUT_TEXT_SIZE,
  phoneInputVariants,
} from "@glob-ui/recipes"

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

        <div className={PHONE_INPUT_DIVIDER_CLASSES} />

        <div className={PHONE_INPUT_FIELD_WRAPPER_CLASSES}>
          <input
            ref={ref}
            type="tel"
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder ?? "555 000 0000"}
            className={cn(PHONE_INPUT_FIELD_CLASSES, PHONE_INPUT_TEXT_SIZE[size ?? "md"])}
            {...props}
          />
        </div>
      </div>
    )
  }
)
PhoneInput.displayName = "PhoneInput"

export { PhoneInput, phoneInputVariants }
