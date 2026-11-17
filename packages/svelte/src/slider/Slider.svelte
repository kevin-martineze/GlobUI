<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { sliderVariants } from "@glob-ui/recipes"
  import { fieldAttributes, getFieldContext } from "../shared/context"

  type Props = Omit<HTMLInputAttributes, "type" | "value" | "size"> & {
    /** The value. Bind it with `bind:value`, or leave it unset and use `defaultValue`. */
    value?: number
    defaultValue?: number
    /** Called with the new number on every change. */
    onValueChange?: (value: number) => void
    size?: "sm" | "md"
  }
  let {
    class: className,
    size,
    value = $bindable(undefined),
    defaultValue,
    onValueChange,
    min = 0,
    max = 100,
    disabled,
    ...rest
  }: Props = $props()

  // Only the initial defaultValue is wanted.
  // svelte-ignore state_referenced_locally
  let internal = $state(defaultValue ?? Number(min))
  const current = $derived(value ?? internal)
  const span = $derived(Number(max) - Number(min))
  const percent = $derived(span > 0 ? ((current - Number(min)) / span) * 100 : 0)

  const field = getFieldContext()
  // svelte-ignore state_referenced_locally
  if (field && rest.id) field.setControlId(rest.id)
  const fromField = $derived(fieldAttributes(field, rest))

  function set(next: number) {
    if (value === undefined) internal = next
    else value = next
    onValueChange?.(next)
  }
</script>

<input
  type="range"
  {min}
  {max}
  value={current}
  {disabled}
  oninput={(event) => set(Number(event.currentTarget.value))}
  class={cn(sliderVariants({ size, className }))}
  style:--glob-slider-fill={`${percent}%`}
  {...rest}
  {...fromField}
/>
