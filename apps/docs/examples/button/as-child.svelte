<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
</script>

<!-- The `child` snippet renders your own element (here a link) with the button styles and props. -->
<Button variant="outline">
  {#snippet child(props)}
    <a href="/docs/installation" {...props}>Read the installation guide</a>
  {/snippet}
</Button>
