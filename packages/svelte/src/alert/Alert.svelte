<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { alertVariants, ALERT_BODY_CLASSES, ALERT_ICON_CLASSES, ALERT_ICON_TONE } from "@glob-ui/recipes"
  import AlertIcon from "./AlertIcon.svelte"

  type Props = HTMLAttributes<HTMLDivElement> & {
    variant?: keyof typeof ALERT_ICON_TONE
    /** Replaces the variant's default icon. Pass `null` to hide it. */
    icon?: Snippet | null
  }
  let { class: className, variant = "default", icon, children, ...rest }: Props = $props()
  // Only urgent variants interrupt screen readers; the rest are polite.
  const role = $derived(variant === "warning" || variant === "danger" ? "alert" : "status")
</script>

<div {role} class={cn(alertVariants({ variant, className }))} {...rest}>
  {#if icon === undefined}
    <AlertIcon {variant} />
  {:else if icon !== null}
    <span aria-hidden="true" class={cn(ALERT_ICON_CLASSES, ALERT_ICON_TONE[variant])}>{@render icon()}</span>
  {/if}
  <div class={ALERT_BODY_CLASSES}>{@render children?.()}</div>
</div>
