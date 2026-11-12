<script setup lang="ts">
import { useDialogContext } from "../shared/context"

const ctx = useDialogContext("DialogClose")
function onClick(event: MouseEvent) {
  if (!event.defaultPrevented) ctx.setOpen(false)
}
</script>

<template>
  <button type="button" v-bind="$attrs" @click="onClick">
    <slot />
  </button>
</template>

<script lang="ts">
export default { inheritAttrs: false }
</script>
