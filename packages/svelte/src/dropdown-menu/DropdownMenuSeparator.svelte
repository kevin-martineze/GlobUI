<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { MENU_SEPARATOR_CLASSES } from "@glob-ui/recipes"
  let { class: className, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
</script>

<div role="separator" class={cn(MENU_SEPARATOR_CLASSES, className)} {...rest}></div>
