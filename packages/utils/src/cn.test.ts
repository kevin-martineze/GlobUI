import { describe, expect, it } from "vitest"
import { cn } from "./index"

describe("cn", () => {
  it("lets a later glob radius replace an earlier one", () => {
    expect(cn("rounded-glob-sm", "rounded-glob-lg")).toBe("rounded-glob-lg")
  })

  it("lets a consumer's default radius replace a glob radius", () => {
    expect(cn("rounded-glob-md", "rounded-full")).toBe("rounded-full")
  })

  it("merges glob shadows", () => {
    expect(cn("shadow-glob-sm", "shadow-glob-md")).toBe("shadow-glob-md")
  })

  it("drops falsy inputs and keeps the rest", () => {
    expect(cn("p-2", false, null, undefined, "p-4 text-sm")).toBe("p-4 text-sm")
  })
})
