<script setup lang="ts">
import { cn } from "@glob-ui/utils"

defineProps<{
  /** The title text. Use the `title` slot for rich content. */
  title?: string
  description?: string
  class?: string
}>()
</script>

<template>
  <div data-slot="page-header" :class="cn('flex min-w-0 flex-col gap-2', $props.class)" v-bind="$attrs">
    <div v-if="$slots.breadcrumbs" class="text-sm text-glob-text-secondary"><slot name="breadcrumbs" /></div>
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="flex min-w-0 flex-col gap-1">
        <h1 class="break-words text-2xl font-semibold tracking-tight text-glob-text"><slot name="title">{{ title }}</slot></h1>
        <p v-if="description || $slots.description" class="text-sm text-glob-text-secondary"><slot name="description">{{ description }}</slot></p>
      </div>
      <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2"><slot name="actions" /></div>
    </div>
  </div>
</template>

<script lang="ts">
export default { inheritAttrs: false }
</script>
