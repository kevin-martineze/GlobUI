<script setup lang="ts">
import { cn } from "@glob-ui/utils"
import { useDialogContext } from "../shared/context"

defineProps<{ class?: string }>()
const ctx = useDialogContext("DialogTitle")
</script>

<template>
  <h2 :id="ctx.titleId" :class="cn('text-lg font-semibold leading-none tracking-tight', $props.class)"><slot /></h2>
</template>
