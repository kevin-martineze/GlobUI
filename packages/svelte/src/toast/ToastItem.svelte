<script lang="ts">
  import { untrack } from "svelte"
  import { cn } from "@glob-ui/utils"
  import {
    alertVariants,
    TOAST_ACTION_CLASSES,
    TOAST_BODY_CLASSES,
    TOAST_CLASSES,
    TOAST_CLOSE_CLASSES,
    TOAST_CLOSE_ICON_CLASSES,
    TOAST_DESCRIPTION_CLASSES,
    TOAST_ENTER_FROM,
    TOAST_FADE_CLASSES,
    TOAST_TITLE_CLASSES,
    TOAST_TRANSITION_CLASSES,
  } from "@glob-ui/recipes"
  import AlertIcon from "../alert/AlertIcon.svelte"
  import { toast as toastApi, type ToastData } from "./store"
  import ToastText from "./ToastText.svelte"

  let {
    toast: t,
    paused,
    closeLabel,
    fromTop,
    onFocusLost,
  }: {
    toast: ToastData
    paused: boolean
    closeLabel: string
    fromTop: boolean
    /** The focused toast left and no other toast could take focus. */
    onFocusLost: () => void
  } = $props()

  let li = $state<HTMLLIElement | null>(null)
  // svelte-ignore state_referenced_locally
  let remaining = t.duration
  // svelte-ignore state_referenced_locally
  let version = t.version

  // Auto-dismiss. Pausing keeps the time left; an update restarts it.
  $effect(() => {
    const { id, duration, leaving } = t
    if (version !== t.version) {
      version = t.version
      remaining = duration
    }
    if (paused || leaving || !Number.isFinite(duration)) return
    const start = Date.now()
    const timer = setTimeout(() => toastApi.dismiss(id), untrack(() => remaining))
    return () => {
      clearTimeout(timer)
      remaining -= Date.now() - start
    }
  })

  // A removed element fires no blur, so the list would stay "focused" (and paused) forever. React handles this right
  // before the node is detached; Svelte removes the node before effect cleanups run, so this runs when the toast starts
  // leaving instead. Keyboard users get focus on the next toast; after a mouse click focus is simply released.
  $effect(() => {
    if (!t.leaving || !li || !li.contains(document.activeElement)) return
    const keyboard = li.querySelector(":focus-visible") !== null
    const next = Array.from(li.parentElement?.children ?? []).find((el) => el !== li && !el.hasAttribute("data-leaving"))
    const target = next?.querySelector<HTMLElement>("button[aria-label]")
    if (keyboard && target) {
      target.focus()
      return
    }
    ;(document.activeElement as HTMLElement | null)?.blur()
    onFocusLost()
  })
</script>

<!-- Same colours as Alert; no role here, the live regions announce it. -->
<li
  bind:this={li}
  data-leaving={t.leaving || undefined}
  class={cn(
    alertVariants({ variant: t.variant }),
    TOAST_CLASSES,
    TOAST_TRANSITION_CLASSES,
    TOAST_ENTER_FROM[fromTop ? "top" : "bottom"],
    TOAST_FADE_CLASSES
  )}
>
  <AlertIcon variant={t.variant} />
  <div class={TOAST_BODY_CLASSES}>
    {#if t.title != null}<div class={TOAST_TITLE_CLASSES}><ToastText text={t.title} /></div>{/if}
    {#if t.description != null}<div class={TOAST_DESCRIPTION_CLASSES}><ToastText text={t.description} /></div>{/if}
    {#if t.action}
      <button
        type="button"
        onclick={(e) => {
          t.action?.onClick(e)
          if (!e.defaultPrevented) toastApi.dismiss(t.id)
        }}
        class={TOAST_ACTION_CLASSES}
      >
        <ToastText text={t.action.label} />
      </button>
    {/if}
  </div>
  <button type="button" aria-label={closeLabel} onclick={() => toastApi.dismiss(t.id)} class={TOAST_CLOSE_CLASSES}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      class={TOAST_CLOSE_ICON_CLASSES}
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  </button>
</li>
