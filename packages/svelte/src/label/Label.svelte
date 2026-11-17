<script lang="ts">
  import type { HTMLLabelAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { labelVariants, LABEL_REQUIRED_CLASSES } from "@glob-ui/recipes"

  type Props = HTMLLabelAttributes & { size?: "sm" | "md" | "lg"; required?: boolean }
  let { class: className, size, required = false, children, ...rest }: Props = $props()
</script>

<label class={cn(labelVariants({ size, className }))} {...rest}>
  {@render children?.()}
  {#if required}<span aria-hidden="true" class={LABEL_REQUIRED_CLASSES}>*</span>{/if}
</label>
