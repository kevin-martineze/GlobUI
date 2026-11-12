// The React render adapter for the contracts. Each contract runs against these fixtures.
import { render } from "vitest-browser-react"
import { AppShellLayout } from "../../packages/app-shell-layout/src/app-shell-layout"
import { LayoutNavTrigger } from "@glob-ui/layout"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@glob-ui/dialog"
import { Button } from "@glob-ui/button"
import { appShellLayoutContract } from "./app-shell-layout.contract"
import { dialogContract } from "./dialog.contract"
import type { AppShellFixture, DialogFixture, RenderAdapter } from "./types"

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

function DialogFixtureView({ title, triggerLabel }: DialogFixture) {
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

const react: RenderAdapter = {
  name: "react",
  async appShell(fixture) {
    await render(<Shell {...fixture} />)
  },
  async dialog(fixture) {
    await render(<DialogFixtureView {...fixture} />)
  },
}

appShellLayoutContract(react)
dialogContract(react)
