<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
  import { Tooltip } from "@glob-ui/svelte/tooltip"

  const placements = ["top", "right", "bottom"] as const
</script>

<div class="flex flex-wrap gap-3">
  {#each placements as placement (placement)}
    <Tooltip content={placement[0].toUpperCase() + placement.slice(1)} {placement} arrow>
      {#snippet child(props)}<Button variant="outline" {...props}>{placement[0].toUpperCase() + placement.slice(1)}</Button>{/snippet}
    </Tooltip>
  {/each}
</div>
