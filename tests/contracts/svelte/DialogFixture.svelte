<script lang="ts">
  import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "../../../packages/svelte/src/dialog"

  let { title, triggerLabel, titleClass, contentClass }: { title: string; triggerLabel: string; titleClass?: string; contentClass?: string } = $props()
</script>

<Dialog>
  <DialogTrigger>{triggerLabel}</DialogTrigger>
  <DialogContent class={contentClass}>
    <DialogTitle class={titleClass}>{title}</DialogTitle>
    <DialogDescription>Are you sure?</DialogDescription>
    <DialogClose>Cancel</DialogClose>
  </DialogContent>
</Dialog>
