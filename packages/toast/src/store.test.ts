import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { toast, toastStore } from "./store"

// The store only runs when `window` exists (client). Stub it so the store logic runs in node.
const toasts = () => toastStore.getSnapshot()

beforeEach(() => {
  vi.stubGlobal("window", {})
  vi.useFakeTimers()
})

afterEach(() => {
  toast.dismiss()
  vi.runAllTimers()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe("toast store", () => {
  it("accepts the string overload as a title", () => {
    const id = toast("Saved")
    expect(toasts().find((t) => t.id === id)).toMatchObject({ title: "Saved", variant: "default" })
  })

  it("accepts the object overload with a description", () => {
    const id = toast({ title: "Upload", description: "3 files" })
    expect(toasts().find((t) => t.id === id)).toMatchObject({ title: "Upload", description: "3 files" })
  })

  it("maps the variant shortcuts to their variants", () => {
    toast.success("a")
    toast.error("b")
    toast.warning("c")
    toast.info("d")
    expect(toasts().map((t) => t.variant)).toEqual(["success", "danger", "warning", "info"])
  })

  it("keeps the queue in insertion order", () => {
    toast("first")
    toast("second")
    toast("third")
    expect(toasts().map((t) => t.title)).toEqual(["first", "second", "third"])
  })

  it("updates an existing toast when the same id is passed", () => {
    toast({ id: "sync", title: "Working" })
    toast({ id: "sync", title: "Done" })
    const matches = toasts().filter((t) => t.id === "sync")
    expect(matches).toHaveLength(1)
    expect(matches[0]).toMatchObject({ title: "Done", version: 2 })
  })

  it("keeps duration Infinity for sticky toasts", () => {
    const id = toast({ title: "Sticky", duration: Infinity })
    expect(toasts().find((t) => t.id === id)?.duration).toBe(Infinity)
  })

  it("defaults the duration to 5000 ms", () => {
    const id = toast("Default")
    expect(toasts().find((t) => t.id === id)?.duration).toBe(5000)
  })

  it("marks a dismissed toast as leaving, then removes it after the exit animation", () => {
    const keep = toast("keep")
    const gone = toast("gone")
    toast.dismiss(gone)
    expect(toasts().find((t) => t.id === gone)?.leaving).toBe(true)
    vi.advanceTimersByTime(199)
    expect(toasts().find((t) => t.id === gone)).toBeDefined()
    vi.advanceTimersByTime(1)
    expect(toasts().find((t) => t.id === gone)).toBeUndefined()
    expect(toasts().find((t) => t.id === keep)).toBeDefined()
  })

  it("dismisses every toast when called without an id", () => {
    toast("a")
    toast("b")
    toast.dismiss()
    expect(toasts().every((t) => t.leaving)).toBe(true)
    vi.runAllTimers()
    expect(toasts()).toEqual([])
  })

  it("notifies subscribers on change and stops after unsubscribe", () => {
    const listener = vi.fn()
    const unsubscribe = toastStore.subscribe(listener)
    toast("one")
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
    toast("two")
    expect(listener).toHaveBeenCalledTimes(1)
  })
})

describe("toast on the server", () => {
  it("returns an id and stores nothing when there is no window", () => {
    vi.unstubAllGlobals()
    const before = toasts().length
    const id = toast("server call")
    expect(typeof id).toBe("string")
    expect(toasts()).toHaveLength(before)
    expect(toastStore.getServerSnapshot()).toEqual([])
  })
})
