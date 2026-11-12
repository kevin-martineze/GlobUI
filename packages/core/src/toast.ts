// Module-level toast store. Framework-free: the content type (`T`, a React node, a Svelte snippet, a
// Vue slot...) and the action type (`A`) are chosen by the adapter. The server has no store: every
// call is a no-op there, because module state would be shared by every request.

export type ToastVariant = "default" | "success" | "warning" | "danger" | "info"

export interface ToastSettings<A = unknown> {
  /** Reuse an id to update a toast in place instead of adding a new one. */
  id?: string
  variant?: ToastVariant
  /** Time on screen in ms. `Infinity` keeps it until dismissed. Default 5000. */
  duration?: number
  action?: A
}

export interface ToastInput<T, A = unknown> extends ToastSettings<A> {
  title?: T
  description?: T
}

export interface ToastData<T, A = unknown> extends ToastSettings<A> {
  id: string
  title?: T
  description?: T
  variant: ToastVariant
  duration: number
  /** Increments on every update, so timers restart. */
  version: number
  /** Playing the exit animation; removed shortly after. */
  leaving: boolean
}

export interface ToastStore<T, A = unknown> {
  /** Shows a toast, or updates the one with the same id. Returns its id. */
  show(input: ToastInput<T, A>): string
  /** Dismisses one toast, or all of them without an id. */
  dismiss(id?: string): void
  subscribe(listener: () => void): () => void
  getSnapshot(): ToastData<T, A>[]
  getServerSnapshot(): ToastData<T, A>[]
}

export const TOAST_DEFAULT_DURATION = 5000
/** Matches the exit transition in the Toaster. */
export const TOAST_EXIT_MS = 200

export function createToastStore<T, A = unknown>(): ToastStore<T, A> {
  type Data = ToastData<T, A>
  let toasts: Data[] = []
  const listeners = new Set<() => void>()
  const EMPTY: Data[] = []
  let counter = 0

  function setToasts(next: Data[]) {
    toasts = next
    for (const listener of listeners) listener()
  }

  const store: ToastStore<T, A> = {
    show(input) {
      const id = input.id ?? `glob-toast-${++counter}`
      if (typeof window === "undefined") return id

      const existing = toasts.find((t) => t.id === id)
      const data: Data = {
        ...existing,
        ...input,
        id,
        variant: input.variant ?? existing?.variant ?? "default",
        duration: input.duration ?? existing?.duration ?? TOAST_DEFAULT_DURATION,
        version: (existing?.version ?? 0) + 1,
        leaving: false,
      }
      setToasts(existing ? toasts.map((t) => (t.id === id ? data : t)) : [...toasts, data])
      return id
    },
    dismiss(id) {
      if (typeof window === "undefined") return
      const targets = toasts.filter((t) => !t.leaving && (id === undefined || t.id === id))
      if (targets.length === 0) return
      const ids = new Set(targets.map((t) => t.id))
      setToasts(toasts.map((t) => (ids.has(t.id) ? { ...t, leaving: true } : t)))
      setTimeout(() => {
        // Skip toasts that were revived by an update with the same id meanwhile.
        setToasts(toasts.filter((t) => !(ids.has(t.id) && t.leaving)))
      }, TOAST_EXIT_MS)
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    getSnapshot() {
      return toasts
    },
    getServerSnapshot() {
      return EMPTY
    },
  }
  return store
}
