<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { toggleVariants } from "@glob-ui/recipes"
  import { getToggleGroupContext } from "../shared/context"

  type Props = Omit<HTMLButtonAttributes, "value"> & {
    /** The value this item stands for in the group's `value`. */
    value: string
  }
  let { class: className, value, onclick, disabled, children, ...rest }: Props = $props()
  const ctx = getToggleGroupContext()
  const on = $derived(ctx.pressed.includes(value))
</script>

<button
  type="button"
  data-roving-item=""
  aria-pressed={on}
  data-state={on ? "on" : "off"}
  disabled={disabled || ctx.disabled}
  onclick={(event) => {
    onclick?.(event)
    if (!event.defaultPrevented) ctx.select(value)
  }}
  class={cn(toggleVariants({ variant: ctx.variant, size: ctx.size, className }))}
  {...rest}
>
  {@render children?.()}
</button>
