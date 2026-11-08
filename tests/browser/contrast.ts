import { expect } from "vitest"

// axe-core does not check ::placeholder text, so the placeholder contrast is computed here from
// the computed styles, with WCAG 2.x relative luminance.

type Rgba = { r: number; g: number; b: number; a: number }

function parseColor(value: string): Rgba {
  const m = /rgba?\(([^)]+)\)/.exec(value)
  if (!m) throw new Error(`unsupported colour: ${value}`)
  const [r, g, b, a = "1"] = m[1].split(/[\s,/]+/).filter(Boolean)
  return { r: Number(r), g: Number(g), b: Number(b), a: Number(a) }
}

function luminance({ r, g, b }: Rgba) {
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

/** WCAG contrast ratio between two opaque colours. */
export function contrastRatio(a: Rgba, b: Rgba) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * The colour an element is painted on: its own background and its ancestors' backgrounds, composited
 * from the bottom up. Anything not painted (transparent all the way to the root) is white.
 */
export function effectiveBackground(element: Element): Rgba {
  const layers: Rgba[] = []
  for (let node: Element | null = element; node; node = node.parentElement) {
    const color = parseColor(getComputedStyle(node).backgroundColor)
    if (color.a > 0) layers.push(color)
    if (color.a >= 1) break
  }
  let base: Rgba = { r: 255, g: 255, b: 255, a: 1 }
  for (const layer of layers.reverse()) {
    if (layer.a >= 1) {
      base = layer
    } else {
      base = {
        r: layer.r * layer.a + base.r * (1 - layer.a),
        g: layer.g * layer.a + base.g * (1 - layer.a),
        b: layer.b * layer.a + base.b * (1 - layer.a),
        a: 1,
      }
    }
  }
  return base
}

/** Contrast of an element's ::placeholder text against the background it is painted on. */
export function placeholderContrast(element: Element) {
  const text = parseColor(getComputedStyle(element, "::placeholder").color)
  return contrastRatio(text, effectiveBackground(element))
}

/** Runs the callback with data-theme set, then restores the previous value. */
export async function withTheme<T>(theme: "light" | "dark", run: () => Promise<T>) {
  const root = document.documentElement
  const previous = root.getAttribute("data-theme")
  root.setAttribute("data-theme", theme)
  try {
    return await run()
  } finally {
    if (previous === null) root.removeAttribute("data-theme")
    else root.setAttribute("data-theme", previous)
  }
}

/**
 * Fails unless the placeholder meets WCAG AA (4.5:1) for normal text. Waits for running transitions
 * first: a theme switch animates background-color (transition-colors), and getComputedStyle
 * returns the value mid-animation until it settles.
 */
export async function expectPlaceholderContrast(element: Element, label: string) {
  await Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined)))
  const ratio = placeholderContrast(element)
  expect(ratio, `${label} placeholder contrast ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5)
}
