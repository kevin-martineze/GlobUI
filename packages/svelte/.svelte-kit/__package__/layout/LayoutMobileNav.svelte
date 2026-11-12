<script lang="ts">
  import type { Snippet } from "svelte"
  import { getContext } from "svelte"
  import { SheetContent } from "../sheet"
  import { Dialog } from "../dialog"
  import { LAYOUT_NAV_KEY, type LayoutNavContext } from "../shared/context"

  let { label, children }: { label: string; children?: Snippet } = $props()
  const nav = getContext<LayoutNavContext | undefined>(LAYOUT_NAV_KEY)
  if (!nav) throw new Error("LayoutMobileNav must be used inside LayoutNavProvider")
</script>

<Dialog open={nav.open} onOpenChange={(next) => nav.setOpen(next)}>
  <SheetContent
    id={nav.panelId}
    side="left"
    size="sm"
    aria-label={label}
    onclick={(event) => {
      // Following a link in the navigation ends the interaction: close the sheet.
      if ((event.target as HTMLElement).closest("a[href]")) nav.setOpen(false)
    }}
  >
    <nav aria-label={label} class="flex flex-col gap-1">
      {@render children?.()}
    </nav>
  </SheetContent>
</Dialog>
