import { describe, expect, it, vi } from "vitest"
import { composeRefs, mergeProps } from "./slot"

describe("mergeProps", () => {
  it("runs the child handler first, then the slot handler", () => {
    const order: string[] = []
    const merged = mergeProps(
      { onClick: () => order.push("slot") },
      { onClick: () => order.push("child") }
    )
    ;(merged.onClick as () => void)()
    expect(order).toEqual(["child", "slot"])
  })

  it("skips the slot handler when the child called preventDefault", () => {
    const slotHandler = vi.fn()
    const merged = mergeProps(
      { onClick: slotHandler },
      { onClick: (e: { defaultPrevented: boolean }) => e.defaultPrevented = true }
    )
    ;(merged.onClick as (e: object) => void)({ defaultPrevented: false })
    expect(slotHandler).not.toHaveBeenCalled()
  })

  it("passes the slot handler through when the child did not prevent", () => {
    const slotHandler = vi.fn()
    const merged = mergeProps({ onClick: slotHandler }, { onClick: vi.fn() })
    ;(merged.onClick as (e: object) => void)({ defaultPrevented: false })
    expect(slotHandler).toHaveBeenCalledOnce()
  })

  it("joins className with the child's classes winning on conflicts", () => {
    expect(mergeProps({ className: "p-2 text-sm" }, { className: "p-4" }).className).toBe("text-sm p-4")
  })

  it("merges style objects with the child winning", () => {
    expect(mergeProps({ style: { color: "red", margin: 0 } }, { style: { color: "blue" } }).style).toEqual({
      color: "blue",
      margin: 0,
    })
  })

  it("does not let an undefined child prop erase a slot prop", () => {
    expect(mergeProps({ id: "slot-id" }, { id: undefined }).id).toBe("slot-id")
  })

  it("lets a defined child prop override a slot prop", () => {
    expect(mergeProps({ role: "button" }, { role: "link" }).role).toBe("link")
  })
})

describe("composeRefs", () => {
  it("writes the node into callback refs and object refs", () => {
    const node = {} as HTMLElement
    const callback = vi.fn()
    const object = { current: null as HTMLElement | null }
    composeRefs<HTMLElement>(callback, object)(node)
    expect(callback).toHaveBeenCalledWith(node)
    expect(object.current).toBe(node)
  })

  it("ignores undefined refs", () => {
    expect(() => composeRefs<HTMLElement>(undefined, undefined)({} as HTMLElement)).not.toThrow()
  })
})
