import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { Tooltip } from "./tooltip"
import { Button } from "../../button/src/button"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

const isOpen = () => !!document.querySelector('[role="tooltip"]:popover-open')

// Lets React commit work queued by an event or a fake timer. Each MessageChannel message is a
// macrotask, so a run of them lets React's scheduler task and its passive effects complete.
// Nothing waits on the real clock: the timer mock is advanced explicitly.
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

async function waitUntil(condition: () => boolean, attempts = 50) {
  for (let i = 0; i < attempts; i++) {
    if (condition()) return
    await flush()
  }
  throw new Error("condition not met after flushing React")
}

async function advance(ms: number) {
  vi.advanceTimersByTime(ms)
  await flush()
}

/** Points away from the trigger: a sibling far from it, so the pointer does not re-enter the trigger. */
function Scene(props: { content: string; children: React.ReactNode }) {
  return (
    <div>
      <Tooltip content={props.content}>{props.children}</Tooltip>
      <p>Elsewhere</p>
    </div>
  )
}

describe("Tooltip: keyboard and Escape", () => {
  it("opens at once on keyboard focus (focus-visible)", async () => {
    await render(
      <Scene content="Keyboard help">
        <Button>Info</Button>
      </Scene>
    )
    await userEvent.tab()
    await expect.element(page.getByRole("tooltip", { name: "Keyboard help" })).toBeVisible()
    await expectNoA11yViolations()
  })

  it("closes on Escape", async () => {
    await render(
      <Scene content="Escape me">
        <Button>Info</Button>
      </Scene>
    )
    await userEvent.tab()
    await expect.element(page.getByRole("tooltip", { name: "Escape me" })).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.poll(isOpen).toBe(false)
  })
})

describe("Tooltip: timing (fake timers)", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("opens on hover only after delayDuration (500 ms)", async () => {
    await render(
      <Scene content="Help text">
        <Button>Hover me</Button>
      </Scene>
    )
    // Synthetic pointerover (React derives onPointerEnter from it): a real hover moves the fake clock.
    page.getByRole("button", { name: "Hover me" }).element().dispatchEvent(
      new PointerEvent("pointerover", { bubbles: true, pointerType: "mouse", relatedTarget: document.body })
    )
    await waitUntil(() => vi.getTimerCount() > 0)
    await advance(499)
    expect(isOpen()).toBe(false)
    await advance(1)
    expect(isOpen()).toBe(true)
  })

  it("stays open while the pointer moves onto it", async () => {
    await render(
      <Scene content="Hoverable">
        <Button>Trigger</Button>
      </Scene>
    )
    await userEvent.hover(page.getByRole("button", { name: "Trigger" }))
    await advance(500)
    expect(isOpen()).toBe(true)

    await userEvent.hover(document.querySelector('[role="tooltip"]')!)
    await advance(1000)
    expect(isOpen()).toBe(true)
  })

  it("closes closeDelay (150 ms) after the pointer leaves the tooltip", async () => {
    await render(
      <Scene content="Leaves">
        <Button>Trigger</Button>
      </Scene>
    )
    await userEvent.hover(page.getByRole("button", { name: "Trigger" }))
    await advance(500)
    await userEvent.hover(document.querySelector('[role="tooltip"]')!)
    await flush()

    // Leave with a synthetic pointerout (React derives onPointerLeave from it). Unlike a real
    // pointer move, this does not move the fake clock, so the 150 ms boundary is exact.
    const tip = document.querySelector<HTMLElement>('[role="tooltip"]')!
    tip.dispatchEvent(new PointerEvent("pointerout", { bubbles: true, pointerType: "mouse", relatedTarget: document.body }))
    await waitUntil(() => vi.getTimerCount() > 0)
    await advance(149)
    expect(isOpen()).toBe(true)
    await advance(1)
    expect(isOpen()).toBe(false)
  })

  it("does not open for touch pointers", async () => {
    await render(
      <Scene content="Touch">
        <Button>Tap</Button>
      </Scene>
    )
    const trigger = page.getByRole("button", { name: "Tap" }).element()
    trigger.dispatchEvent(new PointerEvent("pointerover", { pointerType: "touch", bubbles: true }))
    trigger.dispatchEvent(new PointerEvent("pointerenter", { pointerType: "touch" }))
    await advance(2000)
    expect(isOpen()).toBe(false)
  })
})
