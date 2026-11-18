<script lang="ts">
  import { setContext, type Snippet } from "svelte"
  import { FloatingPanel, type Placement } from "../shared/floating.svelte"
  import { POPOVER_KEY, type FloatingContext } from "../shared/context"

  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

  let {
    open = $bindable(undefined),
    defaultOpen = false,
    onOpenChange,
    placement = "bottom",
    offset = 8,
    children,
  }: {
    /** Controlled open state. Bind it with `bind:open`, or pass it with `onOpenChange`. */
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
    /** Preferred side. Flips to the opposite side when it does not fit. */
    placement?: Placement
    /** Gap between trigger and content, in px. */
    offset?: number
    children?: Snippet
  } = $props()

  const id = $props.id()
  // Only the initial defaultOpen is wanted.
  // svelte-ignore state_referenced_locally
  let internal = $state(defaultOpen)
  const isOpen = $derived(open ?? internal)

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
    // Non-modal: move focus in, but do not trap it. A [data-autofocus] element inside wins over the first focusable one.
    onShow: (el) =>
      (el.querySelector<HTMLElement>("[data-autofocus]") ?? el.querySelector<HTMLElement>(FOCUSABLE) ?? el).focus({
        preventScroll: true,
      }),
  }))

  const ctx: FloatingContext = {
    get open() {
      return isOpen
    },
    setOpen,
    triggerId: `${id}-trigger`,
    contentId: `${id}-content`,
    panel,
  }
  setContext(POPOVER_KEY, ctx)
</script>

{@render children?.()}
