<script setup lang="ts">
import { PageLayout, PageHeader } from "../../../packages/vue/src/page-layout"
</script>

<template>
  <PageLayout>
    <template #header>
      <PageHeader title="Invoices" description="Last 30 days">
        <template #breadcrumbs><a href="#home">Home</a></template>
        <template #actions><button type="button">New invoice</button></template>
      </PageHeader>
    </template>
    <template #aside><p>Filters</p></template>
    <p>Content</p>
  </PageLayout>
</template>
