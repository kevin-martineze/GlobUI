import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createToastStore, TOAST_DEFAULT_DURATION, TOAST_EXIT_MS } from "./toast"

describe("createToastStore", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal("window", {})
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it("adds a toast with defaults and returns its id", () => {
    const store = createToastStore<string>()
    const id = store.show({ title: "Saved" })
    const [toast] = store.getSnapshot()
    expect(toast).toMatchObject({ id, title: "Saved", variant: "default", duration: TOAST_DEFAULT_DURATION, version: 1, leaving: false })
  })

  it("updates in place when the id is reused and bumps the version", () => {
    const store = createToastStore<string>()
    store.show({ id: "x", title: "one" })
    store.show({ id: "x", title: "two", variant: "success" })
    expect(store.getSnapshot()).toHaveLength(1)
    expect(store.getSnapshot()[0]).toMatchObject({ title: "two", variant: "success", version: 2 })
  })

  it("marks a toast as leaving, then removes it after the exit time", () => {
    const store = createToastStore<string>()
    const id = store.show({ title: "bye" })
    store.dismiss(id)
    expect(store.getSnapshot()[0].leaving).toBe(true)
    vi.advanceTimersByTime(TOAST_EXIT_MS)
    expect(store.getSnapshot()).toHaveLength(0)
  })

  it("notifies subscribers on change and stops after unsubscribe", () => {
    const store = createToastStore<string>()
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)
    store.show({ title: "a" })
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
    store.show({ title: "b" })
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it("is a no-op on the server", () => {
    vi.stubGlobal("window", undefined)
    const store = createToastStore<string>()
    store.show({ title: "ignored" })
    expect(store.getSnapshot()).toHaveLength(0)
    expect(store.getServerSnapshot()).toHaveLength(0)
  })
})
