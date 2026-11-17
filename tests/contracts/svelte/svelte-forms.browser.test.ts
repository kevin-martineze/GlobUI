// The Svelte render adapter for the phase 10d-1 contracts: forms and primitives.
import { flushSync } from "svelte"
import { render } from "vitest-browser-svelte"
import FormsGallery from "./FormsGallery.svelte"
import FormsFixture from "./FormsFixture.svelte"
import { formsParityContract } from "../forms-parity.contract"
import { formsContract } from "../forms.contract"
import type { FormsAdapter } from "../types"

const mount = async (kind: string, props: object = {}) => render(FormsFixture, { props: { kind, props } })

const svelte: FormsAdapter = {
  name: "svelte",
  async formsGallery() {
    render(FormsGallery)
  },
  button: (f) => mount("button", f).then(() => {}),
  buttonLink: (f) => mount("buttonLink", f).then(() => {}),
  fieldWithInput: (f) => mount("fieldWithInput", f).then(() => {}),
  fieldWithRadioGroup: (f) => mount("fieldWithRadioGroup", f).then(() => {}),
  fieldWithCheckbox: (f) => mount("fieldWithCheckbox", f).then(() => {}),
  fieldWithSlider: (f) => mount("fieldWithSlider", f).then(() => {}),
  checkbox: (f) => mount("checkbox", f).then(() => {}),
  switch: (f) => mount("switch", f).then(() => {}),
  radioGroup: (f) => mount("radioGroup", f).then(() => {}),
  separator: () => mount("separator").then(() => {}),
  async avatar(f) {
    const screen = await mount("avatar", f)
    return {
      async setSrc(src) {
        screen.component.setAvatarSrc(src)
        flushSync()
      },
    }
  },
  progress: (f) => mount("progress", f).then(() => {}),
  slider: (f) => mount("slider", f).then(() => {}),
  toggle: (f) => mount("toggle", f).then(() => {}),
  toggleGroup: (f) => mount("toggleGroup", f).then(() => {}),
  segmented: (f) => mount("segmented", f).then(() => {}),
}

formsParityContract(svelte)
formsContract(svelte)
