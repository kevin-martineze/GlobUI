<script lang="ts">
  import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "../../../packages/svelte/src/dialog"

  let { title, triggerLabel }: { title: string; triggerLabel: string } = $props()
</script>

<Dialog>
  <DialogTrigger>{triggerLabel}</DialogTrigger>
  <DialogContent>
    <DialogTitle>{title}</DialogTitle>
    <DialogDescription>Are you sure?</DialogDescription>
    <DialogClose>Cancel</DialogClose>
  </DialogContent>
</Dialog>
