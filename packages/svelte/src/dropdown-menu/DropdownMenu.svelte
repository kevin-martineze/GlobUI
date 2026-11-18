<script lang="ts">
  import { setContext, type Snippet } from "svelte"
  import { FloatingPanel, type Placement } from "../shared/floating.svelte"
  import { MENU_KEY, type MenuContext, type MenuFocusIntent } from "../shared/context"
  import { getMenuItems } from "./items"

  let {
    open = $bindable(undefined),
    defaultOpen = false,
    onOpenChange,
    placement = "bottom-start",
    offset = 4,
    children,
  }: {
    /** Controlled open state. Bind it with `bind:open`, or pass it with `onOpenChange`. */
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    /** Preferred side. Flips when it does not fit. */
    placement?: Placement
    /** Gap between trigger and menu, in px. */
    offset?: number
    children?: Snippet
  } = $props()

  const id = $props.id()
  // svelte-ignore state_referenced_locally
  let internal = $state(defaultOpen)
  const isOpen = $derived(open ?? internal)
  let intent: MenuFocusIntent = "content"

  function setOpen(next: boolean) {
    if (next === isOpen) return
    if (open === undefined) internal = next
    else open = next
    onOpenChange?.(next)
  }

  const panel = new FloatingPanel(() => ({
    open: isOpen,
    onOpenChange: setOpen,
    placement,
    offset,
    onShow: (el) => {
      const items = getMenuItems(el)
      const target = intent === "first" ? items[0] : intent === "last" ? items[items.length - 1] : undefined
      intent = "content"
      ;(target ?? el).focus({ preventScroll: true })
    },
  }))

  const ctx: MenuContext = {
    get open() {
      return isOpen
    },
    setOpen,
    openWith(next) {
      intent = next
      setOpen(true)
    },
    triggerId: `${id}-trigger`,
    contentId: `${id}-content`,
    panel,
  }
  setContext(MENU_KEY, ctx)
</script>

{@render children?.()}
