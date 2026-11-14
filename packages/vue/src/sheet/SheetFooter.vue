<script setup lang="ts">
import { cn } from "@glob-ui/utils"
import { DIALOG_FOOTER_CLASSES, SHEET_FOOTER_CLASSES } from "@glob-ui/recipes"

defineProps<{ class?: string }>()
</script>

<template>
  <div :class="cn(DIALOG_FOOTER_CLASSES, SHEET_FOOTER_CLASSES, $props.class)"><slot /></div>
</template>
