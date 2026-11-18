<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { COMMAND_ITEM_CLASSES, LISTBOX_OPTION_ACTIVE_CLASSES, LISTBOX_OPTION_DISABLED_CLASSES } from "@glob-ui/recipes"
  import { getCommandContext, getCommandGroupId } from "../shared/context"

  type Props = Omit<HTMLAttributes<HTMLDivElement>, "onselect"> & {
    /** The text that is matched against the search. Also the value passed to onSelect. */
    value: string
    /** More text the search matches (synonyms, tags). */
    keywords?: string[]
    disabled?: boolean
    onSelect?: (value: string) => void
  }
  let {
    value,
    keywords = [],
    disabled = false,
    onSelect,
    class: className,
    onclick,
    onpointermove,
    onmousedown,
    children,
    ...rest
  }: Props = $props()

  const ctx = getCommandContext("CommandItem")
  const groupId = getCommandGroupId()
  const id = $props.id()
  let element = $state<HTMLDivElement | null>(null)

  function select() {
    onSelect?.(value)
    ctx.itemSelect()
  }

  // Registration runs even while the item is hidden (it renders nothing), so the root can still see it.
  $effect(() =>
    ctx.register({
      id,
      value,
      keywords: [...keywords],
      disabled,
      groupId,
      getElement: () => element,
      select,
    })
  )

  const visible = $derived(ctx.isVisible(value, keywords))
  const isActive = $derived(ctx.activeKey === id)
</script>

{#if visible}
  <!-- Keyboard handling lives on the search field (aria-activedescendant). -->
  <div
    bind:this={element}
    id={ctx.optionId(id)}
    role="option"
    aria-selected={isActive}
    aria-disabled={disabled || undefined}
    data-command-item=""
    onmousedown={(e) => {
      onmousedown?.(e)
      // Keep focus in the search field while the pointer is on an item.
      e.preventDefault()
    }}
    onpointermove={(e) => {
      onpointermove?.(e)
      if (!disabled) ctx.setActiveKey(id)
    }}
    onclick={(e) => {
      onclick?.(e)
      if (!disabled && !e.defaultPrevented) select()
    }}
    class={cn(COMMAND_ITEM_CLASSES, isActive && !disabled && LISTBOX_OPTION_ACTIVE_CLASSES, disabled && LISTBOX_OPTION_DISABLED_CLASSES, className)}
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}
