<script lang="ts">
  import type { Snippet } from "svelte"
  import { cn } from "@glob-ui/utils"
  import { TOOLTIP_ARROW_CLASSES, TOOLTIP_CLASSES, TOOLTIP_TRANSITION_CLASSES } from "@glob-ui/recipes"
  import { FloatingPanel, type Placement } from "../shared/floating.svelte"

  const oppositeSide = { top: "bottom", right: "left", bottom: "top", left: "right" } as const

  let {
    content,
    child,
    placement = "top",
    delayDuration = 500,
    closeDelay = 150,
    offset = 6,
    arrow = false,
    class: className,
    "aria-describedby": ownDescribedBy,
  }: {
    content: string | Snippet
    /**
     * The trigger: one focusable element (usually a button). It receives the attributes to apply, a ref included,
     * so spread all of them on it: `{#snippet child(props)}<button {...props}>Info</button>{/snippet}`.
     */
    child: Snippet<[Record<string, unknown>]>
    placement?: Placement
    /** Hover delay before opening, in ms. Keyboard focus opens immediately. */
    delayDuration?: number
    /** Delay before closing after the pointer leaves, in ms. Moving onto the tooltip within this time keeps it open (WCAG 1.4.13). */
    closeDelay?: number
    /** Gap between trigger and tooltip, in px. */
    offset?: number
    arrow?: boolean
    class?: string
    /** Extra descriptions for the trigger, joined with the tooltip's id. */
    "aria-describedby"?: string
  } = $props()

  const id = $props.id()
  let open = $state(false)
  let arrowEl = $state<HTMLDivElement | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined

  const panel = new FloatingPanel(() => ({
    open,
    onOpenChange: (next) => (open = next),
    placement,
    offset: offset + (arrow ? 4 : 0),
    arrow: arrow ? arrowEl : null,
    fitViewport: false,
    restoreFocus: false,
  }))

  function show(delay: number) {
    clearTimeout(timer)
    if (delay <= 0) open = true
    else timer = setTimeout(() => (open = true), delay)
  }
  function hide(delay: number) {
    clearTimeout(timer)
    if (delay <= 0) open = false
    else timer = setTimeout(() => (open = false), delay)
  }

  $effect(() => () => clearTimeout(timer))

  // popover="manual" has no Esc handling of its own.
  $effect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide(0)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  })

  const side = $derived(panel.placement.split("-")[0] as keyof typeof oppositeSide)
  const arrowData = $derived(panel.position.middlewareData.arrow)

  const triggerProps = $derived({
    ...panel.triggerAttachment,
    "aria-describedby": [ownDescribedBy, id].filter(Boolean).join(" "),
    onpointerenter: (e: PointerEvent) => {
      if (e.pointerType !== "touch") show(delayDuration)
    },
    onpointerleave: (e: PointerEvent) => {
      if (e.pointerType !== "touch") hide(closeDelay)
    },
    onpointerdown: () => hide(0),
    onfocus: (e: FocusEvent) => {
      // Keyboard focus only: a tap or click also focuses, but is not :focus-visible.
      if ((e.currentTarget as HTMLElement).matches(":focus-visible")) show(0)
    },
    onblur: () => hide(0),
  })

  const arrowStyle = $derived(
    [
      arrowData?.x != null ? `left: ${arrowData.x}px;` : "",
      arrowData?.y != null ? `top: ${arrowData.y}px;` : "",
      `${oppositeSide[side]}: -4px;`,
    ].join(" ")
  )
</script>

{@render child(triggerProps)}
<!-- Hoverable: entering the tooltip cancels the pending close, leaving starts it again. -->
<div
  bind:this={panel.panel}
  {id}
  role="tooltip"
  popover="manual"
  style={panel.style}
  onpointerenter={() => clearTimeout(timer)}
  onpointerleave={() => hide(closeDelay)}
  class={cn(TOOLTIP_CLASSES, TOOLTIP_TRANSITION_CLASSES, className)}
>
  {#if typeof content === "function"}{@render content()}{:else}{content}{/if}
  {#if arrow}
    <div bind:this={arrowEl} aria-hidden="true" class={TOOLTIP_ARROW_CLASSES} style={arrowStyle}></div>
  {/if}
</div>
