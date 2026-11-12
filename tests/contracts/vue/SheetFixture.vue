<script setup lang="ts">
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose } from "../../../packages/vue/src/sheet"

defineProps<{ title: string; triggerLabel: string }>()
</script>

<template>
  <Sheet>
    <SheetTrigger>{{ triggerLabel }}</SheetTrigger>
    <SheetContent side="right">
      <SheetTitle>{{ title }}</SheetTitle>
      <SheetClose>Close</SheetClose>
    </SheetContent>
  </Sheet>
</template>
