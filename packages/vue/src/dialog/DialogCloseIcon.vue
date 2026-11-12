<script setup lang="ts">
import { cn } from "@glob-ui/utils"
import { useDialogContext } from "../shared/context"

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
    :class="cn('absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-glob-sm text-glob-text-secondary transition-colors hover:bg-glob-surface-hover hover:text-glob-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring', $props.class)"
    @click="onClick"
  >
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  </button>
</template>
