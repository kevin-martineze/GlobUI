import { useCallback, useState } from "react"

/**
 * State that is controlled when `prop` is defined and internal otherwise.
 * `onChange` fires only when the value actually changes.
 */
export function useControllableState<T>(
  prop: T | undefined,
  defaultProp: T,
  onChange?: (value: T) => void
): readonly [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultProp)
  const isControlled = prop !== undefined
  const value = isControlled ? prop : internal
  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next)
      if (next !== value) onChange?.(next)
    },
    [isControlled, value, onChange]
  )
  return [value, setValue] as const
}
