<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
  import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@glob-ui/svelte/dialog"

  const sizes = ["sm", "md", "lg"] as const
</script>

<div class="flex flex-wrap gap-3">
  {#each sizes as size (size)}
    <Dialog>
      <DialogTrigger>
        {#snippet child(props)}<Button variant="outline" {...props}>{size.toUpperCase()}</Button>{/snippet}
      </DialogTrigger>
      <DialogContent {size}>
        <DialogTitle>Size {size}</DialogTitle>
        <DialogDescription>The panel width follows the size prop.</DialogDescription>
      </DialogContent>
    </Dialog>
  {/each}
</div>
