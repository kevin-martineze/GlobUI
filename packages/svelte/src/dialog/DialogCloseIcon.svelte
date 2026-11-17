<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { getDialogContext } from "../shared/context"
  import { DIALOG_CLOSE_ICON_CLASSES } from "@glob-ui/recipes"

  let { class: className, onclick, ...rest }: HTMLButtonAttributes = $props()
  const ctx = getDialogContext("DialogCloseIcon")
</script>

<button
  type="button"
  aria-label="Close"
  class={cn(
    DIALOG_CLOSE_ICON_CLASSES,
    className
  )}
  {...rest}
  onclick={(e) => {
    onclick?.(e)
    if (!e.defaultPrevented) ctx.setOpen(false)
  }}
>
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
</button>
