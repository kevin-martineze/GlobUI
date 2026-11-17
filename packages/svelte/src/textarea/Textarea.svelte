<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { textareaVariants } from "@glob-ui/recipes"
  import { fieldAttributes, getFieldContext } from "../shared/context"

  type Props = HTMLTextareaAttributes & { size?: "sm" | "md" | "lg"; resize?: "none" | "vertical" | "both" }
  let { class: className, size, resize, value = $bindable(), ...rest }: Props = $props()

  const field = getFieldContext()
  // svelte-ignore state_referenced_locally
  if (field && rest.id) field.setControlId(rest.id)
  const fromField = $derived(fieldAttributes(field, rest))
</script>

<textarea class={cn(textareaVariants({ size, resize, className }))} bind:value {...rest} {...fromField}></textarea>
