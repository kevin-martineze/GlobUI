<script lang="ts">
  import { setContext, type Snippet } from "svelte"
  import { LAYOUT_NAV_KEY } from "../shared/context"

  let { children }: { children?: Snippet } = $props()
  let open = $state(false)
  const panelId = $props.id()

  setContext(LAYOUT_NAV_KEY, {
    get open() {
      return open
    },
    setOpen(next: boolean) {
      open = next
    },
    panelId,
  })
</script>

{@render children?.()}
