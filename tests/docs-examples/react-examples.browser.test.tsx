// The React side of the docs example parity (see examples.ts).
import type { ComponentType } from "react"
import { afterEach, beforeEach, describe, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { expectExampleSnapshot, freezeToday, nameOf, svelteExampleNames } from "./examples"

const modules = import.meta.glob<{ default: ComponentType }>("../../apps/docs/examples/**/*.tsx")
const byName = new Map(Object.entries(modules).map(([file, load]) => [nameOf(file), load]))

describe("docs examples (react)", () => {
  beforeEach(freezeToday)
  afterEach(() => vi.useRealTimers())

  for (const name of svelteExampleNames) {
    it(name, async () => {
      const load = byName.get(name)
      if (!load) throw new Error(`${name}.svelte has no React example next to it`)
      const Example = (await load()).default
      await render(
        <div data-testid="example">
          <Example />
        </div>
      )
      await expectExampleSnapshot(name)
    })
  }
})
