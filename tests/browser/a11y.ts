import axe from "axe-core"
import { expect } from "vitest"

/**
 * Runs axe-core on the whole test page and fails on serious and critical violations.
 * Call it with the component in its main state (open, selected, invalid, ...).
 * Waits for running CSS transitions and animations first: colours mid-fade fail contrast checks.
 *
 * On failure the message lists, for each node: its CSS target, a snippet of its HTML, and axe's
 * own data for the failing check (for color-contrast: fgColor, bgColor, contrastRatio, fontSize,
 * expectedContrastRatio), so a CI log is enough to diagnose the element.
 */
export async function expectNoA11yViolations() {
  await Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined)))
  const result = await axe.run(document.body, {
    resultTypes: ["violations"],
  })
  const blocking = result.violations.filter((v) => v.impact === "serious" || v.impact === "critical")
  expect(blocking.map(describeViolation)).toEqual([])
}

function describeViolation(v: axe.Result): string {
  const nodes = v.nodes.map((n) => {
    const checks = [...n.any, ...n.all, ...n.none].map((c) => `      ${c.id}: ${c.message}\n        data: ${JSON.stringify(c.data)}`)
    return [`    target: ${n.target.join(" ")}`, `    html: ${n.html.slice(0, 200)}`, ...checks].join("\n")
  })
  return `${v.id} (${v.impact}): ${v.help}\n${nodes.join("\n")}`
}
