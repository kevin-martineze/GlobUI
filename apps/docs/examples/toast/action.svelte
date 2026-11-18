<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
  import { toast } from "@glob-ui/svelte/toast"
</script>

<Button
  variant="outline"
  onclick={() =>
    toast({
      title: "Message archived",
      duration: Infinity,
      action: { label: "Undo", onClick: () => toast.success("Message restored") },
    })}
>
  Archive message
</Button>
