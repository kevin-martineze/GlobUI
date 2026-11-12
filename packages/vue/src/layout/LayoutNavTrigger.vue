<script setup lang="ts">
import { useLayoutNav } from "../shared/context"

const nav = useLayoutNav("LayoutNavTrigger")

function onClick(event: MouseEvent) {
  if (!event.defaultPrevented) nav.setOpen(true)
}
</script>

<template>
  <button
    type="button"
    aria-label="Open navigation"
    :aria-expanded="nav.open"
    :aria-controls="nav.panelId"
    class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-glob-md text-glob-text transition-colors hover:bg-glob-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring lg:hidden"
    v-bind="$attrs"
    @click="onClick"
  >
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
</template>

<script lang="ts">
export default { inheritAttrs: false }
</script>
