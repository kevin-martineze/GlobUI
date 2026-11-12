<script setup lang="ts">
import { computed, useAttrs } from "vue"
import { cn } from "@glob-ui/utils"
import { dialogVariants } from "@glob-ui/recipes"
import DialogContentBase from "./DialogContentBase.vue"
import DialogCloseIcon from "./DialogCloseIcon.vue"

const props = withDefaults(
  defineProps<{ size?: "sm" | "md" | "lg"; showCloseButton?: boolean; class?: string }>(),
  { size: "md", showCloseButton: true, class: undefined }
)
const attrs = useAttrs()
// The class goes through cn() (with the variants); the other attributes pass to the <dialog>.
const rest = computed(() => {
  const { class: _class, ...others } = attrs
  return others
})
const classes = computed(() => cn(dialogVariants({ size: props.size, className: props.class })))
</script>

<template>
  <DialogContentBase :class="classes" v-bind="rest">
    <div class="relative flex max-h-[calc(100dvh-2rem)] flex-col gap-4 overflow-y-auto p-6">
      <slot />
      <DialogCloseIcon v-if="showCloseButton" />
    </div>
  </DialogContentBase>
</template>

<script lang="ts">
export default { inheritAttrs: false }
</script>
