<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { COMMAND_INPUT_CLASSES, COMMAND_INPUT_WRAPPER_CLASSES, COMMAND_SEARCH_ICON_CLASSES } from "@glob-ui/recipes"
  import { getCommandContext } from "../shared/context"

  /** The search field. It drives the list with the arrows, Home, End and Enter. */
  let { class: className, oninput, onkeydown, ...rest }: Omit<HTMLInputAttributes, "value"> = $props()
  const ctx = getCommandContext("CommandInput")
</script>

<div class={COMMAND_INPUT_WRAPPER_CLASSES}>
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class={COMMAND_SEARCH_ICON_CLASSES}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-4-4" />
  </svg>
  <input
    id={ctx.inputId}
    type="text"
    role="combobox"
    autocomplete="off"
    spellcheck={false}
    aria-label={ctx.label}
    aria-autocomplete="list"
    aria-expanded="true"
    aria-controls={ctx.listId}
    aria-activedescendant={ctx.activeDescendant}
    {...rest}
    value={ctx.search}
    oninput={(e) => {
      oninput?.(e)
      ctx.setSearch(e.currentTarget.value)
    }}
    onkeydown={(e) => {
      onkeydown?.(e)
      if (!e.defaultPrevented) ctx.onInputKeyDown(e)
    }}
    class={cn(COMMAND_INPUT_CLASSES, className)}
  />
</div>
