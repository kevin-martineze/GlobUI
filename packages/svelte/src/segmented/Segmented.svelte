<script lang="ts">
  import { onDestroy } from "svelte"
  import { cn } from "@glob-ui/utils"
  import { createRovingFocus } from "@glob-ui/core"
  import {
    SEGMENTED_CLASSES,
    SEGMENTED_DISABLED_CLASSES,
    SEGMENTED_ITEM_CHECKED_CLASSES,
    SEGMENTED_ITEM_CLASSES,
    SEGMENTED_ITEM_SIZE,
    SEGMENTED_ITEM_UNCHECKED_CLASSES,
  } from "@glob-ui/recipes"
  import { fieldAttributes, getFieldContext } from "../shared/context"
  import type { SegmentedOption } from "./types"


  type Props = {
    options: SegmentedOption[]
    /** The checked value. Bind it with `bind:value`, or leave it unset and use `defaultValue`. */
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    size?: "sm" | "md" | "lg"
    disabled?: boolean
    /** Submitted with native forms through a hidden input. */
    name?: string
    class?: string
    id?: string
    "aria-invalid"?: boolean | "true" | "false"
    "aria-describedby"?: string
    "aria-labelledby"?: string
    "aria-label"?: string
  }
  /** Radio group (APG). Arrows move and select; Tab enters the group on the selected option. */
  let {
    options,
    value = $bindable(undefined),
    defaultValue = "",
    onChange,
    size = "md",
    disabled,
    name,
    class: className,
    ...aria
  }: Props = $props()

  // Only the initial defaultValue is wanted.
  // svelte-ignore state_referenced_locally
  let internal = $state(defaultValue)
  const current = $derived(value ?? internal)

  function set(next: string) {
    if (value === undefined) internal = next
    else value = next
    onChange?.(next)
  }

  const field = getFieldContext()
  // svelte-ignore state_referenced_locally
  if (field && aria.id) field.setControlId(aria.id)
  const attributes = $derived({ ...aria, ...fieldAttributes(field, aria) })

  const roving = createRovingFocus({
    orientation: "both",
    loop: true,
    itemSelector: "[data-roving-item]:not(:disabled)",
    onNavigate: (item) => {
      const next = item.dataset.value
      if (next !== undefined && next !== current) set(next)
    },
  })
  onDestroy(() => roving.destroy())

  // The checked option is the single tab stop; with none checked, the first enabled one.
  const tabStop = $derived(
    options.find((o) => o.value === current && !o.disabled)?.value ?? options.find((o) => !o.disabled)?.value
  )
</script>

<!-- The radios take focus (one tab stop, arrows move between them); the group itself is not focusable. -->
<!-- svelte-ignore a11y_interactive_supports_focus -->
<div
  id={attributes.id}
  role="radiogroup"
  aria-label={attributes["aria-label"]}
  aria-labelledby={attributes["aria-labelledby"]}
  aria-describedby={attributes["aria-describedby"]}
  aria-invalid={attributes["aria-invalid"]}
  aria-disabled={disabled || undefined}
  data-roving-root=""
  onkeydown={(event) => roving.handleKeyDown(event)}
  class={cn(SEGMENTED_CLASSES, disabled && SEGMENTED_DISABLED_CLASSES, className)}
>
  {#if name !== undefined}<input type="hidden" {name} value={current} />{/if}
  {#each options as option (option.value)}
    {@const checked = option.value === current}
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      data-roving-item=""
      data-value={option.value}
      tabindex={option.value === tabStop ? 0 : -1}
      disabled={disabled || option.disabled}
      onclick={() => {
        if (!checked) set(option.value)
      }}
      class={cn(
        SEGMENTED_ITEM_CLASSES,
        SEGMENTED_ITEM_SIZE[size],
        checked ? SEGMENTED_ITEM_CHECKED_CLASSES : SEGMENTED_ITEM_UNCHECKED_CLASSES
      )}
    >
      {option.label}
    </button>
  {/each}
</div>
