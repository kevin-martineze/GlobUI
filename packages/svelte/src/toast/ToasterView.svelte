<script lang="ts">
  import { cn } from "@glob-ui/utils"
  import { TOASTER_CLASSES, TOASTER_POSITION_CLASSES, TOASTER_TRANSITION_CLASSES, TOAST_LIST_CLASSES } from "@glob-ui/recipes"
  import { toastStore, type ToastData } from "./store"
  import type { ToasterPosition } from "./types"
  import ToastItem from "./ToastItem.svelte"
  import ToastText from "./ToastText.svelte"

  let {
    position,
    max,
    closeLabel,
    label,
    className,
    host,
  }: {
    position: ToasterPosition
    max: number
    closeLabel: string
    label: string
    className?: string
    host: HTMLElement | null
  } = $props()

  const isUrgent = (t: ToastData) => t.variant === "warning" || t.variant === "danger"

  let toasts = $state<ToastData[]>(toastStore.getSnapshot())
  $effect(() => toastStore.subscribe(() => (toasts = toastStore.getSnapshot())))

  let hidden = $state(document.hidden)
  $effect(() => {
    const onChange = () => (hidden = document.hidden)
    document.addEventListener("visibilitychange", onChange)
    return () => document.removeEventListener("visibilitychange", onChange)
  })

  let hovered = $state(false)
  let focusWithin = $state(false)
  let container = $state<HTMLElement | null>(null)
  let shownIds = new Set<string>()

  const visible = $derived(toasts.slice(0, max))
  const active = $derived(visible.length > 0)
  const paused = $derived(hovered || focusWithin || hidden)

  // Keep the host where it is not inert, and the container above other top-layer elements. Runs when the visible
  // toasts change; promotes the container when new ones arrive.
  $effect(() => {
    if (!host || !container) return
    const newIds = visible.filter((t) => !shownIds.has(t.id))
    shownIds = new Set(visible.map((t) => t.id))
    placeHost(host, container, visible.length > 0, newIds.length > 0)
  })

  // Dialogs opening, closing or unmounting change where the host must be. Only watched while toasts are on screen.
  $effect(() => {
    if (!host || !container || !active) return
    const h = host
    const c = container
    const observer = new MutationObserver((records) => {
      if (h.isConnected && !records.some(involvesDialog)) return
      placeHost(h, c, true, false)
    })
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open"] })
    return () => observer.disconnect()
  })

  function isPopoverOpen(el: HTMLElement) {
    try {
      return el.matches(":popover-open")
    } catch {
      return false
    }
  }

  /** Topmost open modal dialog. Everything outside it is inert, so toasts must live inside it. */
  function topModalDialog() {
    const modals = document.querySelectorAll<HTMLDialogElement>("dialog:modal")
    return modals[modals.length - 1] ?? null
  }

  /** Moves the host next to the topmost modal dialog (or body) and shows or hides the container. */
  function placeHost(host: HTMLElement, container: HTMLElement, hasToasts: boolean, promote: boolean) {
    const target = topModalDialog() ?? document.body
    let moved = false
    if (host.parentElement !== target) {
      // Moving a shown popover out of the document hides it; it is shown again below.
      target.appendChild(host)
      moved = true
    }
    if (!hasToasts) {
      if (isPopoverOpen(container)) container.hidePopover()
      return
    }
    if (!isPopoverOpen(container)) {
      container.showPopover()
    } else if (promote && !moved && hasOtherTopLayer(container)) {
      // Showing again puts the container last in the top layer, so it paints above menus and dialogs.
      container.hidePopover()
      container.showPopover()
    }
  }

  const containsDialog = (node: Node) =>
    node.nodeName === "DIALOG" || (node instanceof Element && node.querySelector("dialog") !== null)

  /** True when a mutation record opened/closed, added or removed a dialog. */
  function involvesDialog(record: MutationRecord) {
    if (record.type === "attributes") return record.target.nodeName === "DIALOG"
    return Array.from(record.addedNodes).some(containsDialog) || Array.from(record.removedNodes).some(containsDialog)
  }

  function hasOtherTopLayer(container: HTMLElement) {
    if (document.querySelector("dialog:modal")) return true
    try {
      return Array.from(document.querySelectorAll(":popover-open")).some((el) => el !== container)
    } catch {
      return false
    }
  }

  const regionToasts = (urgent: boolean) => visible.filter((t) => !t.leaving && isUrgent(t) === urgent)
</script>

<!-- Always mounted so screen readers track them before the first toast arrives. -->
<div role="status" aria-live="polite" aria-atomic="false" class="sr-only">
  {#each regionToasts(false) as t (`${t.id}:${t.version}`)}
    <div><ToastText text={t.title} /> <ToastText text={t.description} /></div>
  {/each}
</div>
<div role="alert" aria-live="assertive" aria-atomic="false" class="sr-only">
  {#each regionToasts(true) as t (`${t.id}:${t.version}`)}
    <div><ToastText text={t.title} /> <ToastText text={t.description} /></div>
  {/each}
</div>
<section
  bind:this={container}
  popover="manual"
  aria-label={label}
  class={cn(TOASTER_CLASSES, TOASTER_TRANSITION_CLASSES, TOASTER_POSITION_CLASSES[position], className)}
>
  <ol
    class={TOAST_LIST_CLASSES}
    onpointerenter={() => (hovered = true)}
    onpointerleave={() => (hovered = false)}
    onfocusin={() => (focusWithin = true)}
    onfocusout={(e) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) focusWithin = false
    }}
  >
    {#each visible as t (t.id)}
      <ToastItem toast={t} {paused} {closeLabel} fromTop={position.startsWith("top")} onFocusLost={() => (focusWithin = false)} />
    {/each}
  </ol>
</section>
