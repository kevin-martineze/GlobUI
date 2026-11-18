// A floating panel for Svelte: a `popover` element positioned next to a trigger and kept in sync with `open`.
// The positioning and the popover handling live in @glob-ui/core (createFloatingPanel); this class keeps the
// elements and the position in runes. Create it while a component initializes: its effects belong to that component.

import { untrack } from "svelte"
import { createAttachmentKey } from "svelte/attachments"
import { createFloatingPanel, type FloatingPanelController, type FloatingPosition, type Placement } from "@glob-ui/core"

export type { Placement }

export interface FloatingOptions {
  open: boolean
  onOpenChange: (open: boolean) => void
  placement?: Placement
  /** Gap between trigger and panel, in px. */
  offset?: number
  /** Arrow element, positioned by the arrow middleware. */
  arrow?: HTMLElement | null
  /** Constrain the panel to the space left in the viewport (max-height/max-width). */
  fitViewport?: boolean
  /** Make the panel at least as wide as the trigger (listboxes). */
  matchTriggerWidth?: boolean
  /** Runs right after the panel is shown. Use it to move focus. */
  onShow?: (panel: HTMLElement) => void
  /** When the browser closes the panel (light dismiss, Esc), return focus to the trigger if focus was inside. */
  restoreFocus?: boolean
  /** Element that gets focus back, when it is not the trigger. */
  restoreFocusTo?: () => HTMLElement | null
}

const INITIAL: FloatingPosition = { x: 0, y: 0, placement: "bottom", isPositioned: false, middlewareData: {} }

export class FloatingPanel {
  trigger = $state<HTMLElement | null>(null)
  panel = $state<HTMLElement | null>(null)
  position = $state<FloatingPosition>(INITIAL)
  #get: () => FloatingOptions
  #controller: FloatingPanelController | null = null
  #openAtPointerDown: boolean | null = null

  /** `options` is read inside effects: every reactive value it reads re-syncs the panel. */
  constructor(options: () => FloatingOptions) {
    this.#get = options

    // Created once the trigger and panel are mounted; destroyed with them. The options are read untracked here,
    // so an `open` change updates the controller instead of re-creating it.
    $effect(() => {
      const { trigger, panel } = this
      if (!trigger || !panel) return
      const controller = untrack(() => createFloatingPanel(trigger, panel, this.#coreOptions()))
      this.#controller = controller
      return () => {
        controller.destroy()
        this.#controller = null
      }
    })

    // Reads every option (tracked), then updates the controller untracked: the callbacks it runs (onShow, the
    // position) must not become dependencies of this effect.
    $effect(() => {
      const next = this.#coreOptions()
      untrack(() => this.#controller?.update(next))
    })
  }

  /** Plain values read now (tracked by the caller), callbacks that read the latest options when they run. */
  #coreOptions() {
    const o = this.#get()
    return {
      open: o.open,
      placement: o.placement ?? "bottom",
      offset: o.offset ?? 8,
      arrow: o.arrow ?? null,
      fitViewport: o.fitViewport ?? true,
      matchTriggerWidth: o.matchTriggerWidth ?? false,
      restoreFocus: o.restoreFocus ?? true,
      onOpenChange: (open: boolean) => this.#get().onOpenChange(open),
      onShow: (el: HTMLElement) => this.#get().onShow?.(el),
      restoreFocusTo: () => this.#get().restoreFocusTo?.() ?? null,
      onPosition: (position: FloatingPosition) => {
        this.position = position
      },
    }
  }

  /** Inline style for the panel. Transparent until positioned: the panel must be focusable right after showPopover(). */
  get style() {
    const { x, y, isPositioned } = this.position
    return isPositioned
      ? `position: fixed; left: 0px; top: 0px; transform: translate(${x}px, ${y}px);`
      : "position: fixed; left: 0px; top: 0px; opacity: 0;"
  }

  /** The placement after flipping, once positioned. */
  get placement(): Placement {
    return this.position.isPositioned ? this.position.placement : (this.#get().placement ?? "bottom")
  }

  /** Spread on the trigger: it registers the element (an attachment, so it also works through a `child` snippet). */
  readonly triggerAttachment = {
    [createAttachmentKey()]: (node: HTMLElement) => {
      this.trigger = node
      return () => {
        if (this.trigger === node) this.trigger = null
      }
    },
  }

  /**
   * Light dismiss closes the panel on pointerup, before the trigger's click runs. The state at pointerdown is kept,
   * so clicking the trigger closes the panel instead of reopening it.
   */
  onTriggerPointerDown() {
    this.#openAtPointerDown = this.#get().open
  }

  onTriggerClick() {
    const wasOpen = this.#openAtPointerDown ?? this.#get().open
    this.#openAtPointerDown = null
    this.#get().onOpenChange(!wasOpen)
  }
}

/** Merges the floating style with a style the caller passed. */
export function withStyle(floating: string, style: string | null | undefined) {
  return style ? `${floating} ${style}` : floating
}
