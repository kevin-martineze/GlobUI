<script setup lang="ts">
import { cn } from "@glob-ui/utils"
import { useDialogContext } from "../shared/context"

defineProps<{ class?: string }>()
const ctx = useDialogContext("DialogDescription")
</script>

<template>
  <p :id="ctx.descriptionId" :class="cn('text-sm text-glob-text-secondary', $props.class)"><slot /></p>
</template>
