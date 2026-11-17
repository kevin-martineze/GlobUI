<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLInputAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import {
    checkboxVariants,
    CHECKBOX_CHECK_ICON_CLASSES,
    CHECKBOX_DASH_ICON_CLASSES,
    CHOICE_CONTROL_CLASSES,
    CHOICE_LABEL_CLASSES,
    CHOICE_LABEL_DISABLED_CLASSES,
    CHOICE_ROW_CLASSES,
    CONTROL_TEXT_SIZE,
  } from "@glob-ui/recipes"
  import { fieldAttributes, getFieldContext, type ChoiceSize } from "../shared/context"

  type Props = Omit<HTMLInputAttributes, "type" | "size"> & {
    size?: ChoiceSize
    /** Shows a dash instead of a check. Not a checked state; the browser clears it on click. Bindable. */
    indeterminate?: boolean
    label?: string | Snippet
  }
  let {
    class: className,
    size,
    checked = $bindable(),
    indeterminate = $bindable(false),
    label,
    id,
    disabled,
    ...rest
  }: Props = $props()

  const autoId = $props.id()
  const field = getFieldContext()
  // svelte-ignore state_referenced_locally
  if (field && id) field.setControlId(id)
  const fromField = $derived(fieldAttributes(field, { ...rest, id }))
  const inputId = $derived(fromField.id ?? id ?? autoId)
  const labelId = $derived(`${inputId}-label`)
  // aria-labelledby (for example from Field) replaces the native <label for> name. Append our own label so the
  // name stays "Field label + checkbox label", like several <label for> would.
  const labelledByProp = $derived(fromField["aria-labelledby"] ?? rest["aria-labelledby"])
  const labelledBy = $derived(labelledByProp && label ? `${labelledByProp} ${labelId}` : labelledByProp)
  const s = $derived(size ?? "md")
</script>

{#snippet control()}
  <span class={CHOICE_CONTROL_CLASSES}>
    <input
      type="checkbox"
      {...rest}
      {...fromField}
      id={inputId}
      {disabled}
      aria-labelledby={labelledBy}
      class={cn(checkboxVariants({ size, className }))}
      bind:checked
      bind:indeterminate
    />
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={CHECKBOX_CHECK_ICON_CLASSES}
    >
      <path d="M5 12l5 5 9-10" />
    </svg>
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      class={CHECKBOX_DASH_ICON_CLASSES}
    >
      <path d="M6 12h12" />
    </svg>
  </span>
{/snippet}

{#if label}
  <span class={CHOICE_ROW_CLASSES}>
    {@render control()}
    <label id={labelId} for={inputId} class={cn(CHOICE_LABEL_CLASSES, CONTROL_TEXT_SIZE[s], disabled && CHOICE_LABEL_DISABLED_CLASSES)}>
      {#if typeof label === "function"}{@render label()}{:else}{label}{/if}
    </label>
  </span>
{:else}
  {@render control()}
{/if}
