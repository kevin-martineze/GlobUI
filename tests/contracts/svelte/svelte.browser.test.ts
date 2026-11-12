// The Svelte render adapter for the contracts. Each contract runs against the Svelte fixtures in this folder.
import { render } from "vitest-browser-svelte"
import Shell from "./Shell.svelte"
import AppShellProbe from "./AppShellProbe.svelte"
import StackedProbe from "./StackedProbe.svelte"
import DialogFixture from "./DialogFixture.svelte"
import SheetFixture from "./SheetFixture.svelte"
import PageFixture from "./PageFixture.svelte"
import StackedFixture from "./StackedFixture.svelte"
import { appShellLayoutContract } from "../app-shell-layout.contract"
import { dialogContract } from "../dialog.contract"
import { sheetContract } from "../sheet.contract"
import { layoutScrollContract } from "../layout-scroll.contract"
import { mobileNavContract } from "../mobile-nav.contract"
import { pageLayoutContract } from "../page-layout.contract"
import { stackedLayoutContract } from "../stacked-layout.contract"
import type {
  AppShellAdapter,
  DialogAdapter,
  LayoutScrollAdapter,
  PageLayoutAdapter,
  SheetAdapter,
  StackedLayoutAdapter,
} from "../types"

const svelte = {
  name: "svelte",
  async appShell(fixture) {
    render(Shell, { props: fixture })
  },
  async appShellProbe() {
    render(AppShellProbe)
  },
  async stackedProbe() {
    render(StackedProbe)
  },
  async dialog(fixture) {
    render(DialogFixture, { props: fixture })
  },
  async sheet(fixture) {
    render(SheetFixture, { props: fixture })
  },
  async pageLayout() {
    render(PageFixture)
  },
  async stackedLayout() {
    render(StackedFixture)
  },
} satisfies AppShellAdapter & LayoutScrollAdapter & DialogAdapter & SheetAdapter & PageLayoutAdapter & StackedLayoutAdapter

appShellLayoutContract(svelte)
layoutScrollContract(svelte)
mobileNavContract(svelte)
dialogContract(svelte)
sheetContract(svelte)
pageLayoutContract(svelte)
stackedLayoutContract(svelte)
