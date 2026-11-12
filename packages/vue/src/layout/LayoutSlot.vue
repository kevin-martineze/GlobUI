<script setup lang="ts">
import { provide, ref } from "vue"
import { cn } from "@glob-ui/utils"
import { SCROLL_CLASSES } from "@glob-ui/recipes"
import { LAYOUT_SCROLL_KEY } from "../shared/context"

const props = withDefaults(
  defineProps<{
    /** The slot name, rendered as `data-slot`. */
    name: string
    /** `fixed` never scrolls. `scroll` is the one region that scrolls for this part of the screen. */
    scroll: "fixed" | "scroll"
    as?: "div" | "header" | "nav" | "main" | "aside" | "footer" | "section"
    class?: string
  }>(),
  { as: "div", class: undefined }
)

const element = ref<HTMLElement | null>(null)
// Read once: whether this slot provides the scroll context is fixed for its lifetime.
if (props.scroll === "scroll") provide(LAYOUT_SCROLL_KEY, { element })
</script>

<template>
  <component
    :is="as"
    :ref="(el: HTMLElement | null) => (element = el)"
    :data-slot="name"
    :data-scroll="scroll"
    :tabindex="scroll === 'scroll' ? 0 : undefined"
    :class="scroll === 'scroll' ? cn(SCROLL_CLASSES, $props.class) : $props.class"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script lang="ts">
export default { inheritAttrs: false }
</script>
