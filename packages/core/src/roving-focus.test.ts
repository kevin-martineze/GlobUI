import { describe, expect, it } from "vitest"
import { nextRovingIndex } from "./roving-focus"

describe("nextRovingIndex", () => {
  it("returns null for keys that are not navigation keys", () => {
    expect(nextRovingIndex("a", 0, 3)).toBeNull()
    expect(nextRovingIndex("Enter", 0, 3)).toBeNull()
  })

  it("moves down and wraps when looping", () => {
    expect(nextRovingIndex("ArrowDown", 0, 3)).toBe(1)
    expect(nextRovingIndex("ArrowDown", 2, 3)).toBe(0)
    expect(nextRovingIndex("ArrowDown", 2, 3, { loop: false })).toBe(-1)
  })

  it("moves up and wraps when looping", () => {
    expect(nextRovingIndex("ArrowUp", 2, 3)).toBe(1)
    expect(nextRovingIndex("ArrowUp", 0, 3)).toBe(2)
    expect(nextRovingIndex("ArrowUp", 0, 3, { loop: false })).toBe(-1)
  })

  it("starts from the first item going forward and the last going back when none has focus", () => {
    expect(nextRovingIndex("ArrowDown", -1, 3)).toBe(0)
    expect(nextRovingIndex("ArrowUp", -1, 3)).toBe(2)
  })

  it("uses only the arrows of the orientation", () => {
    expect(nextRovingIndex("ArrowDown", 0, 3, { orientation: "horizontal" })).toBeNull()
    expect(nextRovingIndex("ArrowRight", 0, 3, { orientation: "horizontal" })).toBe(1)
    expect(nextRovingIndex("ArrowLeft", 1, 3, { orientation: "horizontal" })).toBe(0)
    expect(nextRovingIndex("ArrowRight", 0, 3, { orientation: "vertical" })).toBeNull()
    expect(nextRovingIndex("ArrowRight", 0, 3, { orientation: "both" })).toBe(1)
    expect(nextRovingIndex("ArrowUp", 1, 3, { orientation: "both" })).toBe(0)
  })

  it("jumps to the ends with Home and End", () => {
    expect(nextRovingIndex("Home", 2, 5)).toBe(0)
    expect(nextRovingIndex("End", 1, 5)).toBe(4)
  })

  it("returns null for an empty list", () => {
    expect(nextRovingIndex("ArrowDown", -1, 0)).toBeNull()
  })
})
