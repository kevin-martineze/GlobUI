<script setup lang="ts">
import { computed, provide, ref, useId } from "vue"
import { DIALOG_KEY, type DialogContext } from "../shared/context"

const props = withDefaults(
  defineProps<{
    /** Controlled open state. Use `v-model:open`, or `open` with `on-open-change`. */
    open?: boolean
    /** Initial open state when `open` is not set. */
    defaultOpen?: boolean
    /** Called with the next open state. Same as listening to `update:open`. */
    onOpenChange?: (open: boolean) => void
    closeOnOutsideClick?: boolean
  }>(),
  { open: undefined, defaultOpen: false, onOpenChange: undefined, closeOnOutsideClick: true }
)
const emit = defineEmits<{ "update:open": [open: boolean] }>()

const internal = ref(props.defaultOpen)
const isOpen = computed(() => props.open ?? internal.value)
const baseId = useId()

const ctx: DialogContext = {
  get open() {
    return isOpen.value
  },
  get closeOnOutsideClick() {
    return props.closeOnOutsideClick
  },
  setOpen(next: boolean) {
    if (next === isOpen.value) return
    // Uncontrolled: keep the state here. Controlled: the parent updates `open` from the event.
    if (props.open === undefined) internal.value = next
    emit("update:open", next)
    props.onOpenChange?.(next)
  },
  contentId: `${baseId}-content`,
  titleId: `${baseId}-title`,
  descriptionId: `${baseId}-description`,
}
provide(DIALOG_KEY, ctx)
</script>

<template>
  <slot />
</template>
