<script setup lang="ts">
import { cn } from "@glob-ui/utils"

defineProps<{ class?: string }>()
</script>

<template>
  <div :class="cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-auto', $props.class)"><slot /></div>
</template>
