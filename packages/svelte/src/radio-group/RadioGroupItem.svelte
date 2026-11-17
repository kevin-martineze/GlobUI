<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLInputAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import {
    radioVariants,
    CHOICE_CONTROL_CLASSES,
    CHOICE_LABEL_CLASSES,
    CHOICE_LABEL_DISABLED_CLASSES,
    CHOICE_ROW_CLASSES,
    CONTROL_TEXT_SIZE,
    RADIO_DOT_CLASSES,
    RADIO_DOT_SIZE,
    RADIO_INVALID_CLASSES,
  } from "@glob-ui/recipes"
  import { getRadioGroupContext } from "../shared/context"

  type Props = Omit<HTMLInputAttributes, "type" | "size" | "name" | "value" | "checked"> & {
    value: string
    label?: string | Snippet
  }
  let { value, label, id, disabled, class: className, ...rest }: Props = $props()

  const ctx = getRadioGroupContext()
  const autoId = $props.id()
  const inputId = $derived(id ?? autoId)
  const isDisabled = $derived(ctx.disabled || disabled)
</script>

<span class={CHOICE_ROW_CLASSES}>
  <span class={CHOICE_CONTROL_CLASSES}>
    <input
      type="radio"
      id={inputId}
      name={ctx.name}
      {value}
      checked={ctx.value === value}
      onchange={() => ctx.select(value)}
      disabled={isDisabled}
      required={ctx.required || undefined}
      class={cn(
        radioVariants({ size: ctx.size }),
        // aria-invalid is not valid on role radio; the group carries it, items only show it.
        ctx.invalid && RADIO_INVALID_CLASSES,
        className
      )}
      {...rest}
    />
    <span aria-hidden="true" class={cn(RADIO_DOT_CLASSES, RADIO_DOT_SIZE[ctx.size])}></span>
  </span>
  {#if label}
    <label for={inputId} class={cn(CHOICE_LABEL_CLASSES, CONTROL_TEXT_SIZE[ctx.size], isDisabled && CHOICE_LABEL_DISABLED_CLASSES)}>
      {#if typeof label === "function"}{@render label()}{:else}{label}{/if}
    </label>
  {/if}
</span>
