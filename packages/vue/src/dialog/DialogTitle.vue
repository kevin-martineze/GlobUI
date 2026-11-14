<script setup lang="ts">
import { cn } from "@glob-ui/utils"
import { useDialogContext } from "../shared/context"
import { DIALOG_TITLE_CLASSES } from "@glob-ui/recipes"

defineProps<{ class?: string }>()
const ctx = useDialogContext("DialogTitle")
</script>

<template>
  <h2 :id="ctx.titleId" :class="cn(DIALOG_TITLE_CLASSES, $props.class)"><slot /></h2>
</template>
