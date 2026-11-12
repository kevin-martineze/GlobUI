<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue"
import { useLayoutScroll } from "../../../packages/vue/src/layout"

const scroll = useLayoutScroll()
const text = ref("none")
// Read after mount: the layout's scroll element is bound once the region is in the DOM.
onMounted(async () => {
  await nextTick()
  text.value = scroll.value?.tagName ?? "none"
})
</script>

<template>
  <span data-testid="probe">{{ text }}</span>
</template>
