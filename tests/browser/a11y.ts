import axe from "axe-core"
import { expect } from "vitest"

/**
 * Runs axe-core on the whole test page and fails on serious and critical violations.
 * Call it with the component in its main state (open, selected, invalid, ...).
 * Waits for running CSS transitions and animations first: colours mid-fade fail contrast checks.
 */
export async function expectNoA11yViolations() {
  await Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined)))
  const result = await axe.run(document.body, {
    resultTypes: ["violations"],
  })
  const blocking = result.violations.filter((v) => v.impact === "serious" || v.impact === "critical")
  expect(
    blocking.map((v) => `${v.id} (${v.impact}): ${v.help} -> ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)
  ).toEqual([])
}
