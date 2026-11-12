// The React render adapter for the contracts. Each contract runs against these fixtures.
import { render } from "vitest-browser-react"
import { AppShellLayout } from "../../packages/app-shell-layout/src/app-shell-layout"
import { LayoutNavTrigger, useLayoutScroll } from "@glob-ui/layout"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@glob-ui/dialog"
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetClose } from "@glob-ui/sheet"
import { PageLayout, PageHeader } from "@glob-ui/page-layout"
import { StackedLayout } from "@glob-ui/stacked-layout"
import { Button } from "@glob-ui/button"
import { appShellLayoutContract } from "./app-shell-layout.contract"
import { dialogContract } from "./dialog.contract"
import { sheetContract } from "./sheet.contract"
import { layoutScrollContract } from "./layout-scroll.contract"
import { mobileNavContract } from "./mobile-nav.contract"
import { pageLayoutContract } from "./page-layout.contract"
import { stackedLayoutContract } from "./stacked-layout.contract"
import type {
  AppShellAdapter,
  AppShellFixture,
  DialogAdapter,
  DialogFixture,
  LayoutScrollAdapter,
  PageLayoutAdapter,
  SheetAdapter,
  SheetFixture,
  StackedLayoutAdapter,
} from "./types"

function Shell({ tall }: AppShellFixture) {
  const rows = Array.from({ length: tall ? 60 : 0 }, (_, i) => <p key={i}>Row {i}</p>)
  return (
    <AppShellLayout
      header={
        <>
          <LayoutNavTrigger />
          <strong>Acme</strong>
        </>
      }
      sidebar={
        <>
          <a href="#orders" aria-current="page">Orders</a>
          <a href="#customers">Customers</a>
        </>
      }
    >
      <h2>Orders</h2>
      {rows}
    </AppShellLayout>
  )
}

function Probe() {
  const el = useLayoutScroll()
  return <span data-testid="probe">{el ? el.tagName : "none"}</span>
}

function DialogView({ title, triggerLabel }: DialogFixture) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>Are you sure?</DialogDescription>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

function SheetView({ title, triggerLabel }: SheetFixture) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>{triggerLabel}</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetTitle>{title}</SheetTitle>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}

const react: AppShellAdapter & LayoutScrollAdapter & DialogAdapter & SheetAdapter & PageLayoutAdapter & StackedLayoutAdapter = {
  name: "react",
  async appShell(fixture) {
    await render(<Shell {...fixture} />)
  },
  async appShellProbe() {
    await render(
      <AppShellLayout>
        <Probe />
      </AppShellLayout>
    )
  },
  async stackedProbe() {
    await render(
      <StackedLayout>
        <Probe />
      </StackedLayout>
    )
  },
  async dialog(fixture) {
    await render(<DialogView {...fixture} />)
  },
  async sheet(fixture) {
    await render(<SheetView {...fixture} />)
  },
  async pageLayout() {
    await render(
      <PageLayout
        header={
          <PageHeader
            breadcrumbs={<a href="#home">Home</a>}
            title="Invoices"
            description="Last 30 days"
            actions={<Button>New invoice</Button>}
          />
        }
        aside={<p>Filters</p>}
      >
        <p>Content</p>
      </PageLayout>
    )
  },
  async stackedLayout() {
    await render(
      <StackedLayout
        header={
          <>
            <LayoutNavTrigger />
            <strong>Acme</strong>
          </>
        }
        footer={<p>Footer</p>}
        mobileNav={<a href="#orders">Orders</a>}
      >
        <h2>Page</h2>
      </StackedLayout>
    )
  },
}

appShellLayoutContract(react)
layoutScrollContract(react)
mobileNavContract(react)
dialogContract(react)
sheetContract(react)
pageLayoutContract(react)
stackedLayoutContract(react)
