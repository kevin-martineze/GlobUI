<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
  import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@glob-ui/svelte/sheet"

  const sizes = ["sm", "md", "lg"] as const
</script>

<div class="flex flex-wrap gap-3">
  {#each sizes as size (size)}
    <Sheet>
      <SheetTrigger>
        {#snippet child(props)}<Button variant="outline" {...props}>{size.toUpperCase()}</Button>{/snippet}
      </SheetTrigger>
      <SheetContent side="left" {size}>
        <SheetTitle>Size {size}</SheetTitle>
        <SheetDescription>The width follows the size prop (left and right sheets).</SheetDescription>
      </SheetContent>
    </Sheet>
  {/each}
</div>
