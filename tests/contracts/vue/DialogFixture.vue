<script setup lang="ts">
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "../../../packages/vue/src/dialog"

defineProps<{ title: string; triggerLabel: string }>()
</script>

<template>
  <Dialog>
    <DialogTrigger>{{ triggerLabel }}</DialogTrigger>
    <DialogContent>
      <DialogTitle>{{ title }}</DialogTitle>
      <DialogDescription>Are you sure?</DialogDescription>
      <DialogClose>Cancel</DialogClose>
    </DialogContent>
  </Dialog>
</template>
