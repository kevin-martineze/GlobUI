<script lang="ts">
  import { onDestroy, setContext, tick } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { createRovingFocus } from "@glob-ui/core"
  import { TOGGLE_GROUP_CLASSES } from "@glob-ui/recipes"
  import { TOGGLE_GROUP_KEY, type ToggleGroupContext } from "../shared/context"

  type Props = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> & {
    /** `single`: one item can be pressed (pressing it again clears it). `multiple`: several can. */
    type: "single" | "multiple"
    /** The pressed value: a string ("" for none) in single mode, a list in multiple mode. Bindable. */
    value?: string | string[]
    defaultValue?: string | string[]
    onValueChange?: (value: string | string[]) => void
    variant?: "default" | "outline"
    size?: "sm" | "md" | "lg"
    orientation?: "horizontal" | "vertical"
    disabled?: boolean
  }
  /**
   * A row of toggles. Items are `aria-pressed` buttons in one tab stop: arrows move focus.
   */
  let {
    type,
    value = $bindable(undefined),
    defaultValue,
    onValueChange,
    variant,
    size,
    orientation = "horizontal",
    disabled = false,
    class: className,
    children,
    onkeydown,
    onfocusin,
    ...rest
  }: Props = $props()

  // Internally a list of values; single mode maps "" to [] and back.
  const toList = (v: string | string[] | undefined): string[] | undefined =>
    v === undefined ? undefined : Array.isArray(v) ? v : v ? [v] : []
  // Only the initial defaultValue is wanted.
  // svelte-ignore state_referenced_locally
  let internal = $state<string[]>(toList(defaultValue) ?? [])
  const pressed = $derived(toList(value) ?? internal)

  function select(item: string) {
    const next =
      type === "single"
        ? pressed.includes(item) ? [] : [item]
        : pressed.includes(item) ? pressed.filter((v) => v !== item) : [...pressed, item]
    const out = type === "single" ? (next[0] ?? "") : next
    if (value === undefined) internal = next
    else value = out
    onValueChange?.(out)
  }

  setContext<ToggleGroupContext>(TOGGLE_GROUP_KEY, {
    get pressed() {
      return pressed
    },
    select,
    get variant() {
      return variant
    },
    get size() {
      return size
    },
    get disabled() {
      return disabled
    },
  })

  // svelte-ignore state_referenced_locally
  const roving = createRovingFocus({ orientation, loop: true })
  $effect(() => roving.update({ orientation, loop: true }))
  onDestroy(() => roving.destroy())

  let root: HTMLDivElement | undefined = $state()
  let stop: HTMLElement | null = null

  // One tab stop: the last focused item, else the first pressed one, else the first enabled one.
  function syncTabStop() {
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-roving-item]"))
    const enabled = items.filter((el) => !(el as HTMLButtonElement).disabled)
    const next =
      (stop && enabled.includes(stop) ? stop : undefined) ??
      enabled.find((el) => el.getAttribute("aria-pressed") === "true") ??
      enabled[0]
    for (const el of items) el.tabIndex = el === next ? 0 : -1
    stop = next ?? null
  }

  $effect(() => {
    // Re-run when the pressed items or the disabled state change, after the items render.
    void pressed.join("\u0000")
    void disabled
    tick().then(syncTabStop)
  })
</script>

<div
  bind:this={root}
  role="group"
  aria-disabled={disabled || undefined}
  {...rest}
  data-roving-root=""
  onkeydown={(event) => {
    onkeydown?.(event)
    roving.handleKeyDown(event)
  }}
  onfocusin={(event) => {
    onfocusin?.(event)
    stop = event.target as HTMLElement
    syncTabStop()
  }}
  class={cn(TOGGLE_GROUP_CLASSES, orientation === "vertical" && "flex-col", className)}
>
  {@render children?.()}
</div>
