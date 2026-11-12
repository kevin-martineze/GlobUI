<script lang="ts">
  import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose } from "../../../packages/svelte/src/sheet"

  let { title, triggerLabel }: { title: string; triggerLabel: string } = $props()
</script>

<Sheet>
  <SheetTrigger>{triggerLabel}</SheetTrigger>
  <SheetContent side="right">
    <SheetTitle>{title}</SheetTitle>
    <SheetClose>Close</SheetClose>
  </SheetContent>
</Sheet>
