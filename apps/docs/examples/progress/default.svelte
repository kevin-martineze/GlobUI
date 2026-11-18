<script lang="ts">
  import { onMount } from "svelte"
  import { Label } from "@glob-ui/svelte/label"
  import { Progress } from "@glob-ui/svelte/progress"

  let value = $state(0)

  onMount(() => {
    const timer = window.setInterval(() => (value = value >= 100 ? 0 : value + 10), 600)
    return () => window.clearInterval(timer)
  })
</script>

<div class="flex w-full max-w-sm flex-col gap-2">
  <Label id="upload-label">Uploading report.pdf</Label>
  <Progress aria-labelledby="upload-label" {value} />
</div>
