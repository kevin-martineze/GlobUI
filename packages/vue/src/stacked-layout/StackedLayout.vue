<script setup lang="ts">
import { useId } from "vue"
import { cn } from "@glob-ui/utils"
import LayoutSlot from "../layout/LayoutSlot.vue"
import LayoutNavProvider from "../layout/LayoutNavProvider.vue"
import LayoutMobileNav from "../layout/LayoutMobileNav.vue"
import SkipLink from "../layout/SkipLink.vue"

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
      :class="cn('flex min-h-screen flex-col pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] text-glob-text', props.class)"
      v-bind="$attrs"
    >
      <SkipLink :target-id="mainId" />
      <LayoutSlot
        v-if="slots.header"
        name="header"
        scroll="fixed"
        as="header"
        class="sticky top-0 z-40 flex items-center gap-2 border-b border-glob-border bg-glob-surface px-4 pt-[env(safe-area-inset-top)] md:px-6"
      >
        <slot name="header" />
      </LayoutSlot>
      <main :id="mainId" tabindex="-1" data-slot="main" data-scroll="scroll" class="flex-1 focus:outline-none">
        <slot />
      </main>
      <LayoutSlot v-if="slots.footer" name="footer" scroll="fixed" as="footer" class="border-t border-glob-border p-4 md:px-6">
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
