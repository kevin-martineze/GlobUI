<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { switchVariants, thumbVariants } from "@glob-ui/recipes"
  import { fieldAttributes, getFieldContext } from "../shared/context"

  type Props = Omit<HTMLButtonAttributes, "value"> & {
    /** On or off. Bind it with `bind:checked`, or leave it unset and use `defaultChecked`. */
    checked?: boolean
    defaultChecked?: boolean
    onCheckedChange?: (checked: boolean) => void
    /** With a name, a hidden input submits `value` in forms while the switch is on. */
    name?: string
    value?: string
    size?: "sm" | "md" | "lg"
  }
  let {
    checked = $bindable(undefined),
    defaultChecked = false,
    onCheckedChange,
    name,
    value = "on",
    size,
    class: className,
    onclick,
    ...rest
  }: Props = $props()

  // Only the initial defaultChecked is wanted.
  // svelte-ignore state_referenced_locally
  let internal = $state(defaultChecked)
  const isOn = $derived(checked ?? internal)

  const field = getFieldContext()
  // svelte-ignore state_referenced_locally
  if (field && rest.id) field.setControlId(rest.id)
  const fromField = $derived(fieldAttributes(field, rest))

  function toggle(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    onclick?.(event)
    if (event.defaultPrevented) return
    const next = !isOn
    // Uncontrolled: keep the state here. Controlled: write through the binding.
    if (checked === undefined) internal = next
    else checked = next
    onCheckedChange?.(next)
  }
</script>

<button
  type="button"
  role="switch"
  aria-checked={isOn}
  data-state={isOn ? "checked" : "unchecked"}
  class={cn(switchVariants({ size, className }))}
  {...rest}
  {...fromField}
  onclick={toggle}
>
  <span class={thumbVariants({ size })}></span>
</button>
{#if name && isOn}<input type="hidden" {name} {value} />{/if}
