// The Svelte render adapter for the phase 10d-4 contracts: data and dates.
import { render } from "vitest-browser-svelte"
import DataGallery from "./DataGallery.svelte"
import DataFixture from "./DataFixture.svelte"
import { dataParityContract } from "../data-parity.contract"
import { dataContract } from "../data.contract"
import type { DataAdapter } from "../types"

const mount = async (kind: string, props: object = {}) => {
  await render(DataFixture, { props: { kind, props } })
}

const svelte: DataAdapter = {
  name: "svelte",
  async dataGallery() {
    await render(DataGallery)
  },
  table: (f) => mount("table", f),
  dataTable: (f) => mount("dataTable", f),
  calendar: (f) => mount("calendar", f),
  datePicker: (f) => mount("datePicker", f),
  phoneInput: (f) => mount("phoneInput", f),
}

dataParityContract(svelte)
dataContract(svelte)
