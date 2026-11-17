<script lang="ts">
  import { setContext, type Snippet } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { CONTROL_TEXT_SIZE, FIELD_CLASSES, FIELD_DESCRIPTION_CLASSES, FIELD_ERROR_CLASSES } from "@glob-ui/recipes"
  import Label from "../label/Label.svelte"
  import { FIELD_KEY, type FieldContext } from "../shared/context"

  type Size = "sm" | "md" | "lg"
  type Props = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
    label?: string | Snippet
    description?: string | Snippet
    /** When set, marks the control invalid. The description stays visible. */
    error?: string | Snippet
    /** Shows the asterisk only. Put `required` on the control too, for validation and screen readers. */
    required?: boolean
    size?: Size
    /**
     * One form control. GlobUI controls (Input, Textarea, Checkbox, Switch, RadioGroup, Slider, Segmented) read the
     * Field and take its id, aria-describedby, aria-labelledby and aria-invalid, like React's Field injects them.
     */
    children: Snippet
  }
  let { label, description, error, required = false, size = "md", class: className, children, ...rest }: Props = $props()

  const baseId = $props.id()
  const labelId = `${baseId}-label`
  const descriptionId = `${baseId}-description`
  const errorId = `${baseId}-error`
  let ownControlId = $state<string | undefined>(undefined)
  const controlId = $derived(ownControlId ?? `${baseId}-control`)
  const hasError = $derived(Boolean(error))

  setContext<FieldContext>(FIELD_KEY, {
    get controlId() {
      return controlId
    },
    setControlId(id: string) {
      ownControlId = id
    },
    get labelId() {
      return label ? labelId : undefined
    },
    get descriptionId() {
      return description ? descriptionId : undefined
    },
    get errorId() {
      return hasError ? errorId : undefined
    },
    get invalid() {
      return hasError
    },
  })
</script>

{#snippet text(value: string | Snippet)}
  {#if typeof value === "function"}{@render value()}{:else}{value}{/if}
{/snippet}

<div class={cn(FIELD_CLASSES, className)} {...rest}>
  {#if label}
    <Label id={labelId} for={controlId} {size} {required}>{@render text(label)}</Label>
  {/if}
  {@render children()}
  {#if description}
    <p id={descriptionId} class={cn(FIELD_DESCRIPTION_CLASSES, CONTROL_TEXT_SIZE[size])}>{@render text(description)}</p>
  {/if}
  {#if error}
    <p id={errorId} class={cn(FIELD_ERROR_CLASSES, CONTROL_TEXT_SIZE[size])}>{@render text(error)}</p>
  {/if}
</div>
