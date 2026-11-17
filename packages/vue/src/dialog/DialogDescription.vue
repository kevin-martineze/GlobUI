<script setup lang="ts">
import { cn } from "@glob-ui/utils"
import { useDialogContext } from "../shared/context"
import { DIALOG_DESCRIPTION_CLASSES } from "@glob-ui/recipes"

defineProps<{ class?: string }>()
const ctx = useDialogContext("DialogDescription")
</script>

<template>
  <p :id="ctx.descriptionId" :class="cn(DIALOG_DESCRIPTION_CLASSES, $props.class)"><slot /></p>
</template>
