// Module-level toast store for React. No "use client": `toast()` can be imported anywhere.
// The store itself is framework-free (@glob-ui/core); this file only fixes the content types to React.

import { createToastStore, TOAST_EXIT_MS, type ToastData as CoreToastData, type ToastVariant } from "@glob-ui/core"

export type { ToastVariant }

export interface ToastAction {
  label: React.ReactNode
  /** Call `event.preventDefault()` to keep the toast open after the click. */
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export interface ToastSettings {
  /** Reuse an id to update a toast in place instead of adding a new one. */
  id?: string
  variant?: ToastVariant
  /** Time on screen in ms. `Infinity` keeps it until dismissed. Default 5000. */
  duration?: number
  action?: ToastAction
}

/** A toast needs a title, a description, or both. */
export type ToastContent =
  | { title: React.ReactNode; description?: React.ReactNode }
  | { title?: React.ReactNode; description: React.ReactNode }

/** Options for `toast(options)`. */
export type ToastOptions = ToastSettings & ToastContent

/** Options for `toast(title, options)`: everything except the title. */
export type ToastExtraOptions = ToastSettings & { description?: React.ReactNode }

export type ToastData = CoreToastData<React.ReactNode, ToastAction>

/** Matches the exit transition in the Toaster. */
export const EXIT_MS = TOAST_EXIT_MS

const store = createToastStore<React.ReactNode, ToastAction>()

export const subscribe = store.subscribe
export const getSnapshot = () => store.getSnapshot()
export const getServerSnapshot = () => store.getServerSnapshot()

function dismiss(id?: string) {
  store.dismiss(id)
}

function show(title: string, opts?: ToastExtraOptions): string
function show(opts: ToastOptions): string
function show(titleOrOpts: string | ToastOptions, extra?: ToastExtraOptions): string {
  const opts: ToastSettings & { title?: React.ReactNode; description?: React.ReactNode } =
    typeof titleOrOpts === "string" ? { ...extra, title: titleOrOpts } : titleOrOpts
  return store.show(opts)
}

interface VariantShortcut {
  (title: string, opts?: Omit<ToastExtraOptions, "variant">): string
  (opts: Omit<ToastSettings, "variant"> & ToastContent): string
}

const variantShortcut = (variant: ToastVariant): VariantShortcut =>
  ((titleOrOpts: string | ToastOptions, extra?: ToastExtraOptions) =>
    typeof titleOrOpts === "string"
      ? show(titleOrOpts, { ...extra, variant })
      : show({ ...titleOrOpts, variant })) as VariantShortcut

/**
 * Shows a toast and returns its id. Needs a mounted `<Toaster />` to be visible.
 * Safe to call anywhere; on the server it does nothing.
 */
export const toast = Object.assign(show, {
  success: variantShortcut("success"),
  error: variantShortcut("danger"),
  warning: variantShortcut("warning"),
  info: variantShortcut("info"),
  /** Dismisses one toast, or all of them without an id. */
  dismiss,
})

/** @internal Used by the Toaster. */
export const toastStore = { subscribe, getSnapshot, getServerSnapshot }
