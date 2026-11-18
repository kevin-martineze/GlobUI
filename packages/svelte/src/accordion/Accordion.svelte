<script lang="ts">
  import { onDestroy, setContext } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { createRovingFocus } from "@glob-ui/core"
  import { ACCORDION_CLASSES } from "@glob-ui/recipes"
  import { ACCORDION_KEY, type AccordionContext } from "../shared/context"

  type Base = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue">
  type Single = {
    type?: "single"
    /** The open item. Bind it with `bind:value`, or leave it unset and use `defaultValue`. */
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    /** Allow closing the open item, leaving none open. */
    collapsible?: boolean
  }
  type Multiple = {
    type: "multiple"
    /** The open items. Bind it with `bind:value`, or leave it unset and use `defaultValue`. */
    value?: string[]
    defaultValue?: string[]
    onValueChange?: (value: string[]) => void
    collapsible?: never
  }
  type Props = Base & (Single | Multiple)

  let {
    type = "single",
    value = $bindable(undefined),
    defaultValue,
    onValueChange,
    collapsible = false,
    class: className,
    onkeydown,
    children,
    ...rest
  }: Props = $props()

  const toArray = (v: string | string[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : v ? [v] : [])

  // Only the initial defaultValue is wanted.
  // svelte-ignore state_referenced_locally
  let internal = $state(toArray(defaultValue))
  const openValues = $derived(value !== undefined ? toArray(value) : internal)

  function toggle(item: string) {
    const isOpen = openValues.includes(item)
    let next: string[]
    if (type === "multiple") next = isOpen ? openValues.filter((v) => v !== item) : [...openValues, item]
    else if (isOpen) {
      if (!collapsible) return
      next = []
    } else next = [item]

    const emitted = type === "multiple" ? next : (next[0] ?? "")
    if (value === undefined) internal = next
    else value = emitted
    ;(onValueChange as ((v: string | string[]) => void) | undefined)?.(emitted)
  }

  const ctx: AccordionContext = {
    isOpen: (v) => openValues.includes(v),
    toggle,
  }
  setContext(ACCORDION_KEY, ctx)

  // Optional APG keys: move between headers with arrows / Home / End.
  const roving = createRovingFocus({ orientation: "vertical", loop: true, itemSelector: "[data-accordion-trigger]:not([disabled])" })
  onDestroy(() => roving.destroy())
</script>

<!-- The arrows move focus between the header buttons; the container itself is not interactive. -->
<div
  class={cn(ACCORDION_CLASSES, className)}
  data-roving-root=""
  onkeydown={(event) => {
    onkeydown?.(event)
    roving.handleKeyDown(event)
  }}
  {...rest}
>
  {@render children?.()}
</div>
