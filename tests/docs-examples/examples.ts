// The docs examples that have a Svelte version: apps/docs/examples/<group>/<name>.svelte next to the .tsx.
// Both frameworks render each one and match the same snapshot (snapshots/<group>/<name>.json, every element as
// "tag class"), so the Svelte code shown in the docs renders what the React preview shows.
import { expect, vi } from "vitest"

export const svelteExampleNames = Object.keys(import.meta.glob("../../apps/docs/examples/**/*.svelte")).map(nameOf).sort()

export function nameOf(file: string) {
  return file.replace(/^.*\/examples\//, "").replace(/\.(tsx|svelte)$/, "")
}

const rowsOf = (root: Element) =>
  Array.from(root.querySelectorAll("*")).map((el) => `${el.tagName.toLowerCase()} ${el.getAttribute("class") ?? ""}`.trim())

/** Waits for effects that run after mount (locale, measured positions), then matches the shared snapshot. */
export async function expectExampleSnapshot(name: string) {
  const root = document.querySelector('[data-testid="example"]')
  expect(root).not.toBeNull()
  await new Promise((resolve) => setTimeout(resolve, 50))
  await expect(JSON.stringify(rowsOf(root!), null, 2)).toMatchFileSnapshot(`./snapshots/${name}.json`)
}

// Examples such as the calendar mark today's date, so the snapshots would change every day. Only Date is faked;
// timers stay real.
export function freezeToday() {
  vi.useFakeTimers({ toFake: ["Date"] })
  vi.setSystemTime(new Date(2026, 5, 15, 12))
}
