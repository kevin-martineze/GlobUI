<script setup lang="ts">
import { AppShellLayout } from "../../../packages/vue/src/app-shell-layout"
import { LayoutNavTrigger } from "../../../packages/vue/src/layout"

const props = withDefaults(defineProps<{ tall?: boolean }>(), { tall: true })
const rows = Array.from({ length: 60 }, (_, i) => i)
</script>

<template>
  <AppShellLayout>
    <template #header>
      <LayoutNavTrigger />
      <strong>Acme</strong>
    </template>
    <template #sidebar>
      <a href="#orders" aria-current="page">Orders</a>
      <a href="#customers">Customers</a>
    </template>
    <h2>Orders</h2>
    <template v-if="props.tall">
      <p v-for="row in rows" :key="row">Row {{ row }}</p>
    </template>
  </AppShellLayout>
</template>
