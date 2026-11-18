<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { itemVariants, MENU_CHECK_ICON_CLASSES, MENU_ITEM_INDICATOR_CLASSES } from "@glob-ui/recipes"
  import { createMenuItem } from "./items"

  type Props = HTMLAttributes<HTMLDivElement> & {
    /** Bind it with `bind:checked`, or leave it unset and use `defaultChecked`. */
    checked?: boolean
    defaultChecked?: boolean
    onCheckedChange?: (checked: boolean) => void
    /** Close the menu after toggling. Off by default so several options can be changed. */
    closeOnSelect?: boolean
    disabled?: boolean
    onSelect?: (event: Event) => void
    textValue?: string
  }
  let {
    class: className,
    checked = $bindable(undefined),
    defaultChecked = false,
    onCheckedChange,
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

  // svelte-ignore state_referenced_locally
  let internal = $state(defaultChecked)
  const isChecked = $derived(checked ?? internal)

  const options = () => ({
    disabled,
    onSelect,
    textValue,
    closeOnSelect,
    onActivate: () => {
      const next = !isChecked
      if (checked === undefined) internal = next
      else checked = next
      onCheckedChange?.(next)
    },
    onclick: onclick as ((e: MouseEvent) => void) | undefined,
    onkeydown: onkeydown as ((e: KeyboardEvent) => void) | undefined,
    onpointermove: onpointermove as ((e: PointerEvent) => void) | undefined,
    onpointerleave: onpointerleave as ((e: PointerEvent) => void) | undefined,
  })
  const item = createMenuItem(options)
</script>

<div
  role="menuitemcheckbox"
  aria-checked={isChecked}
  class={cn(itemVariants({ inset: true }), className)}
  {...item.attributes(options())}
  {...item.handlers}
  {...rest}
>
  {#if isChecked}
    <span aria-hidden="true" class={MENU_ITEM_INDICATOR_CLASSES}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class={MENU_CHECK_ICON_CLASSES}
      >
        <path d="M5 12l5 5L20 7" />
      </svg>
    </span>
  {/if}
  {@render children?.()}
</div>
