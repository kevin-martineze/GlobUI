/** Lowercase, without accents or diacritics, trimmed, with runs of spaces collapsed. */
export function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
}

/**
 * True when every word of the query appears in the texts (in any order, ignoring case and accents).
 * An empty query matches everything.
 */
export function matchesSearch(query: string, ...texts: string[]) {
  const words = normalizeText(query).split(" ").filter(Boolean)
  if (words.length === 0) return true
  const haystack = normalizeText(texts.join(" "))
  return words.every((word) => haystack.includes(word))
}
