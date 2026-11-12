<script setup lang="ts">
import { useDialogContext } from "../shared/context"

const ctx = useDialogContext("DialogTrigger")
function onClick(event: MouseEvent) {
  if (!event.defaultPrevented) ctx.setOpen(true)
}
</script>

<template>
  <button
    type="button"
    aria-haspopup="dialog"
    :aria-expanded="ctx.open"
    :aria-controls="ctx.open ? ctx.contentId : undefined"
    v-bind="$attrs"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<script lang="ts">
export default { inheritAttrs: false }
</script>
