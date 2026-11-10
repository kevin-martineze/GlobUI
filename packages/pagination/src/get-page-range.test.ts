import { describe, expect, it } from "vitest"
import { getPageRange } from "./get-page-range"

describe("getPageRange", () => {
  it("shows the first and last pages with an ellipsis for the hidden middle", () => {
    expect(getPageRange({ page: 1, pageCount: 10 })).toEqual([1, 2, "ellipsis", 10])
    expect(getPageRange({ page: 10, pageCount: 10 })).toEqual([1, "ellipsis", 9, 10])
  })

  it("shows both ellipses around the current page in the middle", () => {
    expect(getPageRange({ page: 5, pageCount: 10 })).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10])
  })

  it("shows a single hidden page instead of an ellipsis", () => {
    // Pages 1, 3-5 and 7 around page 4 of 7: page 2 and page 6 are one page each, so they are shown.
    expect(getPageRange({ page: 4, pageCount: 7 })).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it("has no ellipsis for a small page count", () => {
    expect(getPageRange({ page: 2, pageCount: 3 })).toEqual([1, 2, 3])
    expect(getPageRange({ page: 1, pageCount: 1 })).toEqual([1])
  })

  it("returns nothing for no pages", () => {
    expect(getPageRange({ page: 1, pageCount: 0 })).toEqual([])
  })

  it("clamps the page into range", () => {
    expect(getPageRange({ page: 99, pageCount: 5 })).toEqual(getPageRange({ page: 5, pageCount: 5 }))
    expect(getPageRange({ page: -3, pageCount: 5 })).toEqual(getPageRange({ page: 1, pageCount: 5 }))
  })

  it("widens the window with siblings and boundaries", () => {
    expect(getPageRange({ page: 10, pageCount: 20, siblings: 2, boundaries: 2 })).toEqual([
      1, 2, "ellipsis", 8, 9, 10, 11, 12, "ellipsis", 19, 20,
    ])
  })
})
