<script lang="ts">
  import { setContext } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { TABS_CLASSES, TABS_ORIENTATION_CLASSES } from "@glob-ui/recipes"
  import { TABS_KEY, type TabsContext } from "../shared/context"

  type Props = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
    /** The selected tab. Bind it with `bind:value`, or leave it unset and use `defaultValue`. */
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    /** Which arrows move between tabs, and where the list sits. */
    orientation?: "horizontal" | "vertical"
    variant?: "underline" | "pill"
  }
  let {
    value = $bindable(undefined),
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    variant = "underline",
    class: className,
    children,
    ...rest
  }: Props = $props()

  const id = $props.id()
  // Only the initial defaultValue is wanted.
  // svelte-ignore state_referenced_locally
  let internal = $state(defaultValue)
  const current = $derived(value ?? internal)

  function setValue(next: string) {
    if (next === current) return
    if (value === undefined) internal = next
    else value = next
    onValueChange?.(next)
  }

  const ctx: TabsContext = {
    get value() {
      return current
    },
    setValue,
    get orientation() {
      return orientation
    },
    get variant() {
      return variant
    },
    baseId: id,
  }
  setContext(TABS_KEY, ctx)
</script>

<div data-orientation={orientation} class={cn(TABS_CLASSES, TABS_ORIENTATION_CLASSES[orientation], className)} {...rest}>
  {@render children?.()}
</div>
