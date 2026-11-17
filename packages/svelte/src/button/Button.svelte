<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { buttonVariants } from "@glob-ui/recipes"
  import Spinner from "../spinner/Spinner.svelte"

  type Props = HTMLButtonAttributes & {
    variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "link"
    size?: "sm" | "md" | "lg" | "icon"
    /** Shows a spinner over the content, disables the button and sets aria-busy. Width stays the same. */
    loading?: boolean
    /**
     * Renders through this snippet instead of a button (React's `asChild`), for example a link. It receives the
     * attributes to apply, the class included. Only aria-busy and aria-disabled carry the loading state.
     */
    child?: Snippet<[Record<string, unknown>]>
  }
  let { class: className, variant, size, loading = false, disabled, child, children, ...rest }: Props = $props()
</script>

{#if child}
  {@render child({
    ...rest,
    class: cn(buttonVariants({ variant, size, className })),
    "aria-disabled": disabled || loading || undefined,
    "aria-busy": loading || undefined,
  })}
{:else}
  <button
    class={cn(buttonVariants({ variant, size, className }), loading && "relative")}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    {...rest}
  >
    {#if loading}
      <!-- opacity-0 (not invisible) keeps the width and keeps the label in the accessible name. -->
      <span class="inline-flex items-center gap-2 opacity-0">{@render children?.()}</span>
      <span class="absolute inset-0 flex items-center justify-center">
        <Spinner size={size === "lg" ? "md" : "sm"} />
      </span>
    {:else}
      {@render children?.()}
    {/if}
  </button>
{/if}
