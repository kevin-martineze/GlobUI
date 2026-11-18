<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { getPopoverContext } from "../shared/context"

  type Props = HTMLButtonAttributes & {
    /** Renders the trigger through this snippet instead of a button (React's `asChild`). It receives the attributes to apply. */
    child?: Snippet<[Record<string, unknown>]>
  }
  let { child, onclick, onpointerdown, children, ...rest }: Props = $props()
  const ctx = getPopoverContext("PopoverTrigger")

  const attributes = $derived({
    id: ctx.triggerId,
    type: child ? undefined : ("button" as const),
    "aria-haspopup": "dialog" as const,
    "aria-expanded": ctx.open,
    "aria-controls": ctx.contentId,
    ...ctx.panel.triggerAttachment,
    onpointerdown: (e: PointerEvent) => {
      onpointerdown?.(e as never)
      ctx.panel.onTriggerPointerDown()
    },
    onclick: (e: MouseEvent) => {
      onclick?.(e as never)
      if (!e.defaultPrevented) ctx.panel.onTriggerClick()
    },
    ...rest,
  })
</script>

{#if child}
  <!-- The snippet brings its own content, so `children` is not passed: spread on a component it would replace it. -->
  {@render child(attributes)}
{:else}
  <button {...attributes}>{@render children?.()}</button>
{/if}
