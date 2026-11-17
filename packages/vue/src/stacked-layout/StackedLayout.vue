<script setup lang="ts">
import { useId } from "vue"
import { cn } from "@glob-ui/utils"
import LayoutSlot from "../layout/LayoutSlot.vue"
import LayoutNavProvider from "../layout/LayoutNavProvider.vue"
import LayoutMobileNav from "../layout/LayoutMobileNav.vue"
import SkipLink from "../layout/SkipLink.vue"
import { STACKED_CLASSES, STACKED_FOOTER_CLASSES, STACKED_HEADER_CLASSES, STACKED_MAIN_CLASSES } from "@glob-ui/recipes"

const props = withDefaults(
  defineProps<{
    /** The accessible name of the mobile navigation dialog. */
    navLabel?: string
    class?: string
  }>(),
  { navLabel: "Navigation", class: undefined }
)
const slots = defineSlots<{
  /** The top navigation. It stays visible while the document scrolls. */
  header?(): unknown
  /** The page. It is in document flow, so the document scrolls. It has no padding: put a `PageLayout` in it. */
  default?(): unknown
  footer?(): unknown
  /** The navigation for small screens. When set, `LayoutNavTrigger` in the header opens it in a Sheet. */
  mobileNav?(): unknown
}>()
const mainId = useId()
</script>

<template>
  <LayoutNavProvider>
    <div
      data-layout="stacked"
      data-scroll-mode="document"
      :class="cn(STACKED_CLASSES, props.class)"
      v-bind="$attrs"
    >
      <SkipLink :target-id="mainId" />
      <LayoutSlot
        v-if="slots.header"
        name="header"
        scroll="fixed"
        as="header"
        :class="STACKED_HEADER_CLASSES"
      >
        <slot name="header" />
      </LayoutSlot>
      <main :id="mainId" tabindex="-1" data-slot="main" data-scroll="scroll" :class="STACKED_MAIN_CLASSES">
        <slot />
      </main>
      <LayoutSlot v-if="slots.footer" name="footer" scroll="fixed" as="footer" :class="STACKED_FOOTER_CLASSES">
        <slot name="footer" />
      </LayoutSlot>
      <LayoutMobileNav v-if="slots.mobileNav" :label="navLabel">
        <slot name="mobileNav" />
      </LayoutMobileNav>
    </div>
  </LayoutNavProvider>
</template>

<script lang="ts">
export default { inheritAttrs: false }
</script>
