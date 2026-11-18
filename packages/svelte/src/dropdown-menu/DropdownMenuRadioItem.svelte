<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { itemVariants, MENU_ITEM_INDICATOR_CLASSES, MENU_RADIO_DOT_CLASSES } from "@glob-ui/recipes"
  import { getMenuRadioGroupContext } from "../shared/context"
  import { createMenuItem } from "./items"

  type Props = HTMLAttributes<HTMLDivElement> & {
    value: string
    /** Close the menu after choosing. Off by default. */
    closeOnSelect?: boolean
    disabled?: boolean
    onSelect?: (event: Event) => void
    textValue?: string
  }
  let {
    class: className,
    value,
    closeOnSelect = false,
    disabled = false,
    onSelect,
    textValue,
    onclick,
    onkeydown,
    onpointermove,
    onpointerleave,
    children,
    ...rest
  }: Props = $props()

  const group = getMenuRadioGroupContext()
  const checked = $derived(group.value === value)

  const options = () => ({
    disabled,
    onSelect,
    textValue,
    closeOnSelect,
    onActivate: () => group.setValue(value),
    onclick: onclick as ((e: MouseEvent) => void) | undefined,
    onkeydown: onkeydown as ((e: KeyboardEvent) => void) | undefined,
    onpointermove: onpointermove as ((e: PointerEvent) => void) | undefined,
    onpointerleave: onpointerleave as ((e: PointerEvent) => void) | undefined,
  })
  const item = createMenuItem(options)
</script>

<div
  role="menuitemradio"
  aria-checked={checked}
  class={cn(itemVariants({ inset: true }), className)}
  {...item.attributes(options())}
  {...item.handlers}
  {...rest}
>
  {#if checked}
    <span aria-hidden="true" class={MENU_ITEM_INDICATOR_CLASSES}>
      <span class={MENU_RADIO_DOT_CLASSES}></span>
    </span>
  {/if}
  {@render children?.()}
</div>
