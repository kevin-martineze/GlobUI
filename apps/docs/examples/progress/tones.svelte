<script lang="ts">
  import { Label } from "@glob-ui/svelte/label"
  import { Progress } from "@glob-ui/svelte/progress"

  const tones = ["primary", "success", "warning", "danger"] as const
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  {#each tones as tone (tone)}
    <div class="flex flex-col gap-2">
      <Label id={`tone-${tone}`} class="capitalize">
        {tone}
      </Label>
      <Progress aria-labelledby={`tone-${tone}`} value={60} {tone} />
    </div>
  {/each}
</div>
