// The Svelte side of the docs example parity (see examples.ts).
import type { Component } from "svelte"
import { afterEach, beforeEach, describe, it, vi } from "vitest"
import { render } from "vitest-browser-svelte"
import ExampleHost from "./ExampleHost.svelte"
import { expectExampleSnapshot, freezeToday, nameOf, svelteExampleNames } from "./examples"

const modules = import.meta.glob<{ default: Component }>("../../apps/docs/examples/**/*.svelte")
const byName = new Map(Object.entries(modules).map(([file, load]) => [nameOf(file), load]))

describe("docs examples (svelte)", () => {
  beforeEach(freezeToday)
  afterEach(() => vi.useRealTimers())

  for (const name of svelteExampleNames) {
    it(name, async () => {
      const example = (await byName.get(name)!()).default
      await render(ExampleHost, { props: { example } })
      await expectExampleSnapshot(name)
    })
  }
})
