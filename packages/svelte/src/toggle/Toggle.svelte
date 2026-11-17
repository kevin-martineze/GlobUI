<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { toggleVariants } from "@glob-ui/recipes"

  type Props = Omit<HTMLButtonAttributes, "value"> & {
    /** On or off. Bind it with `bind:pressed`, or leave it unset and use `defaultPressed`. */
    pressed?: boolean
    defaultPressed?: boolean
    onPressedChange?: (pressed: boolean) => void
    variant?: "default" | "outline"
    size?: "sm" | "md" | "lg"
  }
  /** A button with an on and off state (`aria-pressed`). Give it an accessible name when it has only an icon. */
  let {
    class: className,
    variant,
    size,
    pressed = $bindable(undefined),
    defaultPressed = false,
    onPressedChange,
    onclick,
    disabled,
    children,
    ...rest
  }: Props = $props()

  // Only the initial defaultPressed is wanted.
  // svelte-ignore state_referenced_locally
  let internal = $state(defaultPressed)
  const isPressed = $derived(pressed ?? internal)

  function toggle(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
    onclick?.(event)
    if (event.defaultPrevented) return
    const next = !isPressed
    if (pressed === undefined) internal = next
    else pressed = next
    onPressedChange?.(next)
  }
</script>

<button
  type="button"
  aria-pressed={isPressed}
  data-state={isPressed ? "on" : "off"}
  {disabled}
  class={cn(toggleVariants({ variant, size, className }))}
  {...rest}
  onclick={toggle}
>
  {@render children?.()}
</button>
