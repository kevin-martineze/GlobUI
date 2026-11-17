<script setup lang="ts">
import { cn } from "@glob-ui/utils"
import { DIALOG_HEADER_CLASSES } from "@glob-ui/recipes"

defineProps<{ class?: string }>()
</script>

<template>
  <div :class="cn(DIALOG_HEADER_CLASSES, $props.class)"><slot /></div>
</template>
