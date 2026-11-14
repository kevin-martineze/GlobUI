<script setup lang="ts">
import { useLayoutNav } from "../shared/context"
import { LAYOUT_NAV_TRIGGER_CLASSES } from "@glob-ui/recipes"

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
    :class="LAYOUT_NAV_TRIGGER_CLASSES"
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
