"use client"

import { forwardRef } from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { useControllableState } from "@glob-ui/hooks"
import { sliderVariants } from "@glob-ui/recipes"

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange" | "size">,
    VariantProps<typeof sliderVariants> {
  value?: number
  defaultValue?: number
  /** Called with the new number on every change. */
  onValueChange?: (value: number) => void
  /** Marks the slider as invalid for assistive technology (use with Field). */
  "aria-invalid"?: boolean | "true" | "false"
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, size, value, defaultValue, onValueChange, min = 0, max = 100, disabled, style, ...props }, ref) => {
    const [current, setCurrent] = useControllableState<number>(value, defaultValue ?? Number(min), onValueChange)
    const span = Number(max) - Number(min)
    const percent = span > 0 ? ((current - Number(min)) / span) * 100 : 0

    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        value={current}
        disabled={disabled}
        onChange={(e) => setCurrent(Number(e.target.value))}
        className={cn(sliderVariants({ size, className }))}
        style={{ ...style, ["--glob-slider-fill" as string]: `${percent}%` }}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider, sliderVariants }
