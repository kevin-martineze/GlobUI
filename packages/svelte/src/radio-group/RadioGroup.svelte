<script lang="ts">
  import { setContext } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { RADIO_GROUP_CLASSES, RADIO_GROUP_ORIENTATION_CLASSES } from "@glob-ui/recipes"
  import { fieldAttributes, getFieldContext, RADIO_GROUP_KEY, type ChoiceSize, type RadioGroupContext } from "../shared/context"

  type Props = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
    /** The selected value. Bind it with `bind:value`, or leave it unset and use `defaultValue`. */
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    /** Shared by every radio. Defaults to a generated id. */
    name?: string
    disabled?: boolean
    required?: boolean
    orientation?: "vertical" | "horizontal"
    size?: ChoiceSize
  }
  let {
    value = $bindable(undefined),
    defaultValue,
    onValueChange,
    name,
    disabled = false,
    required = false,
    orientation = "vertical",
    size,
    class: className,
    children,
    ...rest
  }: Props = $props()

  const autoName = $props.id()
  // Only the initial defaultValue is wanted.
  // svelte-ignore state_referenced_locally
  let internal = $state(defaultValue)
  const current = $derived(value ?? internal)

  const field = getFieldContext()
  // svelte-ignore state_referenced_locally
  if (field && rest.id) field.setControlId(rest.id)
  const attributes = $derived({ ...rest, ...fieldAttributes(field, rest) })
  const invalid = $derived(attributes["aria-invalid"] === true || attributes["aria-invalid"] === "true")

  setContext<RadioGroupContext>(RADIO_GROUP_KEY, {
    get name() {
      return name ?? autoName
    },
    get value() {
      return current
    },
    select(next: string) {
      if (value === undefined) internal = next
      else value = next
      onValueChange?.(next)
    },
    get disabled() {
      return disabled
    },
    get required() {
      return required
    },
    get invalid() {
      return invalid
    },
    get size() {
      return size ?? "md"
    },
  })
</script>

<div
  role="radiogroup"
  aria-orientation={orientation}
  aria-required={required || undefined}
  aria-disabled={disabled || undefined}
  class={cn(RADIO_GROUP_CLASSES, RADIO_GROUP_ORIENTATION_CLASSES[orientation], className)}
  {...attributes}
>
  {@render children?.()}
</div>
