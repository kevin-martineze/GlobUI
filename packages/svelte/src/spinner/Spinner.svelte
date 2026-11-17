<script lang="ts">
  import type { SVGAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { spinnerVariants } from "@glob-ui/recipes"

  let {
    class: className,
    size,
    "aria-label": ariaLabel = "Loading",
    ...rest
  }: SVGAttributes<SVGSVGElement> & { size?: "sm" | "md" | "lg" } = $props()
</script>

<svg role="status" aria-label={ariaLabel} viewBox="0 0 24 24" fill="none" class={cn(spinnerVariants({ size, className }))} {...rest}>
  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25" />
  <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
</svg>
