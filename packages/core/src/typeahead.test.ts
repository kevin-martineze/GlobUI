import { describe, expect, it } from "vitest"
import { createTypeahead, findTypeaheadIndex } from "./typeahead"

const texts = ["Apple", "Apricot", "Banana", "blueberry", "Cherry"]

describe("findTypeaheadIndex", () => {
  it("finds the next item starting with a single letter, after the active one", () => {
    expect(findTypeaheadIndex(texts, "b", -1)).toBe(2)
    expect(findTypeaheadIndex(texts, "b", 2)).toBe(3)
  })

  it("cycles through the items with a repeated letter", () => {
    expect(findTypeaheadIndex(texts, "aa", 0)).toBe(1)
    expect(findTypeaheadIndex(texts, "aa", 1)).toBe(0)
    // A repeat searches the letter from the item after the active one.
    expect(findTypeaheadIndex(texts, "aaa", 0)).toBe(1)
  })

  it("keeps the active item for a longer prefix", () => {
    expect(findTypeaheadIndex(texts, "ap", 0)).toBe(0)
    expect(findTypeaheadIndex(texts, "apr", 0)).toBe(1)
  })

  it("is case-insensitive and wraps around", () => {
    expect(findTypeaheadIndex(texts, "c", 4)).toBe(4)
    expect(findTypeaheadIndex(texts, "a", 4)).toBe(0)
  })

  it("returns -1 when nothing matches or the list is empty", () => {
    expect(findTypeaheadIndex(texts, "z", 0)).toBe(-1)
    expect(findTypeaheadIndex([], "a", -1)).toBe(-1)
    expect(findTypeaheadIndex(texts, "", 0)).toBe(-1)
  })
})

describe("createTypeahead", () => {
  it("accumulates typed characters until reset", () => {
    const typeahead = createTypeahead(10_000)
    expect(typeahead.type("b", texts, -1)).toBe(2)
    expect(typeahead.type("l", texts, 2)).toBe(3)
    typeahead.reset()
    expect(typeahead.type("c", texts, 3)).toBe(4)
  })
})
