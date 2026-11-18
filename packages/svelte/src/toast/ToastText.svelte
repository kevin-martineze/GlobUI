<script lang="ts">
  import type { ToastText } from "./store"
  let { text }: { text: ToastText | undefined } = $props()
</script>

{#if typeof text === "function"}{@render text()}{:else if text != null}{text}{/if}
