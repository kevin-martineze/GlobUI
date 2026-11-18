// The Svelte render adapter for the phase 10d-2 contracts: overlays.
import { render } from "vitest-browser-svelte"
import OverlaysGallery from "./OverlaysGallery.svelte"
import OverlaysFixture from "./OverlaysFixture.svelte"
import { toast } from "../../../packages/svelte/src/toast"
import { overlaysParityContract } from "../overlays-parity.contract"
import { overlaysContract } from "../overlays.contract"
import type { ContractToast, OverlaysAdapter } from "../types"

const mount = async (kind: string, props: object = {}) => {
  await render(OverlaysFixture, { props: { kind, props } })
}

const svelte: OverlaysAdapter = {
  name: "svelte",
  toast: toast as unknown as ContractToast,
  async overlaysGallery() {
    await render(OverlaysGallery)
  },
  popover: (f) => mount("popover", f),
  tooltip: (f) => mount("tooltip", f),
  dropdownMenu: (f) => mount("dropdownMenu", f),
  alertDialog: (f) => mount("alertDialog", f),
  toaster: (f) => mount("toaster", f),
  select: (f) => mount("select", f),
  combobox: (f) => mount("combobox", f),
  multiSelect: (f) => mount("multiSelect", f),
  command: (f) => mount("command", f),
  commandDialog: (f) => mount("commandDialog", f),
}

overlaysParityContract(svelte)
overlaysContract(svelte)
