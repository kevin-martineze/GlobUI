// The Svelte render adapter for the phase 10d-3 contracts: navigation.
import { render } from "vitest-browser-svelte"
import NavigationGallery from "./NavigationGallery.svelte"
import NavigationFixture from "./NavigationFixture.svelte"
import { navigationParityContract } from "../navigation-parity.contract"
import { navigationContract } from "../navigation.contract"
import type { NavigationAdapter } from "../types"

const mount = async (kind: string, props: object = {}) => {
  await render(NavigationFixture, { props: { kind, props } })
}

const svelte: NavigationAdapter = {
  name: "svelte",
  async navigationGallery() {
    await render(NavigationGallery)
  },
  tabs: (f) => mount("tabs", f),
  accordion: (f) => mount("accordion", f),
  paginationLinks: () => mount("paginationLinks"),
  paginationDisabledPrevious: () => mount("paginationDisabledPrevious"),
  paginationControlled: (f) => mount("paginationControlled", f),
}

navigationParityContract(svelte)
navigationContract(svelte)
