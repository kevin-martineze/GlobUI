<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { getDialogContext } from "../shared/context"

  type Props = HTMLButtonAttributes & {
    /** Renders the trigger through this snippet instead of a button. It receives the attributes to apply. */
    child?: Snippet<[Record<string, unknown>]>
  }
  let { child, onclick, children, ...rest }: Props = $props()
  const ctx = getDialogContext("DialogTrigger")

  const attributes: HTMLButtonAttributes = $derived({
    type: "button" as const,
    "aria-haspopup": "dialog" as const,
    "aria-expanded": ctx.open,
    "aria-controls": ctx.open ? ctx.contentId : undefined,
    ...rest,
    onclick: (e: MouseEvent) => {
      onclick?.(e as never)
      if (!e.defaultPrevented) ctx.setOpen(true)
    },
  })
</script>

{#if child}
  {@render child({ ...attributes, children })}
{:else}
  <button {...attributes}>{@render children?.()}</button>
{/if}
