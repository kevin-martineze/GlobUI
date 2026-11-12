<script setup lang="ts">
import { cn } from "@glob-ui/utils"

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
    :class="cn('sr-only z-50 rounded-glob-md bg-glob-surface px-3 py-2 text-sm font-medium text-glob-text shadow-glob-md focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring', $props.class)"
    v-bind="$attrs"
    @click="onClick"
  >
    <slot>Skip to content</slot>
  </a>
</template>

<script lang="ts">
export default { inheritAttrs: false }
</script>
