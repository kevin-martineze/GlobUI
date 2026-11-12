// The Vue render adapter for the contracts. Each contract runs against the Vue fixtures in this folder.
import { render } from "vitest-browser-vue"
import Shell from "./Shell.vue"
import AppShellProbe from "./AppShellProbe.vue"
import StackedProbe from "./StackedProbe.vue"
import DialogFixture from "./DialogFixture.vue"
import SheetFixture from "./SheetFixture.vue"
import PageFixture from "./PageFixture.vue"
import StackedFixture from "./StackedFixture.vue"
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

const vue = {
  name: "vue",
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

appShellLayoutContract(vue)
layoutScrollContract(vue)
mobileNavContract(vue)
dialogContract(vue)
sheetContract(vue)
pageLayoutContract(vue)
stackedLayoutContract(vue)
