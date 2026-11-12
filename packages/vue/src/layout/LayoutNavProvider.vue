<script setup lang="ts">
import { provide, ref, useId } from "vue"
import { LAYOUT_NAV_KEY, type LayoutNavContext } from "../shared/context"

const open = ref(false)
const panelId = useId()
const ctx: LayoutNavContext = {
  get open() {
    return open.value
  },
  setOpen(next: boolean) {
    open.value = next
  },
  panelId,
}
provide(LAYOUT_NAV_KEY, ctx)
</script>

<template>
  <slot />
</template>
