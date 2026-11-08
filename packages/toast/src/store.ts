// Module-level toast store. No React state and no "use client": `toast()` can be imported anywhere.
// On the server it is a no-op, because module state there is shared by every request.

export type ToastVariant = "default" | "success" | "warning" | "danger" | "info"

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

export interface ToastData extends ToastSettings {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant: ToastVariant
  duration: number
  /** Increments on every update, so timers restart. */
  version: number
  /** Playing the exit animation; removed shortly after. */
  leaving: boolean
}

const DEFAULT_DURATION = 5000
/** Matches the exit transition in the Toaster. */
export const EXIT_MS = 200

let toasts: ToastData[] = []
const listeners = new Set<() => void>()
const EMPTY: ToastData[] = []
let counter = 0

function setToasts(next: ToastData[]) {
  toasts = next
  for (const listener of listeners) listener()
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getSnapshot() {
  return toasts
}

export function getServerSnapshot() {
  return EMPTY
}

function dismiss(id?: string) {
  if (typeof window === "undefined") return
  const targets = toasts.filter((t) => !t.leaving && (id === undefined || t.id === id))
  if (targets.length === 0) return
  const ids = new Set(targets.map((t) => t.id))
  setToasts(toasts.map((t) => (ids.has(t.id) ? { ...t, leaving: true } : t)))
  setTimeout(() => {
    // Skip toasts that were revived by an update with the same id meanwhile.
    setToasts(toasts.filter((t) => !(ids.has(t.id) && t.leaving)))
  }, EXIT_MS)
}

function show(title: string, opts?: ToastExtraOptions): string
function show(opts: ToastOptions): string
function show(titleOrOpts: string | ToastOptions, extra?: ToastExtraOptions): string {
  const opts: ToastSettings & { title?: React.ReactNode; description?: React.ReactNode } =
    typeof titleOrOpts === "string" ? { ...extra, title: titleOrOpts } : titleOrOpts
  const id = opts.id ?? `glob-toast-${++counter}`
  if (typeof window === "undefined") return id

  const existing = toasts.find((t) => t.id === id)
  const data: ToastData = {
    ...existing,
    ...opts,
    id,
    variant: opts.variant ?? existing?.variant ?? "default",
    duration: opts.duration ?? existing?.duration ?? DEFAULT_DURATION,
    version: (existing?.version ?? 0) + 1,
    leaving: false,
  }
  setToasts(existing ? toasts.map((t) => (t.id === id ? data : t)) : [...toasts, data])
  return id
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
