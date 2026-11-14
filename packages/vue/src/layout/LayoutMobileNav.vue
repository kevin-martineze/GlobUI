<script setup lang="ts">
import { SheetContent } from "../sheet"
import { Dialog } from "../dialog"
import { useLayoutNav } from "../shared/context"
import { LAYOUT_MOBILE_NAV_LIST_CLASSES } from "@glob-ui/recipes"

defineProps<{ label: string }>()
const nav = useLayoutNav("LayoutMobileNav")

function onClick(event: MouseEvent) {
  // Following a link in the navigation ends the interaction: close the sheet.
  if ((event.target as HTMLElement).closest("a[href]")) nav.setOpen(false)
}
</script>

<template>
  <Dialog :open="nav.open" :on-open-change="(next: boolean) => nav.setOpen(next)">
    <SheetContent :id="nav.panelId" side="left" size="sm" :aria-label="label" @click="onClick">
      <nav :aria-label="label" :class="LAYOUT_MOBILE_NAV_LIST_CLASSES">
        <slot />
      </nav>
    </SheetContent>
  </Dialog>
</template>
