<script lang="ts">
  import { Label } from "@glob-ui/svelte/label"
  import { Progress } from "@glob-ui/svelte/progress"
</script>

<div class="flex w-full max-w-sm flex-col gap-2">
  <Label id="sync-label">Syncing your workspace</Label>
  <Progress aria-labelledby="sync-label" value={null} size="lg" />
</div>
