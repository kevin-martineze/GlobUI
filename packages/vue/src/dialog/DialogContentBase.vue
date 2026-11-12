<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watchEffect } from "vue"
import { createModal, type ModalController } from "@glob-ui/core"
import { useDialogContext } from "../shared/context"

const ctx = useDialogContext("DialogContent")
const dialogEl = ref<HTMLDialogElement | null>(null)
let modal: ModalController | null = null

// Options read from the context. The watcher updates the controller; creating it happens once, on mount.
const options = () => ({
  open: ctx.open,
  onOpenChange: (next: boolean) => ctx.setOpen(next),
  closeOnOutsideClick: ctx.closeOnOutsideClick,
  labelledBy: ctx.titleId,
  describedBy: ctx.descriptionId,
})

onMounted(() => {
  if (dialogEl.value) modal = createModal(dialogEl.value, options())
})
// Evaluate the options first: reading them is what subscribes this effect to the open state, even before
// the controller exists.
watchEffect(() => {
  const next = options()
  modal?.update(next)
})
onBeforeUnmount(() => {
  modal?.destroy()
  modal = null
})
</script>

<template>
  <dialog :id="ctx.contentId" ref="dialogEl" v-bind="$attrs">
    <slot />
  </dialog>
</template>

<script lang="ts">
export default { inheritAttrs: false }
</script>
