import { describe, expect, it } from "vitest"
import { matchesSearch, normalizeText } from "./text"

describe("normalizeText", () => {
  it("lowercases, strips accents and collapses spaces", () => {
    expect(normalizeText("  Canción   Árbol ")).toBe("cancion arbol")
  })
})

describe("matchesSearch", () => {
  it("matches accent-insensitively", () => {
    expect(matchesSearch("cancion", "Canción")).toBe(true)
    expect(matchesSearch("canción", "cancion")).toBe(true)
  })

  it("requires every word, in any order", () => {
    expect(matchesSearch("open file", "File: open")).toBe(true)
    expect(matchesSearch("open file", "File: save")).toBe(false)
  })

  it("matches the joined texts, so a word can come from any of them", () => {
    expect(matchesSearch("script react", "React", "typescript")).toBe(true)
  })

  it("matches everything for an empty or blank query", () => {
    expect(matchesSearch("", "anything")).toBe(true)
    expect(matchesSearch("   ")).toBe(true)
  })
})
