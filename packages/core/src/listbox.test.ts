import { describe, expect, it } from "vitest"
import { LISTBOX_PAGE_SIZE, listboxKeyMove, listboxOptionId, isPrintableKey, moveListboxIndex } from "./listbox"

describe("moveListboxIndex", () => {
  it("moves next and prev, clamped to the ends", () => {
    expect(moveListboxIndex(0, 3, "next")).toBe(1)
    expect(moveListboxIndex(2, 3, "next")).toBe(2)
    expect(moveListboxIndex(1, 3, "prev")).toBe(0)
    expect(moveListboxIndex(0, 3, "prev")).toBe(0)
  })

  it("starts from the first option going next, and the last going prev, when none is active", () => {
    expect(moveListboxIndex(-1, 3, "next")).toBe(0)
    expect(moveListboxIndex(-1, 3, "prev")).toBe(2)
  })

  it("jumps to the first and last options", () => {
    expect(moveListboxIndex(1, 5, "first")).toBe(0)
    expect(moveListboxIndex(1, 5, "last")).toBe(4)
  })

  it("pages by the page size, clamped", () => {
    expect(moveListboxIndex(0, 50, "pageDown")).toBe(LISTBOX_PAGE_SIZE)
    expect(moveListboxIndex(45, 50, "pageDown")).toBe(49)
    expect(moveListboxIndex(3, 50, "pageUp")).toBe(0)
    expect(moveListboxIndex(-1, 50, "pageDown")).toBe(LISTBOX_PAGE_SIZE)
  })
})

describe("listboxKeyMove", () => {
  it("maps keys to moves and skips Home/End when homeEnd is false", () => {
    expect(listboxKeyMove("ArrowDown")).toBe("next")
    expect(listboxKeyMove("ArrowUp")).toBe("prev")
    expect(listboxKeyMove("PageDown")).toBe("pageDown")
    expect(listboxKeyMove("Home")).toBe("first")
    expect(listboxKeyMove("Home", { homeEnd: false })).toBeNull()
    expect(listboxKeyMove("a")).toBeNull()
  })
})

describe("isPrintableKey", () => {
  const base = { ctrlKey: false, metaKey: false, altKey: false }
  it("accepts one printable character without modifiers, but not space", () => {
    expect(isPrintableKey({ ...base, key: "a" })).toBe(true)
    expect(isPrintableKey({ ...base, key: " " })).toBe(false)
    expect(isPrintableKey({ ...base, key: "ArrowDown" })).toBe(false)
    expect(isPrintableKey({ ...base, key: "a", ctrlKey: true })).toBe(false)
  })
})

describe("listboxOptionId", () => {
  it("encodes the option key so any value makes a valid id part", () => {
    expect(listboxOptionId("list", "US")).toBe("list-option-US")
    expect(listboxOptionId("list", "a b/c")).toBe("list-option-a%20b%2Fc")
  })
})
