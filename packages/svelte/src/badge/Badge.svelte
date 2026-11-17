<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { badgeVariants, BADGE_DOT_CLASSES } from "@glob-ui/recipes"

  type Props = HTMLAttributes<HTMLSpanElement> & {
    variant?: "default" | "primary" | "secondary" | "outline" | "success" | "warning" | "danger" | "info"
    size?: "sm" | "md"
    /** Small dot before the text, in the badge's text color. */
    dot?: boolean
  }
  let { class: className, variant, size, dot = false, children, ...rest }: Props = $props()
</script>

<span class={cn(badgeVariants({ variant, size, className }))} {...rest}>
  {#if dot}<span aria-hidden="true" class={BADGE_DOT_CLASSES}></span>{/if}
  {@render children?.()}
</span>
