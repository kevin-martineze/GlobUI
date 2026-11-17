<script setup lang="ts">
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "../../../packages/vue/src/dialog"

defineProps<{ title: string; triggerLabel: string; titleClass?: string; contentClass?: string }>()
</script>

<template>
  <Dialog>
    <DialogTrigger>{{ triggerLabel }}</DialogTrigger>
    <DialogContent :class="contentClass">
      <DialogTitle :class="titleClass">{{ title }}</DialogTitle>
      <DialogDescription>Are you sure?</DialogDescription>
      <DialogClose>Cancel</DialogClose>
    </DialogContent>
  </Dialog>
</template>
