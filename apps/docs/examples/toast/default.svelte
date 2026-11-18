<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
  import { toast } from "@glob-ui/svelte/toast"
</script>

<!-- Mount <Toaster /> once, in the root layout. Toasts appear in the bottom-right corner. -->
<div class="flex flex-wrap justify-center gap-3">
  <Button variant="outline" onclick={() => toast({ title: "Event created", description: "Friday at 10:00." })}>Default</Button>
  <Button variant="outline" onclick={() => toast.success("Changes saved")}>Success</Button>
  <Button variant="outline" onclick={() => toast.warning("Storage almost full")}>Warning</Button>
  <Button variant="outline" onclick={() => toast.error("Upload failed", { description: "Try a smaller file." })}>Error</Button>
</div>
