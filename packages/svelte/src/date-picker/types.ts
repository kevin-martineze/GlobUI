import type { DateRange } from "@glob-ui/core"

export interface DatePickerPreset {
  label: string
  /** A single day ("YYYY-MM-DD") for single mode, or a range for range mode. */
  value: string | DateRange
}
