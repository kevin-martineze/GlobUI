<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { getDialogContext } from "../shared/context"

  type Props = HTMLButtonAttributes & { child?: Snippet<[Record<string, unknown>]> }
  let { child, onclick, children, ...rest }: Props = $props()
  const ctx = getDialogContext("DialogClose")

  const attributes: HTMLButtonAttributes = $derived({
    type: "button" as const,
    ...rest,
    onclick: (e: MouseEvent) => {
      onclick?.(e as never)
      if (!e.defaultPrevented) ctx.setOpen(false)
    },
  })
</script>

{#if child}
  {@render child({ ...attributes, children })}
{:else}
  <button {...attributes}>{@render children?.()}</button>
{/if}
