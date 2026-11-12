<script setup lang="ts">
import { StackedLayout } from "../../../packages/vue/src/stacked-layout"
import { LayoutNavTrigger } from "../../../packages/vue/src/layout"
</script>

<template>
  <StackedLayout>
    <template #header>
      <LayoutNavTrigger />
      <strong>Acme</strong>
    </template>
    <template #footer><p>Footer</p></template>
    <template #mobileNav><a href="#orders">Orders</a></template>
    <h2>Page</h2>
  </StackedLayout>
</template>
