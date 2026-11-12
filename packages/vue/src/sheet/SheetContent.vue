<script setup lang="ts">
import { computed, useAttrs } from "vue"
import { cn } from "@glob-ui/utils"
import { sheetVariants } from "@glob-ui/recipes"
import DialogContentBase from "../dialog/DialogContentBase.vue"
import DialogCloseIcon from "../dialog/DialogCloseIcon.vue"

const props = withDefaults(
  defineProps<{
    side?: "left" | "right" | "top" | "bottom"
    size?: "sm" | "md" | "lg"
    showCloseButton?: boolean
    class?: string
  }>(),
  { side: "right", size: "md", showCloseButton: true, class: undefined }
)
const attrs = useAttrs()
const rest = computed(() => {
  const { class: _class, ...others } = attrs
  return others
})
const classes = computed(() => cn(sheetVariants({ side: props.side, size: props.size, className: props.class })))
</script>

<template>
  <DialogContentBase :class="classes" v-bind="rest">
    <div class="relative flex h-full flex-col gap-4 overflow-y-auto p-6">
      <slot />
      <DialogCloseIcon v-if="showCloseButton" />
    </div>
  </DialogContentBase>
</template>

<script lang="ts">
export default { inheritAttrs: false }
</script>
