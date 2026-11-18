<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { itemVariants } from "@glob-ui/recipes"
  import { createMenuItem } from "./items"

  type Props = HTMLAttributes<HTMLDivElement> & {
    disabled?: boolean
    /** Runs when the item is chosen with click, Enter or Space. Call `event.preventDefault()` to keep the menu open. */
    onSelect?: (event: Event) => void
    /** Text used by typeahead when the visible text differs (icons, shortcuts). */
    textValue?: string
    variant?: "default" | "danger"
    inset?: boolean
  }
  let {
    class: className,
    variant,
    inset,
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

  const options = () => ({
    disabled,
    onSelect,
    textValue,
    closeOnSelect: true,
    onclick: onclick as ((e: MouseEvent) => void) | undefined,
    onkeydown: onkeydown as ((e: KeyboardEvent) => void) | undefined,
    onpointermove: onpointermove as ((e: PointerEvent) => void) | undefined,
    onpointerleave: onpointerleave as ((e: PointerEvent) => void) | undefined,
  })
  const item = createMenuItem(options)
</script>

<div
  role="menuitem"
  class={cn(itemVariants({ variant, inset }), className)}
  {...item.attributes(options())}
  {...item.handlers}
  {...rest}
>
  {@render children?.()}
</div>
