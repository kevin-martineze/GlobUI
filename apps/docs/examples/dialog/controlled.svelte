<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@glob-ui/svelte/dialog"

  // Controlled, and a backdrop click does not close it: the user must choose.
  let open = $state(false)
  let result = $state("none yet")

  function choose(choice: string) {
    result = choice
    open = false
  }
</script>

<div class="flex flex-col items-center gap-3">
  <Dialog bind:open closeOnOutsideClick={false}>
    <DialogTrigger>
      {#snippet child(props)}<Button variant="outline" {...props}>Delete project</Button>{/snippet}
    </DialogTrigger>
    <DialogContent size="sm" showCloseButton={false}>
      <DialogTitle>Delete project?</DialogTitle>
      <DialogDescription>This cannot be undone.</DialogDescription>
      <DialogFooter>
        <Button variant="ghost" onclick={() => choose("cancelled")}>Cancel</Button>
        <Button onclick={() => choose("deleted")}>Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  <p class="text-sm text-fd-muted-foreground">Last choice: {result}</p>
</div>
