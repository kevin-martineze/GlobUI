<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
  import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@glob-ui/svelte/dialog"
</script>

<Dialog>
  <DialogTrigger>
    {#snippet child(props)}<Button variant="outline" {...props}>Edit profile</Button>{/snippet}
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Edit profile</DialogTitle>
    <DialogDescription>Make changes to your profile. Esc or a backdrop click closes it.</DialogDescription>
    <DialogFooter>
      <DialogClose>
        {#snippet child(props)}<Button variant="ghost" {...props}>Cancel</Button>{/snippet}
      </DialogClose>
      <DialogClose>
        {#snippet child(props)}<Button {...props}>Save</Button>{/snippet}
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>
