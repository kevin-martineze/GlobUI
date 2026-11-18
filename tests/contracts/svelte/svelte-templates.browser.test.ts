// The Svelte render adapter for the phase 10g-1 contracts: the templates.
import { render } from "vitest-browser-svelte"
import TemplatesFixture from "./TemplatesFixture.svelte"
import { templatesParityContract } from "../templates-parity.contract"
import { templatesContract } from "../templates.contract"
import type { TemplatesAdapter } from "../types"

const mount = async (kind: string, props: object) => {
  await render(TemplatesFixture, { props: { kind, props } })
}

const svelte: TemplatesAdapter = {
  name: "svelte",
  dashboard: (f) => mount("dashboard", f),
  listPage: (f) => mount("listPage", f),
  detailPage: (f) => mount("detailPage", f),
}

templatesParityContract(svelte)
templatesContract(svelte)
