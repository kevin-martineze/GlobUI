<script setup lang="ts">
import { cn } from "@glob-ui/utils"
import { PAGE_HEADER_ACTIONS_CLASSES, PAGE_HEADER_CLASSES, PAGE_HEADER_ROW_CLASSES, PAGE_HEADER_SECONDARY_TEXT_CLASSES, PAGE_HEADER_TITLE_BLOCK_CLASSES, PAGE_HEADER_TITLE_CLASSES } from "@glob-ui/recipes"

defineProps<{
  /** The title text. Use the `title` slot for rich content. */
  title?: string
  description?: string
  class?: string
}>()
</script>

<template>
  <div data-slot="page-header" :class="cn(PAGE_HEADER_CLASSES, $props.class)" v-bind="$attrs">
    <div v-if="$slots.breadcrumbs" :class="PAGE_HEADER_SECONDARY_TEXT_CLASSES"><slot name="breadcrumbs" /></div>
    <div :class="PAGE_HEADER_ROW_CLASSES">
      <div :class="PAGE_HEADER_TITLE_BLOCK_CLASSES">
        <h1 :class="PAGE_HEADER_TITLE_CLASSES"><slot name="title">{{ title }}</slot></h1>
        <p v-if="description || $slots.description" :class="PAGE_HEADER_SECONDARY_TEXT_CLASSES"><slot name="description">{{ description }}</slot></p>
      </div>
      <div v-if="$slots.actions" :class="PAGE_HEADER_ACTIONS_CLASSES"><slot name="actions" /></div>
    </div>
  </div>
</template>

<script lang="ts">
export default { inheritAttrs: false }
</script>
