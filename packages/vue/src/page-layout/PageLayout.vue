<script setup lang="ts">
import { computed, useSlots } from "vue"
import { cn } from "@glob-ui/utils"
import { contentVariants, asideVariants } from "@glob-ui/recipes"

const props = withDefaults(
  defineProps<{
    asideWidth?: "sm" | "md"
    /** The maximum width of the content column. */
    width?: "default" | "wide" | "full"
    class?: string
  }>(),
  { asideWidth: "sm", width: "default", class: undefined }
)
const slots = useSlots()
const hasHeader = computed(() => Boolean(slots.header))
</script>

<template>
  <div
    data-layout="page"
    :class="cn('mx-auto flex w-full min-w-0 flex-col gap-6 px-4 pb-6 md:px-6 md:pb-8 lg:flex-row lg:items-start lg:gap-8', !hasHeader && 'pt-4 md:pt-6', props.class)"
    v-bind="$attrs"
  >
    <div data-slot="content" data-scroll="scroll" :class="contentVariants({ width })">
      <div v-if="hasHeader" data-slot="header" data-scroll="fixed" class="sticky top-0 z-10 bg-glob-surface pb-3 pt-4 md:pt-6">
        <slot name="header" />
      </div>
      <slot />
    </div>
    <aside v-if="slots.aside" data-slot="aside" data-scroll="fixed" :class="cn(asideVariants({ asideWidth }), hasHeader && 'lg:mt-6')">
      <slot name="aside" />
    </aside>
  </div>
</template>

<script lang="ts">
export default { inheritAttrs: false }
</script>
