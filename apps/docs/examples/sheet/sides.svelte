<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
  import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@glob-ui/svelte/sheet"

  const sides = ["right", "left", "top", "bottom"] as const
</script>

<div class="flex flex-wrap gap-3">
  {#each sides as side (side)}
    <Sheet>
      <SheetTrigger>
        {#snippet child(props)}<Button variant="outline" class="capitalize" {...props}>{side}</Button>{/snippet}
      </SheetTrigger>
      <SheetContent {side}>
        <SheetTitle class="capitalize">{side} sheet</SheetTitle>
        <SheetDescription>It slides in from the {side}.</SheetDescription>
      </SheetContent>
    </Sheet>
  {/each}
</div>
