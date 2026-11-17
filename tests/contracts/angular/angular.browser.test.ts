// The Angular render adapter for the contracts. Fixtures live in ./fixtures.ts. Zoneless: no zone.js.
import { TestBed } from "@angular/core/testing"
import type { Type } from "@angular/core"
import { AppShellFixture, AppShellProbeFixture, DialogFixture, PageFixture, SheetFixture, StackedFixture, StackedProbeFixture } from "./fixtures"
import { appShellLayoutContract } from "../app-shell-layout.contract"
import { dialogContract } from "../dialog.contract"
import { sheetContract } from "../sheet.contract"
import { layoutScrollContract } from "../layout-scroll.contract"
import { mobileNavContract } from "../mobile-nav.contract"
import { pageLayoutContract } from "../page-layout.contract"
import { stackedLayoutContract } from "../stacked-layout.contract"
import { classParityContract } from "../class-parity.contract"
import type { AppShellAdapter, DialogAdapter, LayoutScrollAdapter, PageLayoutAdapter, SheetAdapter, StackedLayoutAdapter } from "../types"

/** Creates the fixture, sets its inputs and renders it. The fixture stays attached to the document. */
async function mount<T>(component: Type<T>, inputs: Record<string, unknown> = {}): Promise<void> {
  const fixture = TestBed.createComponent(component)
  for (const [name, value] of Object.entries(inputs)) fixture.componentRef.setInput(name, value)
  fixture.detectChanges()
  await fixture.whenStable()
}

const angular = {
  name: "angular",
  async appShell(fixture) {
    await mount(AppShellFixture, { tall: fixture.tall })
  },
  async appShellProbe() {
    await mount(AppShellProbeFixture)
  },
  async stackedProbe() {
    await mount(StackedProbeFixture)
  },
  async dialog(fixture) {
    await mount(DialogFixture, { title: fixture.title, triggerLabel: fixture.triggerLabel, titleClass: fixture.titleClass ?? "", contentClass: fixture.contentClass ?? "" })
  },
  async sheet(fixture) {
    await mount(SheetFixture, { title: fixture.title, triggerLabel: fixture.triggerLabel })
  },
  async pageLayout() {
    await mount(PageFixture)
  },
  async stackedLayout() {
    await mount(StackedFixture)
  },
} satisfies AppShellAdapter & LayoutScrollAdapter & DialogAdapter & SheetAdapter & PageLayoutAdapter & StackedLayoutAdapter

appShellLayoutContract(angular)
layoutScrollContract(angular)
mobileNavContract(angular)
dialogContract(angular)
sheetContract(angular)
pageLayoutContract(angular)
stackedLayoutContract(angular)
classParityContract(angular)
