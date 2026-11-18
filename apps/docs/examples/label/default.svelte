<script lang="ts">
  import { Input } from "@glob-ui/svelte/input"
  import { Label } from "@glob-ui/svelte/label"
</script>

<div class="flex w-full max-w-sm flex-col gap-1.5">
  <Label for="name">Full name</Label>
  <Input id="name" placeholder="Ana Torres" />
</div>
