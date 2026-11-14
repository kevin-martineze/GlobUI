<script setup lang="ts">
import { cn } from "@glob-ui/utils"
import { useDialogContext } from "../shared/context"
import { DIALOG_CLOSE_ICON_CLASSES } from "@glob-ui/recipes"

defineProps<{ class?: string }>()
const ctx = useDialogContext("DialogCloseIcon")
function onClick(event: MouseEvent) {
  if (!event.defaultPrevented) ctx.setOpen(false)
}
</script>

<template>
  <button
    type="button"
    aria-label="Close"
    :class="cn(DIALOG_CLOSE_ICON_CLASSES, $props.class)"
    @click="onClick"
  >
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  </button>
</template>
