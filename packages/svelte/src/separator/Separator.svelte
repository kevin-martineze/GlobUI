<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { SEPARATOR_CLASSES, SEPARATOR_ORIENTATION_CLASSES } from "@glob-ui/recipes"

  type Props = HTMLAttributes<HTMLDivElement> & {
    orientation?: "horizontal" | "vertical"
    /** Visual only: hidden from assistive technology. Set `false` when the line separates content for screen readers. */
    decorative?: boolean
  }
  let { class: className, orientation = "horizontal", decorative = true, ...rest }: Props = $props()
</script>

<div
  role={decorative ? "none" : "separator"}
  aria-orientation={decorative ? undefined : orientation}
  class={cn(SEPARATOR_CLASSES, SEPARATOR_ORIENTATION_CLASSES[orientation], className)}
  {...rest}
></div>
