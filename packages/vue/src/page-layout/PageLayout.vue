<script setup lang="ts">
import { computed, useSlots } from "vue"
import { cn } from "@glob-ui/utils"
import { contentVariants, asideVariants } from "@glob-ui/recipes"
import { PAGE_ASIDE_HEADER_OFFSET_CLASSES, PAGE_HEADER_CONTENT_CLASSES, PAGE_LAYOUT_CLASSES, PAGE_LAYOUT_PADDED_CLASSES } from "@glob-ui/recipes"

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
    :class="cn(PAGE_LAYOUT_CLASSES, !hasHeader && PAGE_LAYOUT_PADDED_CLASSES, props.class)"
    v-bind="$attrs"
  >
    <div data-slot="content" data-scroll="scroll" :class="contentVariants({ width })">
      <div v-if="hasHeader" data-slot="header" data-scroll="fixed" :class="PAGE_HEADER_CONTENT_CLASSES">
        <slot name="header" />
      </div>
      <slot />
    </div>
    <aside v-if="slots.aside" data-slot="aside" data-scroll="fixed" :class="cn(asideVariants({ asideWidth }), hasHeader && PAGE_ASIDE_HEADER_OFFSET_CLASSES)">
      <slot name="aside" />
    </aside>
  </div>
</template>

<script lang="ts">
export default { inheritAttrs: false }
</script>
