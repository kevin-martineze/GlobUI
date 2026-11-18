<script lang="ts">
  import { onMount } from "svelte"
  import { cn } from "@glob-ui/utils"
  import { FALLBACK_LOCALE, formatDateValue, resolveLocale, type DateRange } from "@glob-ui/core"
  import {
    DATE_PICKER_BODY_CLASSES,
    DATE_PICKER_CLASSES,
    DATE_PICKER_CLEAR_CLASSES,
    DATE_PICKER_CLEAR_ICON_CLASSES,
    DATE_PICKER_CONTENT_CLASSES,
    DATE_PICKER_ICON_CLASSES,
    DATE_PICKER_PLACEHOLDER_CLASSES,
    DATE_PICKER_PRESET_CLASSES,
    DATE_PICKER_PRESETS_CLASSES,
    DATE_PICKER_SIZE,
    DATE_PICKER_TRIGGER_CLASSES,
    DATE_PICKER_TRIGGER_CLEARABLE_CLASSES,
    DATE_PICKER_VALUE_CLASSES,
    DATE_PICKER_VARIANT,
  } from "@glob-ui/recipes"
  import { Calendar } from "../calendar"
  import { Popover, PopoverContent, PopoverTrigger } from "../popover"
  import { fieldAttributes, getFieldContext } from "../shared/context"
  import type { DatePickerPreset } from "./types"

  type Base = {
    locale?: string
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    min?: string
    max?: string
    isDateDisabled?: (iso: string) => boolean
    /** Months shown side by side (stacked on small screens). Default 1, or 2 in range mode. */
    numberOfMonths?: 1 | 2
    /** Buttons next to the calendar (above it on small screens). Selecting one closes the picker. */
    presets?: DatePickerPreset[]
    placeholder?: string
    disabled?: boolean
    /** Shows an X that clears the value. Default true. */
    clearable?: boolean
    size?: "sm" | "md" | "lg"
    variant?: "default" | "ghost" | "outline"
    class?: string
    id?: string
    name?: string
    "aria-invalid"?: boolean | "true" | "false"
    "aria-describedby"?: string
    "aria-labelledby"?: string
    "aria-label"?: string
  }
  type Single = {
    mode?: "single"
    /** "YYYY-MM-DD", or null for none. Bind it with `bind:value`, or leave it unset and use `defaultValue`. */
    value?: string | null
    defaultValue?: string | null
    onChange?: (iso: string | null) => void
    allowDeselect?: boolean
  }
  type Range = {
    mode: "range"
    value?: DateRange
    defaultValue?: DateRange
    onChange?: (range: DateRange) => void
    allowDeselect?: never
  }
  type Props = Base & (Single | Range)

  /** A date field. The value is an ISO date ("YYYY-MM-DD") or a range of them, and the calendar opens in a popover. */
  let {
    mode = "single",
    locale: localeProp,
    weekStartsOn,
    min,
    max,
    isDateDisabled,
    numberOfMonths,
    presets,
    placeholder,
    disabled = false,
    clearable = true,
    size = "md",
    variant = "default",
    class: className,
    id,
    name,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
    "aria-labelledby": ariaLabelledBy,
    "aria-label": ariaLabel,
    value = $bindable(undefined),
    defaultValue,
    onChange,
    allowDeselect = false,
  }: Props = $props()

  const isRange = $derived(mode === "range")
  const emit = (next: string | null | DateRange) => (onChange as ((v: string | null | DateRange) => void) | undefined)?.(next)

  // Same text before mount as a server render; the browser locale takes over after.
  let mounted = $state(false)
  onMount(() => {
    mounted = true
  })
  const locale = $derived(localeProp ?? (mounted ? resolveLocale() : FALLBACK_LOCALE))

  const baseId = $props.id()
  const field = getFieldContext()
  // svelte-ignore state_referenced_locally
  if (field && id) field.setControlId(id)
  const fromField = $derived(
    fieldAttributes(field, { id, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedBy, "aria-labelledby": ariaLabelledBy })
  )
  const triggerId = $derived(fromField.id ?? id ?? `${baseId}-trigger`)
  const valueId = `${baseId}-value`
  const invalid = $derived(fromField["aria-invalid"] ?? ariaInvalid)
  let open = $state(false)

  // svelte-ignore state_referenced_locally
  let singleInternal = $state<string | null>(mode === "range" ? null : ((defaultValue as string | null | undefined) ?? null))
  // svelte-ignore state_referenced_locally
  let rangeInternal = $state<DateRange>(mode === "range" ? ((defaultValue as DateRange | undefined) ?? { from: null, to: null }) : { from: null, to: null })
  const single = $derived(!isRange && value !== undefined ? (value as string | null) : singleInternal)
  const range = $derived(isRange && value !== undefined ? (value as DateRange) : rangeInternal)

  function setSingle(next: string | null) {
    if (next === single) return
    if (value === undefined) singleInternal = next
    else value = next
    emit(next)
  }
  function setRange(next: DateRange) {
    if (value === undefined) rangeInternal = next
    else value = next
    emit(next)
  }

  const text = $derived(formatDateValue(isRange ? range : single, isRange, locale))
  const hasValue = $derived(isRange ? range.from !== null : single !== null)
  const months = $derived(numberOfMonths ?? (isRange ? 2 : 1))
  const hiddenValue = $derived(isRange ? (range.from && range.to ? `${range.from}/${range.to}` : "") : (single ?? ""))

  const focusTrigger = () => document.getElementById(triggerId)?.focus()

  /** Closes the calendar and gives focus back to the trigger. */
  function closeAndFocus() {
    open = false
    focusTrigger()
  }

  function applyPreset(preset: DatePickerPreset) {
    if (isRange) setRange(typeof preset.value === "string" ? { from: preset.value, to: preset.value } : preset.value)
    else setSingle(typeof preset.value === "string" ? preset.value : preset.value.from)
    closeAndFocus()
  }

  function clear() {
    if (isRange) setRange({ from: null, to: null })
    else setSingle(null)
    focusTrigger()
  }
</script>

<div class={DATE_PICKER_CLASSES}>
  <!-- One Popover for the trigger and the content: they share its context. -->
  <Popover bind:open placement="bottom-start" offset={6}>
    <PopoverTrigger
      id={triggerId}
      type="button"
      {disabled}
      data-invalid={invalid === true || invalid === "true" ? "true" : undefined}
      aria-describedby={fromField["aria-describedby"] ?? ariaDescribedBy}
      aria-labelledby={[fromField["aria-labelledby"] ?? ariaLabelledBy, valueId].filter(Boolean).join(" ")}
      aria-label={ariaLabel}
      class={cn(
        DATE_PICKER_TRIGGER_CLASSES,
        DATE_PICKER_SIZE[size],
        DATE_PICKER_VARIANT[variant],
        hasValue && clearable && DATE_PICKER_TRIGGER_CLEARABLE_CLASSES,
        className
      )}
    >
      <!-- The name includes the shown value, so it contains the visible text (WCAG 2.5.3). -->
      <span id={valueId} class={cn(DATE_PICKER_VALUE_CLASSES, text === null && DATE_PICKER_PLACEHOLDER_CLASSES)}>
        {text ?? placeholder ?? (isRange ? "Pick a date range" : "Pick a date")}
      </span>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class={DATE_PICKER_ICON_CLASSES}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    </PopoverTrigger>

    {#if clearable && hasValue && !disabled}
      <button type="button" aria-label="Clear date" onclick={clear} class={DATE_PICKER_CLEAR_CLASSES}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class={DATE_PICKER_CLEAR_ICON_CLASSES}>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    {/if}

    <!-- Named explicitly: the Popover's default name points at its own trigger id, which Field may replace. -->
    <PopoverContent class={DATE_PICKER_CONTENT_CLASSES} aria-labelledby={undefined} aria-label={isRange ? "Choose a date range" : "Choose a date"}>
      {#if open}
        <div class={DATE_PICKER_BODY_CLASSES}>
          {#if presets && presets.length > 0}
            <div role="group" aria-label="Presets" class={DATE_PICKER_PRESETS_CLASSES}>
              {#each presets as preset (preset.label)}
                <button type="button" onclick={() => applyPreset(preset)} class={DATE_PICKER_PRESET_CLASSES}>{preset.label}</button>
              {/each}
            </div>
          {/if}
          {#if isRange}
            <Calendar
              mode="range"
              value={range}
              onChange={(next) => {
                setRange(next)
                // The range is complete once `to` is set.
                if (next.to) closeAndFocus()
              }}
              locale={localeProp}
              {weekStartsOn}
              {min}
              {max}
              {isDateDisabled}
              numberOfMonths={months}
            />
          {:else}
            <Calendar
              mode="single"
              value={single}
              onChange={(next) => setSingle(next)}
              onSelectDay={() => closeAndFocus()}
              {allowDeselect}
              locale={localeProp}
              {weekStartsOn}
              {min}
              {max}
              {isDateDisabled}
              numberOfMonths={months}
            />
          {/if}
        </div>
      {/if}
    </PopoverContent>
  </Popover>

  {#if name !== undefined}<input type="hidden" {name} value={hiddenValue} />{/if}
</div>
