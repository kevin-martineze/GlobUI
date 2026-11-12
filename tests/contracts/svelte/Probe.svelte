<script lang="ts">
  import { onMount, tick } from "svelte"
  import { useLayoutScroll } from "../../../packages/svelte/src/layout"

  const scroll = useLayoutScroll()
  let text = $state("none")
  // Read after mount: the layout's scroll element is bound once the region is in the DOM.
  onMount(async () => {
    await tick()
    text = scroll()?.tagName ?? "none"
  })
</script>

<span data-testid="probe">{text}</span>
