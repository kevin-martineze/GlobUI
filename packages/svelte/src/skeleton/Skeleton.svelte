<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { SKELETON_CLASSES } from "@glob-ui/recipes"

  /** Placeholder block. Set its shape with class (for example "h-4 w-32" or "h-10 w-10 rounded-full"). */
  let { class: className, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
</script>

<div aria-hidden="true" class={cn(SKELETON_CLASSES, className)} {...rest}></div>
