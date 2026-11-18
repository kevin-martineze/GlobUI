<script lang="ts">
  import type { Component } from "svelte"

  let { example: Example }: { example: Component } = $props()
</script>

<div data-testid="example"><Example /></div>
