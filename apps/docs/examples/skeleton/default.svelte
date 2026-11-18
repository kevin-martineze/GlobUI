<script lang="ts">
  import { Skeleton } from "@glob-ui/svelte/skeleton"
</script>

<div class="flex w-full max-w-sm items-center gap-4">
  <Skeleton class="h-12 w-12 rounded-full" />
  <div class="flex flex-1 flex-col gap-2">
    <Skeleton class="h-4 w-3/4" />
    <Skeleton class="h-4 w-1/2" />
  </div>
</div>
