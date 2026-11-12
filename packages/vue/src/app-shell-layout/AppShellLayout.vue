<script setup lang="ts">
import { useId } from "vue"
import { cn } from "@glob-ui/utils"
import { sidebarVariants } from "@glob-ui/recipes"
import LayoutSlot from "../layout/LayoutSlot.vue"
import LayoutNavProvider from "../layout/LayoutNavProvider.vue"
import LayoutMobileNav from "../layout/LayoutMobileNav.vue"
import SkipLink from "../layout/SkipLink.vue"

const props = withDefaults(
  defineProps<{
    /** The accessible name of the navigation landmark. */
    sidebarLabel?: string
    sidebarSide?: "left" | "right"
    sidebarWidth?: "sm" | "md" | "lg"
    class?: string
  }>(),
  { sidebarLabel: "Main navigation", sidebarSide: "left", sidebarWidth: "md", class: undefined }
)
const slots = defineSlots<{
  /** The fixed header across the top. Put `LayoutNavTrigger` here for small screens. */
  header?(): unknown
  /** The fixed sidebar navigation. Below `lg` it moves into a Sheet, opened by `LayoutNavTrigger`. */
  sidebar?(): unknown
  /** The main region. It is the one region that scrolls. It has no padding: put a `PageLayout` in it. */
  default?(): unknown
}>()
const mainId = useId()
</script>

<template>
  <LayoutNavProvider>
    <div
      data-layout="app-shell"
      data-scroll-mode="app"
      :class="cn('flex h-screen supports-[height:100dvh]:h-dvh min-h-0 flex-col overflow-hidden pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] text-glob-text', props.class)"
      v-bind="$attrs"
    >
      <SkipLink :target-id="mainId" />
      <LayoutSlot
        v-if="slots.header"
        name="header"
        scroll="fixed"
        as="header"
        class="flex shrink-0 items-center gap-2 border-b border-glob-border bg-glob-surface px-4 pt-[env(safe-area-inset-top)] md:px-6"
      >
        <slot name="header" />
      </LayoutSlot>
      <div class="flex min-h-0 flex-1">
        <LayoutSlot
          v-if="slots.sidebar"
          name="sidebar"
          scroll="fixed"
          as="nav"
          :aria-label="sidebarLabel"
          :class="cn(sidebarVariants({ side: sidebarSide, width: sidebarWidth }), sidebarSide === 'right' && 'order-last')"
        >
          <LayoutSlot name="sidebar-list" scroll="scroll" class="flex min-h-0 flex-1 flex-col gap-1 p-3">
            <slot name="sidebar" />
          </LayoutSlot>
        </LayoutSlot>
        <LayoutSlot
          :id="mainId"
          name="main"
          scroll="scroll"
          as="main"
          :class="cn('min-w-0 flex-1 focus:outline-none', sidebarSide === 'right' && 'order-first')"
        >
          <slot />
        </LayoutSlot>
      </div>
      <LayoutMobileNav v-if="slots.sidebar" :label="sidebarLabel">
        <slot name="sidebar" />
      </LayoutMobileNav>
    </div>
  </LayoutNavProvider>
</template>

<script lang="ts">
export default { inheritAttrs: false }
</script>
