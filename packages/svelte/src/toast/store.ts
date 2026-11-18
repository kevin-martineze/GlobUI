// Module-level toast store for Svelte. The store itself is framework-free (@glob-ui/core); this file fixes the
// content types to Svelte (a string or a snippet) and adds the `toast()` API, the same as React's.

import type { Snippet } from "svelte"
import { createToastStore, type ToastData as CoreToastData, type ToastVariant } from "@glob-ui/core"

export type { ToastVariant }

/** A string, or a snippet for rich content. */
export type ToastText = string | Snippet

export interface ToastAction {
  label: ToastText
  /** Call `event.preventDefault()` to keep the toast open after the click. */
  onClick: (event: MouseEvent) => void
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
export type ToastContent = { title: ToastText; description?: ToastText } | { title?: ToastText; description: ToastText }

/** Options for `toast(options)`. */
export type ToastOptions = ToastSettings & ToastContent

/** Options for `toast(title, options)`: everything except the title. */
export type ToastExtraOptions = ToastSettings & { description?: ToastText }

export type ToastData = CoreToastData<ToastText, ToastAction>

/** @internal Used by the Toaster. */
export const toastStore = createToastStore<ToastText, ToastAction>()

function show(title: string, opts?: ToastExtraOptions): string
function show(opts: ToastOptions): string
function show(titleOrOpts: string | ToastOptions, extra?: ToastExtraOptions): string {
  const opts: ToastSettings & { title?: ToastText; description?: ToastText } =
    typeof titleOrOpts === "string" ? { ...extra, title: titleOrOpts } : titleOrOpts
  return toastStore.show(opts)
}

interface VariantShortcut {
  (title: string, opts?: Omit<ToastExtraOptions, "variant">): string
  (opts: Omit<ToastSettings, "variant"> & ToastContent): string
}

const variantShortcut = (variant: ToastVariant): VariantShortcut =>
  ((titleOrOpts: string | ToastOptions, extra?: ToastExtraOptions) =>
    typeof titleOrOpts === "string" ? show(titleOrOpts, { ...extra, variant }) : show({ ...titleOrOpts, variant })) as VariantShortcut

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
  dismiss: (id?: string) => toastStore.dismiss(id),
})
