<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import {
    PHONE_INPUT_DIVIDER_CLASSES,
    PHONE_INPUT_FIELD_CLASSES,
    PHONE_INPUT_FIELD_WRAPPER_CLASSES,
    PHONE_INPUT_TEXT_SIZE,
    phoneInputVariants,
  } from "@glob-ui/recipes"
  import { fieldAttributes, getFieldContext } from "../shared/context"
  import CountrySelect from "./CountrySelect.svelte"

  type Props = Omit<HTMLInputAttributes, "size" | "type"> & {
    size?: "sm" | "md" | "lg"
    /** ISO 3166 code of the selected country. Bind it with `bind:country`, or leave it unset (starts on "US"). */
    country?: string
    onCountryChange?: (iso: string) => void
  }
  let {
    class: className,
    size = "md",
    country = $bindable(undefined),
    onCountryChange,
    value = $bindable(),
    placeholder,
    disabled,
    ...rest
  }: Props = $props()

  let internalCountry = $state("US")
  const selectedIso = $derived(country ?? internalCountry)

  function setCountry(iso: string) {
    internalCountry = iso
    if (country !== undefined) country = iso
    onCountryChange?.(iso)
  }

  const field = getFieldContext()
  // svelte-ignore state_referenced_locally
  if (field && rest.id) field.setControlId(rest.id)
  const fromField = $derived(fieldAttributes(field, rest))
</script>

<div class={cn(phoneInputVariants({ size, className }))}>
  <CountrySelect value={selectedIso} onChange={setCountry} {size} disabled={disabled ?? undefined} />

  <div class={PHONE_INPUT_DIVIDER_CLASSES}></div>

  <div class={PHONE_INPUT_FIELD_WRAPPER_CLASSES}>
    <input
      type="tel"
      bind:value
      {disabled}
      placeholder={placeholder ?? "555 000 0000"}
      class={cn(PHONE_INPUT_FIELD_CLASSES, PHONE_INPUT_TEXT_SIZE[size])}
      {...rest}
      {...fromField}
    />
  </div>
</div>
