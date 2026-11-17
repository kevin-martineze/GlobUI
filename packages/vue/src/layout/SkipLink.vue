<script setup lang="ts">
import { cn } from "@glob-ui/utils"
import { SKIP_LINK_CLASSES } from "@glob-ui/recipes"

const props = withDefaults(defineProps<{ targetId: string; class?: string }>(), { class: undefined })

function onClick(event: MouseEvent) {
  if (event.defaultPrevented) return
  event.preventDefault()
  document.getElementById(props.targetId)?.focus()
}
</script>

<template>
  <a
    :href="`#${targetId}`"
    :class="cn(SKIP_LINK_CLASSES, $props.class)"
    v-bind="$attrs"
    @click="onClick"
  >
    <slot>Skip to content</slot>
  </a>
</template>

<script lang="ts">
export default { inheritAttrs: false }
</script>
