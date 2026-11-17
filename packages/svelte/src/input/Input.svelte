<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { inputVariants } from "@glob-ui/recipes"
  import { fieldAttributes, getFieldContext } from "../shared/context"

  type Props = Omit<HTMLInputAttributes, "size"> & { size?: "sm" | "md" | "lg" }
  let { class: className, size, value = $bindable(), ...rest }: Props = $props()

  const field = getFieldContext()
  // svelte-ignore state_referenced_locally
  if (field && rest.id) field.setControlId(rest.id)
  const fromField = $derived(fieldAttributes(field, rest))
</script>

<input class={cn(inputVariants({ size, className }))} bind:value {...rest} {...fromField} />
