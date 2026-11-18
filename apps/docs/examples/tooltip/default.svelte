<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
  import { Tooltip } from "@glob-ui/svelte/tooltip"
</script>

<!-- The trigger is a `child` snippet: spread the props on it, the ref included. -->
<Tooltip content="Copies the link to your clipboard">
  {#snippet child(props)}<Button variant="outline" {...props}>Share</Button>{/snippet}
</Tooltip>
