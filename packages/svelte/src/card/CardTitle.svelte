<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { CARD_TITLE_CLASSES } from "@glob-ui/recipes"

  type Props = HTMLAttributes<HTMLHeadingElement> & {
    /** Heading level. Defaults to h3; pick the one that fits the page outline. */
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  }
  let { as = "h3", class: className, children, ...rest }: Props = $props()
</script>

<svelte:element this={as} class={cn(CARD_TITLE_CLASSES, className)} {...rest}>{@render children?.()}</svelte:element>
