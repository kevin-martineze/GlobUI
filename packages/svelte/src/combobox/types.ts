export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
  /** A second, muted line under the label. Searched too. */
  description?: string
}
