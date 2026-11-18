<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { getMenuContext } from "../shared/context"

  type Props = HTMLButtonAttributes & {
    /** Renders the trigger through this snippet instead of a button (React's `asChild`). It receives the attributes to apply. */
    child?: Snippet<[Record<string, unknown>]>
  }
  let { child, onclick, onpointerdown, onkeydown, children, ...rest }: Props = $props()
  const ctx = getMenuContext("DropdownMenuTrigger")

  const attributes = $derived({
    id: ctx.triggerId,
    type: child ? undefined : ("button" as const),
    "aria-haspopup": "menu" as const,
    "aria-expanded": ctx.open,
    "aria-controls": ctx.contentId,
    ...ctx.panel.triggerAttachment,
    onpointerdown: (e: PointerEvent) => {
      onpointerdown?.(e as never)
      ctx.panel.onTriggerPointerDown()
    },
    onclick: (e: MouseEvent) => {
      onclick?.(e as never)
      if (e.defaultPrevented) return
      // detail 0: a click from Enter/Space or assistive tech, not a pointer. Open on the first item.
      if (e.detail === 0 && !ctx.open) ctx.openWith("first")
      else ctx.panel.onTriggerClick()
    },
    onkeydown: (e: KeyboardEvent) => {
      onkeydown?.(e as never)
      if (e.defaultPrevented) return
      // A native button turns Enter/Space into a click (handled above). Space cannot be cancelled from keydown, so
      // only other elements (a `child` snippet) need them here.
      const isButton = e.currentTarget instanceof HTMLButtonElement
      if (e.key === "ArrowDown" || (!isButton && (e.key === "Enter" || e.key === " "))) {
        e.preventDefault()
        ctx.openWith("first")
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        ctx.openWith("last")
      }
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
