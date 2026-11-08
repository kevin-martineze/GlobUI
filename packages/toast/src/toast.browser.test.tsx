import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { Toaster, toast } from "./index"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../../dialog/src/dialog"
import { Button } from "../../button/src/button"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

// The store and the Toaster share module state, so every test starts from an empty store.
// Fake timers drive durations and the 200 ms exit animation; React is flushed with macrotasks.
beforeEach(() => vi.useFakeTimers())
afterEach(async () => {
  toast.dismiss()
  if (vi.isFakeTimers()) {
    vi.advanceTimersByTime(300)
    await flush()
    vi.useRealTimers()
  }
  // Wait until the exit animation has removed everything (real clock, no fixed sleep).
  await vi.waitFor(() => expect(document.querySelectorAll("[data-glob-toaster] li")).toHaveLength(0))
})

async function flush() {
  for (let i = 0; i < 3; i++) {
    await new Promise<void>((resolve) => {
      const channel = new MessageChannel()
      channel.port1.onmessage = () => {
        channel.port1.close()
        resolve()
      }
      channel.port2.postMessage(null)
    })
  }
}

async function advance(ms: number) {
  vi.advanceTimersByTime(ms)
  await flush()
}

const items = () => Array.from(document.querySelectorAll('[data-glob-toaster] li'))
const region = (role: "status" | "alert") => document.querySelector(`[data-glob-toaster] [role="${role}"]`)?.textContent ?? ""
const toasterOpen = () => !!document.querySelector('[data-glob-toaster] section:popover-open')

describe("Toast: variants and live regions", () => {
  it("routes polite variants to role=status and urgent ones to role=alert", async () => {
    // Five toasts: the default max of 3 would queue the last two.
    await render(<Toaster max={5} />)
    toast({ title: "Default one" })
    toast.success("Saved")
    toast.info("FYI")
    toast.warning("Careful")
    toast.error("Broke")
    await flush()

    expect(region("status")).toContain("Default one")
    expect(region("status")).toContain("Saved")
    expect(region("status")).toContain("FYI")
    expect(region("status")).not.toContain("Careful")
    expect(region("alert")).toContain("Careful")
    expect(region("alert")).toContain("Broke")
    expect(items()).toHaveLength(5)
    // axe schedules its own timers, which the fake clock would never run.
    vi.useRealTimers()
    await expectNoA11yViolations()
  })

  it("keeps both live regions in the DOM before any toast arrives", async () => {
    await render(<Toaster />)
    await expect.element(page.getByRole("status")).toBeInTheDocument()
    await expect.element(page.getByRole("alert")).toBeInTheDocument()
    expect(region("status")).toBe("")
    expect(toasterOpen()).toBe(false)
  })

  it("shows the title and description of a toast", async () => {
    await render(<Toaster />)
    toast({ title: "Upload", description: "3 files" })
    await flush()
    await expect.element(page.getByText("Upload")).toBeVisible()
    await expect.element(page.getByText("3 files")).toBeVisible()
  })
})

describe("Toast: lifetime", () => {
  it("auto-dismisses after its duration", async () => {
    await render(<Toaster />)
    toast({ title: "Short", duration: 1000 })
    await flush()
    expect(items()).toHaveLength(1)
    await advance(999)
    expect(items()).toHaveLength(1)
    await advance(1 + 200)
    expect(items()).toHaveLength(0)
  })

  it("keeps a sticky toast (duration Infinity) until it is closed", async () => {
    await render(<Toaster />)
    toast({ title: "Sticky", duration: Infinity })
    await flush()
    await advance(60_000)
    expect(items()).toHaveLength(1)

    await userEvent.click(page.getByRole("button", { name: "Close notification" }))
    await advance(300)
    expect(items()).toHaveLength(0)
  })

  it("pauses while hovered and resumes the remaining time on leave", async () => {
    await render(<Toaster />)
    toast({ title: "Hover me", duration: 1000 })
    await flush()

    await userEvent.hover(items()[0])
    await flush()
    await advance(5000)
    expect(items()).toHaveLength(1)

    await userEvent.hover(document.body, { position: { x: 4, y: 4 } })
    await flush()
    await advance(999)
    expect(items()).toHaveLength(1)
    await advance(1 + 200)
    expect(items()).toHaveLength(0)
  })

  it("dismiss(id) removes only that toast; dismiss() removes all", async () => {
    await render(<Toaster />)
    const keep = toast("keep", { duration: Infinity })
    const drop = toast("drop", { duration: Infinity })
    toast.dismiss(drop)
    await advance(300)
    expect(items().map((li) => li.textContent)).toEqual(["keep"])
    toast.dismiss()
    await advance(300)
    expect(items()).toHaveLength(0)
    expect(keep).not.toBe(drop)
  })

  it("accepts the string overload: toast(title, options)", async () => {
    await render(<Toaster />)
    toast("Plain title", { description: "with options" })
    await flush()
    await expect.element(page.getByText("Plain title")).toBeVisible()
    await expect.element(page.getByText("with options")).toBeVisible()
  })
})

describe("Toast: actions and max", () => {
  it("runs the action and dismisses the toast", async () => {
    const onClick = vi.fn()
    await render(<Toaster />)
    toast({ title: "Archived", duration: Infinity, action: { label: "Undo", onClick } })
    await flush()
    await userEvent.click(page.getByRole("button", { name: "Undo" }))
    expect(onClick).toHaveBeenCalledOnce()
    await advance(300)
    expect(items()).toHaveLength(0)
  })

  it("shows max toasts at once and queues the rest", async () => {
    await render(<Toaster max={3} />)
    for (let i = 1; i <= 5; i++) toast({ title: `Toast ${i}`, duration: Infinity })
    await flush()
    expect(items().map((li) => li.textContent)).toEqual(["Toast 1", "Toast 2", "Toast 3"])
    // Queued toasts are in the store, not on screen.
    expect(page.getByText("Toast 4").elements()).toHaveLength(0)

    await userEvent.click(page.getByRole("button", { name: "Close notification" }).first().element())
    await advance(300)
    expect(items().map((li) => li.textContent)).toEqual(["Toast 2", "Toast 3", "Toast 4"])
  })

  it("the Toaster position prop places the container", async () => {
    await render(<Toaster position="top-left" />)
    toast("Positioned")
    await flush()
    const section = document.querySelector("[data-glob-toaster] section") as HTMLElement
    expect(section.className).toContain("top-0")
    expect(section.className).toContain("left-0")
  })
})

describe("Toast inside a modal dialog", () => {
  it("is shown above the dialog, not inert, and its buttons are clickable", async () => {
    const onUndo = vi.fn()
    await render(
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Settings</DialogTitle>
            <Button onClick={() => toast({ title: "Draft saved", duration: Infinity, action: { label: "Undo", onClick: onUndo } })}>
              Save draft
            </Button>
          </DialogContent>
        </Dialog>
        <Toaster />
      </div>
    )
    await userEvent.click(page.getByRole("button", { name: "Open dialog" }))
    await expect.element(page.getByRole("dialog", { name: "Settings" })).toBeVisible()
    await userEvent.click(page.getByRole("button", { name: "Save draft" }))
    await flush()

    const host = document.querySelector("[data-glob-toaster]")!
    expect(host.parentElement?.tagName).toBe("DIALOG")
    expect(host.closest("[inert]")).toBeNull()

    const undo = page.getByRole("button", { name: "Undo" }).element() as HTMLElement
    const rect = undo.getBoundingClientRect()
    const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
    expect(undo.contains(hit)).toBe(true)

    await userEvent.click(page.getByRole("button", { name: "Undo" }))
    expect(onUndo).toHaveBeenCalledOnce()
    // The dialog is still open after the toast action.
    expect((document.querySelector("dialog") as HTMLDialogElement).open).toBe(true)
  })
})
